const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  createdAt: { type: Date, default: Date.now },
});

// Encrypt password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, jwtSecret, {
    expiresIn: "30d",
  });
};

module.exports = mongoose.model("User", UserSchema);
