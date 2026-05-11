// ============================================================
// models/User.js — Mongoose schema for a User
//
// A Mongoose "schema" defines the shape of documents in MongoDB.
// Think of it like a class or a table definition in SQL.
//
// This User has: name, email, password (hashed), timestamps
// ============================================================

const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,          // removes extra whitespace
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,        // no two users with the same email
      lowercase: true,     // always stored in lowercase
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
  },
  {
    // Mongoose automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// ── Pre-save hook ───────────────────────────────────────────
// This runs automatically BEFORE a user document is saved to MongoDB.
// It hashes the password so we never store plain text passwords.
// "salt rounds" = 10 means bcrypt runs 2^10 = 1024 hashing iterations
userSchema.pre("save", async function (next) {
  // Only hash if the password field was changed (or is new)
  // This prevents re-hashing an already-hashed password on update
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method ─────────────────────────────────────────
// We add a custom method to compare a plain password with the stored hash
// Used in the login route: user.comparePassword(enteredPassword)
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Export the model so routes can import and use it
module.exports = mongoose.model("User", userSchema);
