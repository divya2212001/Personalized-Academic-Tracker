import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export default function StudentAnalytics({ history }) {
  const analyticsData = history
    .slice()
    .reverse()
    .map((item, index) => ({
      name: `#${index + 1}`,
      score: item.score,
    }));

  const avgScore =
    history.length > 0
      ? (
          history.reduce((sum, item) => sum + item.score, 0) /
          history.length
        ).toFixed(2)
      : 0;

  const maxScore =
    history.length > 0
      ? Math.max(...history.map((i) => i.score))
      : 0;

  const minScore =
    history.length > 0
      ? Math.min(...history.map((i) => i.score))
      : 0;

  return (
    <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6">
        Student Progress Analytics
      </h2>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card title="Average" value={avgScore} color="blue" />
        <Card title="Highest" value={maxScore} color="green" />
        <Card title="Lowest" value={minScore} color="red" />
        <Card title="Total" value={history.length} color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-3">Prediction Trend</h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Score Distribution</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
    purple: "text-purple-600 bg-purple-50",
  };

  return (
    <div className={`p-5 rounded-2xl ${colors[color]}`}>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}