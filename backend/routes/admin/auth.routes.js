// File: routes/admin/auth.routes.js

const express = require("express");
const router = express.Router();
const adminAuthController = require("../../controllers/admin/adminAuth.controller");
const {
  adminTokenVerification,
  tempTokenVerification,
} = require("../../middleware/tokenVerification");
const multer = require("multer");
var path = require('path')

// Route for admin login using email and password
router.post("/login", adminAuthController.login);

// Route for OTP verification
router.post("/verify-otp", adminAuthController.verifyOTP);

// Register Admin
router.post("/register", adminAuthController.register);

// Get Admin Details
router.get("/", adminTokenVerification, adminAuthController.getDetails);

router.put("/change-password", adminTokenVerification, adminAuthController.changePassword);

// Multer configuration for handling multiple files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/admin/profile_pics'); // Files will be uploaded to the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + path.extname(file.originalname)); // Use the original file name as the stored file name
  }
});

const upload = multer({ storage: storage }).single('profile_pic');
router.put("/updateProfileDetails", adminTokenVerification, upload, adminAuthController.updateProfileDetails);

// Route for admin forgot password
router.post("/forget-password", adminAuthController.forgetPassword);

// Route for resetting password after verifying OTP
router.post("/reset-password", tempTokenVerification, adminAuthController.resetPassword);

module.exports = router;
