import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function StudentAnalytics({
  history = [],
}) {
  // Trend Data
  const trendData = history
    .slice()
    .reverse()
    .map((item, index) => ({
      attempt: `#${index + 1}`,
      score: Number(item.score),
    }));

  // Stats

  const avg =
    history.length > 0
      ? (
          history.reduce(
            (sum, item) =>
              sum + Number(item.score),
            0
          ) / history.length
        ).toFixed(2)
      : 0;

  const best =
    history.length > 0
      ? Math.max(...history.map((i) => Number(i.score)))
      : 0;

  const lowest =
    history.length > 0
      ? Math.min(...history.map((i) => Number(i.score)))
      : 0;

  const latest =
    history.length > 0
      ? Number(history[0].score)
      : 0;

  const growth =
    history.length > 1
      ? (
          Number(history[0].score) -
          Number(
            history[history.length - 1].score
          )
        ).toFixed(2)
      : 0;

  // Score Distribution
  const distributionData = [
    {
      category: "Poor",
      count: history.filter(
        (i) => i.score <= 50
      ).length,
    },
    {
      category: "Average",
      count: history.filter(
        (i) =>
          i.score > 50 &&
          i.score <= 70
      ).length,
    },
    {
      category: "Good",
      count: history.filter(
        (i) =>
          i.score > 70 &&
          i.score <= 85
      ).length,
    },
    {
      category: "Excellent",
      count: history.filter(
        (i) => i.score > 85
      ).length,
    },
  ];

  // ------------------------------------------
  // Pie Data
  // ------------------------------------------
  const pieData = [
    {
      name: "Achieved",
      value: latest,
    },
    {
      name: "Remaining",
      value: Math.max(0, 100 - latest),
    },
  ];

  const COLORS = ["#2563eb", "#e5e7eb"];

  return (
    <div className="mt-8 w-full bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800">
          Student Progress Analytics
        </h2>

        <p className="text-gray-500 mt-2 text-lg">
          AI-powered academic insights
          and measurable progress trends
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-5 gap-5 mb-10">
        <StatCard
          title="Average"
          value={avg}
          color="blue"
        />
        <StatCard
          title="Best"
          value={best}
          color="green"
        />
        <StatCard
          title="Lowest"
          value={lowest}
          color="red"
        />
        <StatCard
          title="Latest"
          value={latest}
          color="purple"
        />
        <StatCard
          title="Growth"
          value={`${
            growth > 0 ? "+" : ""
          }${growth}`}
          color="orange"
        />
      </div>

      {/* FULL HORIZONTAL TOP */}
      <div className="grid xl:grid-cols-4 gap-8 mb-10">
        {/* Trend */}
        <div className="xl:col-span-3 bg-gray-50 rounded-3xl p-6">
          <h3 className="text-2xl font-semibold mb-5">
            Prediction Trend Analysis
          </h3>

          <ResponsiveContainer
            width="100%"
            height={380}
          >
            <AreaChart data={trendData}>
              <defs>
                <linearGradient
                  id="scoreColor"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#2563eb"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#2563eb"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="attempt" />
              <YAxis domain={[0, 100]} />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                fillOpacity={1}
                fill="url(#scoreColor)"
                strokeWidth={4}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Score Pie */}
        <div className="bg-gray-50 rounded-3xl p-6">
          <h3 className="text-2xl font-semibold mb-5">
            Current Score
          </h3>

          <ResponsiveContainer
            width="100%"
            height={380}
          >
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={75}
                outerRadius={120}
                dataKey="value"
                paddingAngle={2}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <p className="text-center text-3xl font-bold text-blue-600">
            {latest} / 100
          </p>
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="grid xl:grid-cols-2 gap-8 mb-10">
        {/* Distribution */}
        <div className="bg-gray-50 rounded-3xl p-6">
          <h3 className="text-2xl font-semibold mb-5">
            Score Distribution Analysis
          </h3>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="count"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison */}
        <div className="bg-gray-50 rounded-3xl p-6">
          <h3 className="text-2xl font-semibold mb-5">
            Performance Comparison
          </h3>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <LineChart
              data={[
                {
                  name: "Lowest",
                  score: lowest,
                },
                {
                  name: "Average",
                  score: Number(avg),
                },
                {
                  name: "Latest",
                  score: latest,
                },
                {
                  name: "Best",
                  score: best,
                },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#8b5cf6"
                strokeWidth={4}
                dot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-blue-50 rounded-3xl p-8">
        <h3 className="text-2xl font-semibold mb-6">
          AI Research Insights
        </h3>

        <div className="grid md:grid-cols-2 gap-6 text-gray-700 text-lg">
          <p>
            • Latest score is{" "}
            <b>{latest}</b>, average is{" "}
            <b>{avg}</b>.
          </p>

          <p>
            • Growth trend is{" "}
            <b>
              {growth > 0
                ? "Improving"
                : growth < 0
                ? "Declining"
                : "Stable"}
            </b>
          </p>

          <p>
            • Best score achieved:
            <b> {best}</b>
          </p>

          <p>
            • Most predictions fall in
            current score range.
          </p>

          <p>
            • Consistency improves
            academic performance.
          </p>

          <p>
            • Continue positive habits for
            higher future scores.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    purple:
      "bg-purple-50 text-purple-600",
    orange:
      "bg-orange-50 text-orange-600",
  };

  return (
    <div
      className={`rounded-2xl p-5 ${styles[color]}`}
    >
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h3 className="text-3xl font-bold mt-2">
        {value}
      </h3>
    </div>
  );
}