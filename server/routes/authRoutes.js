const express = require("express");
const {
  signup,
  login,
  verifyEmail,
  getUserProfile,
  updateUserProfile,
  verifyToken,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/JWTauthentication");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.get("/verify", protect, verifyToken);
router.get("/me", protect, getMe);
router
  .route("/profile/:id")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
