// File: routes/admin/auth.routes.js

// Import necessary modules
const express = require("express");
const router = express.Router();
const userAuthController = require("../../controllers/web/userAuth.controller");
const { userTokenVerification, userTempTokenVerification } = require("../../middleware/tokenVerification");

// Route to handle registration of users through API
router.post("/registerApi", userAuthController.registerUserApi);

// Route to handle login of users through API
router.post("/loginApi", userAuthController.loginApi);

// Route for OTP verification
router.post("/verifyOtpApi", userAuthController.verifyOtpApi);

// Route to get user details via API, requires token verification
router.get("/getUserDetailApi", userTokenVerification, userAuthController.getUserDetailApi);

// Route for user forgot password
router.post("/forgetPasswordApi", userAuthController.forgetPasswordApi);

// Route for resetting password after verifying OTP, requires temporary token verification
router.post("/resetPasswordApi", userTempTokenVerification, userAuthController.resetPasswordApi);

// Export the router
module.exports = router;
