import pandas as pd
import psycopg2
import joblib
import os
from dotenv import load_dotenv
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

load_dotenv(dotenv_path=".env")
DATABASE_URL = os.getenv("DATABASE_URL")


def generate_label(row):
    """
    Business-rule labels from real Renew Mate data
    """
    # 💳 credit card + expensive = cheaper plan
    if row["auto_renew_risk"] == 1 and row["monthly_spending"] > 1000:
        return "cheaper_plan"

    # ❌ low usage + costly = cancel
    if row["active_usage_days"] < 5 and row["monthly_spending"] > 500:
        return "cancel_subscription"

    # ⚠️ too expensive overall
    if row["over_budget_flag"] == 1:
        return "cheaper_plan"

    return "same_plan"


def train_model():
    conn = psycopg2.connect(DATABASE_URL)

    query = """
    SELECT
        id,
        "serviceName",
        category,
        price,
        "billingCycle",
        "startDate",
        "renewalDate",
        "paymentMethod",
        status,
        "createdAt"
    FROM "Subscription"
    """

    df = pd.read_sql(query, conn)

    if df.empty:
        raise ValueError("No subscription data found")

    print(f"📊 Loaded {len(df)} rows from Neon")

    # -------------------------
    # Feature Engineering
    # -------------------------
    df["createdAt"] = pd.to_datetime(df["createdAt"])
    df["renewalDate"] = pd.to_datetime(df["renewalDate"])

    df["active_usage_days"] = (
        pd.Timestamp.now() - df["createdAt"]
    ).dt.days

    df["monthly_spending"] = df["price"]

    # 💳 credit-card auto renew risk
    df["auto_renew_risk"] = df["paymentMethod"].apply(
        lambda x: 1 if str(x).lower() == "credit_card" else 0
    )

    # 📅 days remaining
    df["days_to_renewal"] = (
        df["renewalDate"] - pd.Timestamp.now()
    ).dt.days

    # 💸 budget risk
    total_spend = df["monthly_spending"].sum()
    budget_limit = 2000

    df["over_budget_flag"] = df["monthly_spending"].apply(
        lambda x: 1 if total_spend > budget_limit else 0
    )

    # -------------------------
    # Encode categorical columns
    # -------------------------
    encoders = {}

    categorical_cols = [
        "serviceName",
        "category",
        "billingCycle",
        "paymentMethod",
        "status"
    ]

    for col in categorical_cols:
        df[col] = df[col].fillna("unknown")
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        encoders[col] = le

    # -------------------------
    # Target labels
    # -------------------------
    df["recommended_plan"] = df.apply(generate_label, axis=1)

    target_encoder = LabelEncoder()
    df["recommended_plan"] = target_encoder.fit_transform(
        df["recommended_plan"]
    )
    encoders["recommended_plan"] = target_encoder

    # -------------------------
    # Train Model
    # -------------------------
    feature_cols = [
        "monthly_spending",
        "serviceName",
        "category",
        "billingCycle",
        "paymentMethod",
        "status",
        "active_usage_days",
        "auto_renew_risk",
        "days_to_renewal",
        "over_budget_flag"
    ]

    X = df[feature_cols]
    y = df["recommended_plan"]

    model = RandomForestClassifier(
        n_estimators=150,
        random_state=42
    )

    model.fit(X, y)

    # 💾 save files
    joblib.dump(model, "subscription_ai_model.pkl")
    joblib.dump(encoders, "label_encoders.pkl")

    print("✅ Model trained successfully")
    print("💾 Saved:")
    print("   - subscription_ai_model.pkl")
    print("   - label_encoders.pkl")


if __name__ == "__main__":
    train_model()