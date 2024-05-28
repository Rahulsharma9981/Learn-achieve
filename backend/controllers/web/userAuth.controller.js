const userAuthService = require("../../services/webService/userAuth.service");
const { OtpVerificationType } = require("../../utility/Enums");
const Utils = require("../../utility/utils");

const userAuthController = {

    /**
     * Handles the registration of an admin user through API.
     * @param {Express.Request} req - The Express request object containing user data
     * @param {Express.Response} res - The Express response object
     */
    registerUserApi: async function (req, res) {
        // Extract user data from the request body
        const userData = req.body;

        // Call the registerUser method from the userAuthService to register the admin user
        const result = await userAuthService.registerUser(userData);

        // Send the response back to the client using Utils.sendResponse
        Utils.sendResponse(result, req, res);
    },

    /**
     * Handles the login of an admin user through API.
     * @param {Express.Request} req - The Express request object
     * @param {Express.Response} res - The Express response object
     */
    loginApi: async function (req, res) {
        const { email, password } = req.body;
        const result = await userAuthService.loginApi(email, password);
        Utils.sendResponse(result, req, res);
    },

    /**
     * Verifies OTP for admin authentication.
     * @param {Express.Request} req - The Express request object
     * @param {Express.Response} res - The Express response object
     */
    verifyOtpApi: async function (req, res) {
        const { email, otp, type } = req.body;
        var otpVerificationType = type
        if (!otpVerificationType) {
            otpVerificationType = OtpVerificationType.login
        }
        const result = await userAuthService.verifyOTP(email, otp, otpVerificationType);
        Utils.sendResponse(result, req, res);
    },

    /**
     * Retrieves details of an admin user.
     * @param {Express.Request} req - The Express request object
     * @param {Express.Response} res - The Express response object
     */
    getUserDetailApi: async function (req, res) {
        const result = await userAuthService.getUserDetails(req.authenticatedUser);
        Utils.sendResponse(result, req, res);
    },

    /**
     * Handles the process of resetting an admin's password.
     * @param {Express.Request} req - The Express request object
     * @param {Express.Response} res - The Express response object
     */
    forgetPasswordApi: async function (req, res) {
        const { email } = req.body;
        const result = await userAuthService.forgetPassword(email);
        Utils.sendResponse(result, req, res);
    },

    /**
     * Resets the password of an admin user.
     * @param {Express.Request} req - The Express request object
     * @param {Express.Response} res - The Express response object
     */
    resetPasswordApi: async function (req, res) {
        const { newPassword } = req.body;
        const result = await userAuthService.resetPassword(newPassword, req.authenticatedUser);
        Utils.sendResponse(result, req, res);
    },
};

module.exports = userAuthController;
