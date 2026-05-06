# Personalized Academic Tracker

A full-stack academic tracking application that combines:

- A student-focused frontend for managing grades, events, and academic profile
- A Node.js/Express backend that provides a JWT-protected API backed by MongoDB
- A Python/Flask ML service that predicts an exam score and returns personalized study recommendations

---

## High-level pipeline

1. The user authenticates with the Node backend (JWT).
2. The frontend uses the JWT to call protected backend endpoints (grades, events, academic profile).
3. The user opens the AI Prediction page and submits habit/lifestyle inputs.
4. The frontend calls the ML service (`/predict`) without using the JWT.
5. The ML service computes features, scales them, predicts `predicted_score`, and returns `recommendations`.
6. The frontend displays the predicted score and saves the prediction history locally in the browser.

---

## Repository layout

- `client/` (React + Vite)
  - UI, pages, and components
  - API clients for backend and ML service

- `server/` (Node.js + Express + MongoDB)
  - REST API for auth, grades, events, academic profile

- `ml/` (Python Flask)
  - Model inference and recommendation generation

- Root files
  - `README.md` (this document)
  - `Contribution.md`

---

## Frontend (`client`)

### What it does

- Provides the UI for login/signup and the main academic dashboard.
- Manages grades and event scheduling via the backend API.
- Provides the AI Prediction page that calls the ML service.

### Key integration files

- `client/src/utils/api.js`
  - `API_URL` (backend): configured via `VITE_API_URL` with a code fallback.
  - `mlApi` (ML service): configured via `VITE_ML_API_URL` with a code fallback.
  - Backend calls attach `Authorization: Bearer <token>` from `localStorage`/`sessionStorage`.
  - ML calls do not require auth.

- `client/src/pages/Prediction.jsx`
  - Builds the request payload from the prediction form
  - Calls `mlApi.post('/predict', payload)`
  - Stores prediction history in `localStorage` under `prediction_history`

---

## Backend (`server`)

### What it does

- Hosts a REST API under `/api/*`.
- Uses MongoDB (Mongoose models) for persistence.
- Secures routes using JWT.

### Server wiring

- `server/server.js`
  - Loads environment variables (`dotenv`)
  - Connects to MongoDB (`server/config/database.js`)
  - Configures CORS for local and known production origins
  - Mounts routes:
    - `/api/health`
    - `/api/auth`
    - `/api/events`
    - `/api/grades`
    - `/api/academic`

### MongoDB connection

- `server/config/database.js`
  - Connects to `process.env.MONGODB_URI`

### Authentication and authorization

- `server/middleware/JWTauthentication.js`
  - `protect` middleware validates the `Authorization: Bearer ...` JWT
  - Loads the user and attaches it to `req.user`
  - Rejects requests for inactive users
  - `authorize(...roles)` enforces role-based access for certain routes (e.g., admin)

### Routes and controllers

#### Auth routes

- `server/routes/authRoutes.js`
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `POST /api/auth/verify-email`
  - `GET /api/auth/verify` (protected)
  - `GET /api/auth/me` (protected)
  - `GET/PUT /api/auth/profile/:id` (protected)

- `server/controllers/authController.js`
  - JWT generation uses `process.env.JWT_SECRET`
  - Login returns `{ token, user, expiresIn }`

#### Events

- `server/routes/eventRoutes.js`
  - Protected routes via `router.use(protect)`
  - `GET /api/events`
  - `POST /api/events`
  - `PUT /api/events/:id`
  - `DELETE /api/events/:id`
  - `GET /api/events/search?q=...`

- `server/controllers/eventController.js`
  - Ensures event ownership for update/delete

- `server/models/Event.js`
  - Event schema includes `title`, `description`, `start`, `end`, `category`, `user`
  - Validates `end > start`

#### Grades

- `server/routes/gradeRoutes.js`
  - Protected routes via `protect`
  - `POST /api/grades`
  - `GET /api/grades`
  - `PUT /api/grades/:id`
  - `DELETE /api/grades/:id`

#### Academic profile

- `server/routes/academicRoutes.js`
  - Protected CRUD routes:
    - `GET /api/academic`
    - `POST /api/academic`
    - `PUT /api/academic`
    - `DELETE /api/academic`
    - `POST /api/academic/upsert`
  - Admin-only:
    - `GET /api/academic/stats`

- `server/controllers/academicController.js`
  - Creates/updates academic records for the authenticated user
  - Enforces uniqueness rules (e.g., URN/Roll Number)

- `server/models/Academic.js`
  - `gradingSystem` enum: `cgpa`, `gpa`, `percentage`
  - Uniqueness constraints:
    - `userId` is unique
    - `urnNumber` is unique
  - Includes a virtual `gradingSystemDisplay`

### Error handling

- `server/middleware/errorHandler.js`
  - Provides centralized 404/notFound and error responses

---

## ML service (`ml`)

### What it does

- Provides prediction and recommendation logic.
- Loads a trained model and a scaler:
  - `student_model.pkl`
  - `scaler.pkl`

### Key files

- `ml/app.py`
  - Flask app with CORS enabled
  - `POST /predict`

### ML prediction endpoint flow

- The endpoint expects JSON inputs from the frontend (see `client/src/pages/Prediction.jsx`).
- It computes:
  - `productivity_score` (feature engineering)
  - `sleep_category` (bucketed from `sleep_hours`)
- It then:
  - Scales features using `scaler.transform(...)`
  - Predicts exam score with `model.predict(...)`
  - Generates `recommendations` based on thresholds (e.g., low score / low attendance / low sleep)

### Training logic (offline)

- `ml/main.py`
  - Reads `student_habits_performance.csv`
  - Trains and compares models
  - Runs `GridSearchCV`
  - Saves:
    - `student_model.pkl`
    - `scaler.pkl`

---

## Environment variables

### Frontend (`client`)

- `VITE_API_URL`
  - Base URL of the backend Node API
- `VITE_ML_API_URL`
  - Base URL of the ML Flask service

### Backend (`server`)

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRE` (optional; defaults to `7d` in code)

### ML (`ml`)

- No explicit env vars used in `ml/app.py`
- Requires `student_model.pkl` and `scaler.pkl` in the `ml/` directory

---

## Local run (outline)

1. Start MongoDB and set `MONGODB_URI` for `server`.
2. Start the backend:
   - `cd server`
   - `npm install`
   - `npm run dev` (or `node server.js`)
3. Start the ML service:
   - `cd ml`
   - create a Python virtual environment
   - `pip install -r requirements.txt`
   - `python app.py`
4. Start the frontend:
   - `cd client`
   - `npm install`
   - `npm run dev`

---

## Contributing

Read `Contribution.md` and open issues to see where help is needed.
