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

/* =======================
   DATABASE
======================= */
connectDB();


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://personalized-academic-tracker-3.onrender.com",
  "https://personalized-academic-tracker.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman / curl / mobile apps / server-to-server
      if (!origin) return callback(null, true);

      // allow all localhost variations (any port)
      if (origin.match(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) {
        return callback(null, true);
      }

      // check exact match in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // allow Vercel preview & prod
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // allow any render.app domain
      if (origin.endsWith(".onrender.com")) {
        return callback(null, true);
      }

      // For development: allow all origins but log it
      console.log(`CORS: Allowing origin ${origin} for development`);
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  })
);

/* =======================
   BODY PARSERS
======================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* =======================
   DEV LOGGER
======================= */
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

/* =======================
   ROUTES
======================= */
app.get("/", (req, res) => {
  res.send("🎉 Academic Tracker API is running");
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/academic", academicRoutes);

/* =======================
   ERRORS
======================= */
app.use(notFound);
app.use(errorHandler);

/* =======================
   SERVER
======================= */
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

/* =======================
   PROCESS SAFETY
======================= */
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});

module.exports = app;
