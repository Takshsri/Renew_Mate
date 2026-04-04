from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)

# ✅ CORS FIX
CORS(
    app,
    origins=[
        "http://localhost:5173",
        "https://renew-mate.vercel.app"
    ],
    supports_credentials=True
)

model = joblib.load("subscription_ai_model.pkl")
encoders = joblib.load("label_encoders.pkl")


def encode_value(column, value):
    le = encoders[column]
    known_values = list(le.classes_)

    value = str(value)

    if value not in known_values:
        value = known_values[0]

    return le.transform([value])[0]


@app.route("/", methods=["GET"])
def home():
    return {
        "message": "✅ Renew Mate ML API is running",
        "endpoint": "/predict"
    }


# ✅ IMPORTANT: POST + OPTIONS
@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    # ✅ Handle preflight request
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight success"}), 200

    data = request.json

    monthly_spending = data.get("monthly_spending", 0)
    payment_method = data.get("paymentMethod", "manual")
    active_usage_days = data.get("active_usage_days", 0)
    days_to_renewal = data.get("days_to_renewal", 0)

    auto_renew_risk = 1 if str(payment_method).lower() == "credit_card" else 0
    over_budget_flag = 1 if monthly_spending > 2000 else 0

    features = pd.DataFrame([{
        "monthly_spending": monthly_spending,
        "serviceName": encode_value(
            "serviceName",
            data.get("serviceName", "unknown")
        ),
        "category": encode_value(
            "category",
            data.get("category", "unknown")
        ),
        "billingCycle": encode_value(
            "billingCycle",
            data.get("billingCycle", "MONTHLY")
        ),
        "paymentMethod": encode_value(
            "paymentMethod",
            payment_method
        ),
        "status": encode_value(
            "status",
            data.get("status", "ACTIVE")
        ),
        "active_usage_days": active_usage_days,
        "auto_renew_risk": auto_renew_risk,
        "days_to_renewal": days_to_renewal,
        "over_budget_flag": over_budget_flag
    }])

    prediction = model.predict(features)[0]

    suggestion = encoders["recommended_plan"].inverse_transform(
        [prediction]
    )[0]

    message = "✅ Subscription usage looks healthy."

    if over_budget_flag:
        message = (
            "⚠️ Your monthly subscription expenses are over budget. "
            "Consider switching to a cheaper plan."
        )

    if auto_renew_risk and days_to_renewal <= 3:
        message = (
            "💳 Credit card auto-renewal is near. "
            "We recommend reviewing or downgrading this subscription."
        )

    return jsonify({
        "suggestion": suggestion,
        "message": message,
        "auto_renew_risk": auto_renew_risk,
        "over_budget": bool(over_budget_flag)
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)