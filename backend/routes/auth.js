// ============================================================
// routes/auth.js — Authentication Routes
//
// POST /api/auth/register  → create a new user account
// POST /api/auth/login     → log in and receive a JWT token
//
// These routes are PUBLIC — no token required
// ============================================================

const express = require("express");
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");

const router = express.Router();

// ── Helper: create a signed JWT token ──────────────────────
// We call this after a successful register or login
// The token expires in 7 days — after that the user must log in again
const createToken = (userId) => {
  return jwt.sign(
    { userId },                    // payload — data stored inside the token
    process.env.JWT_SECRET,        // secret key used to sign it
    { expiresIn: "7d" }            // expiry time
  );
};

// ── POST /api/auth/register ─────────────────────────────────
router.post("/register", async (req, res) => {
  // Destructure the fields sent in the request body
  const { name, email, password } = req.body;

  // Basic validation — make sure all fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide name, email and password." });
  }

  try {
    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    // Create a new User document
    // The password gets hashed automatically by the pre-save hook in models/User.js
    const user = await User.create({ name, email, password });

    // Create a JWT token for the new user
    const token = createToken(user._id);

    // Send back the token and basic user info (NOT the password)
    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
      },
    });

  } catch (err) {
    // Mongoose validation errors (e.g. email format invalid)
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ── POST /api/auth/login ────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password." });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found OR password does not match, send the same generic error
    // This is intentional — we do NOT reveal whether the email exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Use the comparePassword method we defined in models/User.js
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Credentials are correct — generate a token
    const token = createToken(user._id);

    res.json({
      message: "Logged in successfully!",
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
