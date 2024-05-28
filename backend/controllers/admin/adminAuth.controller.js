const adminAuthService = require("../../services/admin/adminAuth.service");
const { OtpVerificationType } = require("../../utility/Enums");
const Utils = require("../../utility/utils");

const adminAuthController = {
  /**
   * Perform admin login using email and password.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  login: async function (req, res) {
    const { email, password } = req.body;
    const result = await adminAuthService.login(email, password);
    Utils.sendResponse(result, req, res);
  },

  /**
   * Verify OTP for admin authentication.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  verifyOTP: async function (req, res) {
    const { email, otp, type } = req.body;
    var otpVerificationType = type
    if (!otpVerificationType) {
      otpVerificationType = OtpVerificationType.login
    }
    const result = await adminAuthService.verifyOTP(email, otp, otpVerificationType);
    Utils.sendResponse(result, req, res);
  },

  /**
   * Register Admin
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  register: async function (req, res) {
    const { name, email, password, mobileNumber } = req.body;
    const result = await adminAuthService.register(
      name,
      email,
      password,
      mobileNumber
    );
    Utils.sendResponse(result, req, res);
  },

  /**
   * Get Admin Details
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  getDetails: async function (req, res) {
    const result = await adminAuthService.getDetails(req.authenticatedUser);
    Utils.sendResponse(result, req, res);
  },

  /**
   * forgot Password
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  forgetPassword: async function (req, res) {
    const { email } = req.body;
    const result = await adminAuthService.forgetPassword(email);
    Utils.sendResponse(result, req, res);
  },

  resetPassword: async function (req, res) {
    const { newPassword } = req.body;
    const result = await adminAuthService.resetPassword(newPassword, req.authenticatedUser);
    Utils.sendResponse(result, req, res);
  },

  changePassword: async function (req, res) {
    const { currentPassword, newPassword } = req.body;
    const result = await adminAuthService.changePassword(currentPassword, newPassword, req.authenticatedUser);
    Utils.sendResponse(result, req, res);
  },

  updateProfileDetails: async function (req, res) {
    const { name, mobileNumber } = req.body;
    const admin = req.authenticatedUser;
    const result = await adminAuthService.updateProfileDetails(admin, name || admin.name, mobileNumber || admin.mobile_number, req);
    Utils.sendResponse(result, req, res);
  },
};

module.exports = adminAuthController;
