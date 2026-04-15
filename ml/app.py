# app.py (Advanced Recommendation Engine)

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "https://personalized-academic-tracker-wzzj.vercel.app"])


model = joblib.load("student_model.pkl")
scaler = joblib.load("scaler.pkl")


def generate_recommendations(data, score):
    tips = []

    if score < 60:
        tips.append("Your predicted score is low. Immediate improvement plan recommended.")

    if data["study_hours_per_day"] < 3:
        tips.append("Increase study hours to at least 3–4 hours per day.")

    if data["attendance_percentage"] < 80:
        tips.append("Improve attendance above 80% to boost academic performance.")

    if data["sleep_hours"] < 7:
        tips.append("Sleep 7–8 hours daily for better concentration and memory.")

    if data["mental_health_rating"] < 6:
        tips.append("Focus on stress management and mental wellness.")

    if data["social_media_hours"] > 3:
        tips.append("Reduce social media usage to under 3 hours daily.")

    if data["netflix_hours"] > 2:
        tips.append("Reduce entertainment screen time during exam periods.")

    if data["exercise_frequency"] < 3:
        tips.append("Exercise regularly to improve focus and energy.")

    if score >= 85:
        tips.append("Excellent performance predicted. Maintain consistency.")

    elif score >= 70:
        tips.append("Good performance predicted. Small habit improvements can raise score further.")

    elif score >= 60:
        tips.append("Average performance predicted. Improve weak areas now.")

    return tips


@app.route("/")
def home():
    return "AI Academic Recommendation API Running"


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    productivity_score = (
        data["study_hours_per_day"] * 2
        + data["attendance_percentage"] / 10
        + data["mental_health_rating"]
        + data["exercise_frequency"]
        - data["social_media_hours"]
        - data["netflix_hours"]
    )

    sleep_category = 2 if data["sleep_hours"] >= 7 else 1 if data["sleep_hours"] >= 5 else 0

    values = [[
        data["study_hours_per_day"],
        data["attendance_percentage"],
        data["sleep_hours"],
        data["mental_health_rating"],
        data["social_media_hours"],
        data["netflix_hours"],
        data["exercise_frequency"],
        productivity_score,
        sleep_category
    ]]

    scaled = scaler.transform(values)
    predicted_score = model.predict(scaled)[0]
    predicted_score = round(predicted_score, 2)

    recommendations = generate_recommendations(data, predicted_score)

    # Risk Level
    if predicted_score >= 85:
        risk = "Excellent"
    elif predicted_score >= 70:
        risk = "Good"
    elif predicted_score >= 60:
        risk = "Average"
    else:
        risk = "High Risk"

    return jsonify({
        "predicted_score": predicted_score,
        "risk_level": risk,
        "recommendations": recommendations
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)