// src/controllers/authController.js
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const path = require("path");
const generateToken = require("../utils/generateToken");
const successResponse = require("../utils/successResponse");

// Register User
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirmPassword, mobileNumber, address } =
    req.body;

  if (
    !name ||
    !email ||
    !password ||
    !confirmPassword ||
    !mobileNumber ||
    !address
  ) {
    return next(new ErrorResponse("Please provide all required fields", 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorResponse("Passwords do not match", 400));
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorResponse("User already exists", 400));
    }

    const user = await User.create({
      name,
      email,
      password,
      mobileNumber,
      address,
    });

    res.status(201).json(
      successResponse("User registered successfully", 201, {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        address: user.address,
        token: generateToken(user._id),
      })
    );
  } catch (error) {
    next(error);
  }
});

// Login User
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (user && (await user.matchPassword(password))) {
      res.status(200).json(
        successResponse("User logged in successfully", 200, {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        })
      );
    } else {
      return next(new ErrorResponse("Invalid email or password", 401));
    }
  } catch (error) {
    next(error);
  }
};



exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Get the user from the request (assumes user is authenticated and req.user is set)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user profile with the file URL
    user.profilePicture = `uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
