# app.py (Advanced Recommendation Engine)

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)

CORS(app, origins="*")

model = joblib.load("student_model.pkl")
scaler = joblib.load("scaler.pkl")


@app.route("/")
def home():
    return jsonify({"message": "AI Academic Recommendation API Running"})


def generate_recommendations(data, score):
    tips = []

    if score < 60:
        tips.append("Immediate improvement plan recommended.")

    if data["study_hours_per_day"] < 3:
        tips.append("Increase study hours.")

    if data["attendance_percentage"] < 80:
        tips.append("Improve attendance.")

    if data["sleep_hours"] < 7:
        tips.append("Sleep 7-8 hours daily.")

    return tips


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

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
        predicted_score = round(float(model.predict(scaled)[0]), 2)

        return jsonify({
            "predicted_score": predicted_score,
            "recommendations": generate_recommendations(data, predicted_score)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)