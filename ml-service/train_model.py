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
    spend = row["monthly_spending"]
    usage = row["active_usage_days"]
    days_left = row["days_to_renewal"]
    auto_risk = row["auto_renew_risk"]
    over_budget = row["over_budget_flag"]

    # ❌ very low usage + expensive
    if usage <= 3 and spend > 500:
        return "cancel_subscription"

    # 💸 expensive but still somewhat used
    if over_budget or spend > 1000:
        return "downgrade_plan"

    # ⚠️ auto renew soon
    if auto_risk and days_left <= 5:
        return "review_plan"

    return "same_plan"


def normalize_price(row):
    price = float(row["price"])
    cycle = str(row["billingCycle"]).upper()

    if cycle == "YEARLY":
        return price / 12
    elif cycle == "WEEKLY":
        return price * 4
    return price


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
    ).dt.days.clip(lower=1)

    # ✅ normalized spend
    df["monthly_spending"] = df.apply(normalize_price, axis=1)

    # ✅ payment risk
    df["auto_renew_risk"] = df["paymentMethod"].apply(
        lambda x: 1 if "credit" in str(x).lower() else 0
    )

    # ✅ days left
    df["days_to_renewal"] = (
        df["renewalDate"] - pd.Timestamp.now()
    ).dt.days

    # ✅ personalized budget
    avg_spend = df["monthly_spending"].mean()

    df["over_budget_flag"] = df["monthly_spending"].apply(
        lambda x: 1 if x > avg_spend * 1.5 else 0
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
        n_estimators=200,
        max_depth=8,
        random_state=42
    )

    model.fit(X, y)

    joblib.dump(model, "subscription_ai_model.pkl")
    joblib.dump(encoders, "label_encoders.pkl")

    print("✅ Model trained successfully")
    print("💾 Saved model + encoders")


if __name__ == "__main__":
    train_model()