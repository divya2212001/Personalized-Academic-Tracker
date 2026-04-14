export default function PersonalizedGuidance({ score, form }) {
  const tips = [];

  if (!score) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4">
          Personalized Guidance
        </h2>
        <p className="text-gray-400">Make a prediction to get AI guidance.</p>
      </div>
    );
  }

  if (score < 60)
    tips.push("Immediate academic improvement plan recommended.");

  if (+form.attendance_percentage < 80)
    tips.push("Improve attendance above 80%.");

  if (+form.sleep_hours < 7)
    tips.push("Sleep 7–8 hours for better memory.");

  if (+form.study_hours_per_day < 3)
    tips.push("Increase study hours to 3+ daily.");

  if (+form.social_media_hours > 3)
    tips.push("Reduce social media distractions.");

  if (+form.netflix_hours > 2)
    tips.push("Limit Netflix during study periods.");

  if (+form.exercise_frequency < 2)
    tips.push("Exercise regularly for focus.");

  if (score >= 85)
    tips.push("Excellent predicted performance. Maintain consistency.");

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold mb-4">
        Personalized Guidance
      </h2>

      <ul className="space-y-3 text-gray-600">
        {tips.map((tip, i) => (
          <li key={i}>• {tip}</li>
        ))}
      </ul>
    </div>
  );
}