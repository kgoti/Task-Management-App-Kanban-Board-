// ============================================================
// middleware/auth.js — JWT Authentication Middleware
//
// Middleware is a function that runs BETWEEN receiving a request
// and sending a response. It has access to req, res, and next().
//
// This middleware:
//   1. Reads the JWT token from the Authorization header
//   2. Verifies it is valid and not expired
//   3. Attaches the user's ID to req.userId
//   4. Calls next() to allow the route to continue
//   5. If the token is missing or invalid, sends a 401 error
//
// Usage: add "protect" as a second argument to any route
//   router.get("/tasks", protect, getAllTasks)
// ============================================================

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // The token is sent in the "Authorization" header as:
  // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  const authHeader = req.headers.authorization;

  // Check that the header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }

  // Extract just the token part (remove "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    // jwt.verify() decodes the token and checks it against our secret
    // If valid, it returns the payload we stored when we created the token
    // Our payload was: { userId: user._id }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the userId to the request object so route handlers can use it
    req.userId = decoded.userId;

    next(); // token is valid — continue to the route handler

  } catch (err) {
    // This runs if the token is expired, tampered with, or invalid
    return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }
};

module.exports = protect;
