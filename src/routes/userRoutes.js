// src/routes/authRoutes.js
const express = require("express");
const upload = require("../middleware/upload");
const {
  registerUser,
  loginUser,
  uploadProfilePicture,
} = require("../controllers/AuthController");
const {
  registerUserSchema,
  loginUserSchema,
  validate,
} = require("../validations/userValidation");

const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUser);
router.post("/login", validate(loginUserSchema), loginUser);
router.post(
  "/upload-profile-picture",
  upload.single("profilePicture"),
  uploadProfilePicture
);

module.exports = router;
