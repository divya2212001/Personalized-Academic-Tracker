const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, dob, countryCode, phone, password } =
      req.body;

    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (user) {
      return res
        .status(409)
        .json({
          success: false,
          message: "User already exists.",
        });
    } else {
      const existingPhone = await User.phoneExists(phone, countryCode);
      if (existingPhone) {
        return res
          .status(409)
          .json({ success: false, message: "Phone number already exists" });
      }
      user = new User({
        firstName,
        lastName,
        email,
        dob,
        countryCode,
        phone,
        password,
        isVerified: true, // Auto-verify user for easy signup
      });
    }

    await user.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Registration successful!",
      });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Duplicate field value entered" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Removed email verification check - users can login without verifying
    // if (!user.isVerified) {
    //   return res
    //     .status(403)
    //     .json({ success: false, message: "Account not verified" });
    // }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ success: false, message: "Account deactivated" });
    }

    const token = generateToken(user._id);
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      user,
      expiresIn: process.env.JWT_EXPIRE || "7d",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyToken = async (req, res) => {
  // Token is already verified by middleware
  res.status(200).json({ success: true, user: req.user });
};

const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

module.exports = {
  signup,
  login,
  verifyEmail,
  getUserProfile,
  updateUserProfile,
  verifyToken,
  getMe,
};

