import { useEffect, useState } from "react";
import axios from "axios";
import { AiFillPieChart, AiFillDelete } from "react-icons/ai";
import PersonalizedGuidance from "../components/PersonalizedGuidance";
import StudentAnalytics from "../components/StudentAnalytics";

export default function Prediction() {
  const initialForm = {
    study_hours_per_day: "",
    attendance_percentage: "",
    sleep_hours: "",
    mental_health_rating: "",
    social_media_hours: "",
    netflix_hours: "",
    exercise_frequency: "",
    productivity_score: "",
    sleep_category: "",
  };

  const [form, setForm] = useState(initialForm);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("prediction_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveHistory = (data) => {
    setHistory(data);
    localStorage.setItem(
      "prediction_history",
      JSON.stringify(data)
    );
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, Number(v)])
      );

      const res = await axios.post(
        "http://127.0.0.1:5000/predict",
        payload
      );

      const result = Number(res.data.predicted_score);
      setScore(result);

      const newHistory = [
        {
          id: Date.now(),
          score: result,
          date: new Date().toLocaleString(),
          inputs: form,
        },
        ...history,
      ];

      saveHistory(newHistory);
    } catch (error) {
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const clearCurrent = () => {
    setForm(initialForm);
    setScore(null);
  };

  const clearHistory = () => {
    localStorage.removeItem("prediction_history");
    setHistory([]);
  };

  const deleteSingle = (id) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
  };

  const fields = [
    {
      label: "Study Hours Per Day",
      name: "study_hours_per_day",
      type: "number",
    },
    {
      label: "Attendance Percentage",
      name: "attendance_percentage",
      type: "number",
    },
    {
      label: "Sleep Hours",
      name: "sleep_hours",
      type: "number",
    },
    {
      label: "Mental Health Rating",
      name: "mental_health_rating",
      type: "select",
      options: [
        { label: "Very Poor", value: 1 },
        { label: "Poor", value: 2 },
        { label: "Fair", value: 3 },
        { label: "Good", value: 4 },
        { label: "Excellent", value: 5 },
      ],
    },
    {
      label: "Social Media Hours",
      name: "social_media_hours",
      type: "number",
    },
    {
      label: "Netflix Hours",
      name: "netflix_hours",
      type: "number",
    },
    {
      label: "Exercise Frequency",
      name: "exercise_frequency",
      type: "select",
      options: [
        { label: "Never", value: 0 },
        { label: "Rarely", value: 1 },
        { label: "Sometimes", value: 2 },
        { label: "Often", value: 3 },
        { label: "Daily", value: 4 },
      ],
    },
    {
      label: "Productivity Score",
      name: "productivity_score",
      type: "number",
    },
    {
      label: "Sleep Category",
      name: "sleep_category",
      type: "select",
      options: [
        { label: "Poor", value: 0 },
        { label: "Average", value: 1 },
        { label: "Good", value: 2 },
      ],
    },
  ];

  const chipClass =
    "px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100";

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center gap-5 mb-8">
        <div className="bg-blue-100 p-4 rounded-2xl">
          <AiFillPieChart className="text-blue-600" size={30} />
        </div>

        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            AI Score Prediction
          </h1>
          <p className="text-gray-500 mt-1">
            Predict your academic performance using AI based on your habits and lifestyle.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Enter Student Details
          </h2>

          <div className="space-y-5">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {field.label}
                </label>

                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3"
                  >
                    <option value="">Select {field.label}</option>

                    {field.options.map((item) => (
                      <option
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold"
          >
            {loading ? "Predicting..." : "Predict Score"}
          </button>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={clearCurrent}
              className="bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold"
            >
              Clear Output
            </button>

            <button
              onClick={clearHistory}
              className="bg-red-500 text-white py-3 rounded-xl font-semibold"
            >
              Clear Saved
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Result */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">
              Prediction Result
            </h2>

            {score !== null ? (
              <>
                <h1 className="text-6xl font-bold text-blue-600">
                  {score}
                </h1>
                <p className="text-gray-500 mt-2">
                  Predicted Exam Score
                </p>
              </>
            ) : (
              <p className="text-gray-400">No prediction yet.</p>
            )}
          </div>

          {/* Saved Results */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">
              Saved Results
            </h2>

            {history.length === 0 ? (
              <p className="text-gray-400">
                No saved predictions.
              </p>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-auto">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-2xl p-4"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <p className="text-xl font-bold text-blue-600">
                          Score: {item.score}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.date}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          deleteSingle(item.id)
                        }
                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                      >
                        <AiFillDelete size={18} />
                      </button>
                    </div>

                    {/* Chips */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        <span className={chipClass}>
                            Study: {item.inputs?.study_hours_per_day ?? "-"}h
                        </span>

                        <span className={chipClass}>
                            Attendance: {item.inputs?.attendance_percentage ?? "-"}%
                        </span>

                        <span className={chipClass}>
                            Sleep: {item.inputs?.sleep_hours ?? "-"}h
                        </span>

                        <span className={chipClass}>
                            Mental: {item.inputs?.mental_health_rating ?? "-"}
                        </span>

                        <span className={chipClass}>
                            Social: {item.inputs?.social_media_hours ?? "-"}h
                        </span>

                        <span className={chipClass}>
                            Netflix: {item.inputs?.netflix_hours ?? "-"}h
                        </span>

                        <span className={chipClass}>
                            Exercise: {item.inputs?.exercise_frequency ?? "-"}
                        </span>

                        <span className={chipClass}>
                            Productivity: {item.inputs?.productivity_score ?? "-"}
                        </span>

                        <span className={chipClass}>
                            Sleep Type: {item.inputs?.sleep_category ?? "-"}
                        </span>
                        </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suggestions */}
          <PersonalizedGuidance score={score} form={form} />
        </div>
        <StudentAnalytics history={history} />
      </div>
    </div>
  );
}