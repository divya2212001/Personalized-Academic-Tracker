const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const gradeRoutes = require("./routes/gradeRoutes");
const academicRoutes = require("./routes/academicRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();

connectDB();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:5173", // Vite client
      "http://localhost:3000", // Alternative client port
      "http://127.0.0.1:5173",
      "https://personalized-academic-tracker-*.vercel.app", 
    ];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      // or if origin is in allowedOrigins
      if (!origin || allowedOrigins.some(allowed => 
        origin === allowed || 
        origin.replace('http://', 'https://') === allowed.replace('http://', 'https://') ||
        allowed.includes(origin.replace('http://', '').replace('https://', ''))
      )) {
        callback(null, true);
      } else {
        // For development, allow all origins but log it
        console.log(`CORS: Origin ${origin} not in allowed list, but allowing for development`);
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
    exposedHeaders: ["set-cookie"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

app.use("/api/health", healthRoutes);

app.get("/", (req, res) => {
  res.send(
    "🎉 Welcome to the Academic Tracker API. Visit /api/health to check server status."
  );
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/academic", academicRoutes);

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📝 Signup endpoint: http://localhost:${PORT}/api/auth/signup`);
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login`);
  console.log(`🎓 Academic endpoint: http://localhost:${PORT}/api/academic`);
});

process.on("unhandledRejection", (err, promise) => {
  console.error("Unhandled Rejection:", err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});

module.exports = app;
