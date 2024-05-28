const HTTPStatus = require("http-status");
const UserModel = require("../../models/webModel/User.model");
const Utils = require("../../utility/utils");
const PasswordUtils = require("../../utility/passwordUtils");
const MessageConstants = require("../../utility/MessageConstants");
const ValidationHelper = require("../../utility/ValidationHelper");
const { OtpVerificationType } = require("../../utility/Enums");
const fs = require("fs");
const speakeasy = require('speakeasy');

const userAuthService = {
    /**
     * Register a new user.
     * @param {Object} userData - The data of the user to be registered.
     * @returns {Object} An object containing a success message and the registered user data, or an error response.
     */
    registerUser: async function (userData) {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams(
                { name: "firstName", value: userData.firstName },
                { name: "lastName", value: userData.lastName },
                { name: "dateOfBirth", value: userData.dateOfBirth },
                { name: "gender", value: userData.gender },
                { name: "schoolName", value: userData.schoolName },
                { name: "class", value: userData.class },
                { name: "medium", value: userData.medium },
                { name: "state", value: userData.state },
                { name: "password", value: userData.password },
                { name: "district", value: userData.district },
                { name: "pinCode", value: userData.pinCode },
                { name: "email", value: userData.email },
                { name: "mobile", value: userData.mobile },
                { name: "addressLine1", value: userData.addressLine1 }
            );
            if (emptyParams.length > 0) {
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            // Extract email and mobile number from userData
            const emailId = userData.email;
            const mobileNumber = userData.mobile;

            // Check if email address is valid
            if (!ValidationHelper.isValidEmail(emailId)) {
                return Utils.errorResponse(MessageConstants.INVALID_EMAIL);
            }

            // Check if mobile number is valid
            if (!ValidationHelper.isValidMobileNumber(mobileNumber)) {
                return Utils.errorResponse(MessageConstants.INVALID_MOBILE_NUMBER);
            }

            // Check if user with the same email already exists
            const existingEmailUser = await UserModel.findOne({ email: emailId });
            if (existingEmailUser) {
                return Utils.errorResponse(MessageConstants.EMAIL_ALREADY_EXISTS);
            }

            // Check if user with the same mobile number already exists
            const existingMobileUser = await UserModel.findOne({
                mobile: mobileNumber,
            });

            if (existingMobileUser) {
                return Utils.errorResponse(
                    MessageConstants.MOBILE_NUMBER_ALREADY_EXISTS
                );
            }

            // Encrypt the user's password before saving
            userData.password = await PasswordUtils.encryptPassword(userData.password);

            // Create a new user
            const insertedUserData = await UserModel.create(userData);

            // Extract necessary data from the inserted user data
            const { password, otp, __v, _id: user_id, ...user } = insertedUserData.toObject();

            return { message: MessageConstants.OTP_SENT_SUCCESSFULLY, userData: { user_id, ...user } };
            // return {
            //     message: MessageConstants.OTP_SENT_SUCCESSFULLY,
            //     // otp: user.otp,
            // };
        } catch (error) {
            return Utils.errorResponse(MessageConstants.INTERNAL_SERVER_ERROR, HTTPStatus.INTERNAL_SERVER_ERROR);
        }
    },

    /**
   * Admin login using email and password.
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise<Object>} Result of the login operation
   */
    loginApi: async function (email, password) {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams(
                { name: "email", value: email },
                { name: "password", value: password }
            );
            if (emptyParams.length > 0) {
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            // Find admin by email
            const user = await UserModel.findOne({ email });

            // Check if user exists
            if (!user) {
                return Utils.errorResponse(MessageConstants.USER_NOT_FOUND);
            }

            // Check if user is active and not deleted
            if (!user.is_active || user.is_deleted) {
                return Utils.errorResponse(
                    MessageConstants.USER_NOT_ACTIVE_OR_DELETED
                );
            }

            // Validate password
            const isValidPassword = await PasswordUtils.validatePassword(
                password,
                user.password
            );
            if (!isValidPassword) {
                return Utils.errorResponse(MessageConstants.INVALID_PASSWORD);
            }

            // // Generate OTP
            // user.otp = generateOTP();
            // await user.save();

            // Return success response with OTP
            return {
                message: MessageConstants.OTP_SENT_SUCCESSFULLY,
                // otp: user.otp,
            };
        } catch (error) {
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    /**
   * Verify OTP for admin authentication.
   * @param {string} email - Admin email
   * @param {string} otp - OTP code
   * @returns {Promise<Object>} Result of the OTP verification
   */
    verifyOTP: async function (email, otp, type) {
        try {
            if (type != "registration") {
                // Validate input parameters
                const emptyParams = Utils.checkEmptyParams(
                    { name: "email", value: email },
                    { name: "otp", value: otp }
                );
                if (emptyParams.length > 0) {
                    return Utils.errorResponse(
                        `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                    );
                }
    
                // Find admin by email
                const user = await UserModel.findOne({ email });
    
                // Check if user exists
                if (!user) {
                    return Utils.errorResponse(MessageConstants.USER_NOT_FOUND);
                }
    
                // Check if user is active and not deleted
                if (!user.is_active || user.is_deleted) {
                    return Utils.errorResponse(
                        MessageConstants.USER_NOT_ACTIVE_OR_DELETED
                    );
                }
    
                // Verify OTP
                const verified = speakeasy.totp.verify({
                    secret: process.env.GOOGLE_AUTH_SECRET_KEY,
                    encoding: 'base32',
                    token: otp,
                    window: 1 // Allow for a time window to account for clock skew
                });
    
                // Check if OTP matches
                if (!verified) {
                    return Utils.errorResponse(MessageConstants.INVALID_OTP);
                }
    
                // user.otp = null;
                // await user.save();
    
                var token;
                if (type == OtpVerificationType.forgotPassword) {
                    token = Utils.generateJWTToken({
                        temp_id: user._id,
                        email: user.email,
                    });
                } else {
                    token = Utils.generateJWTToken({
                        user_id: user._id,
                        email: user.email,
                    });
                }
    
                return {
                    message: MessageConstants.OTP_VERIFICATION_SUCCESSFUL,
                    token: token,
                    userData: user,
                };
            } else {
                const emptyParams = Utils.checkEmptyParams(
                    { name: "otp", value: otp }
                );
                if (emptyParams.length > 0) {
                    return Utils.errorResponse(
                        `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                    );
                }
                 // Verify OTP
                const verified = speakeasy.totp.verify({
                    secret: process.env.GOOGLE_AUTH_SECRET_KEY,
                    encoding: 'base32',
                    token: otp,
                    window: 1 // Allow for a time window to account for clock skew
                });
    
                // Check if OTP matches
                if (!verified) {
                    return Utils.errorResponse(MessageConstants.INVALID_OTP);
                }
                return {
                    message: MessageConstants.OTP_VERIFICATION_SUCCESSFUL,
                };
            }
        } catch (error) {
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    /**
   * Get the data of current user
   */
    getUserDetails: async function (authenticatedUser) {
        try {
            let { password, otp, __v, _id: user_id, ...user } = authenticatedUser.toObject();
            return { message: MessageConstants.DETAILS_FETCHED_SUCCESSFULLY, user: { user_id, ...user } };
        } catch (error) {
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    /**
    * Sends an OTP (One-Time Password) via email for the forgot password functionality.
    * You need to implement sending email logic here using your preferred email service provider (e.g., Nodemailer, SendGrid).
    * Example code using Nodemailer:
    *
    * @param {string} email - The email address of the admin for which the OTP is sent.
    * @returns {Object} An object containing a message indicating the result of the operation.
    *                   If successful, it contains a success message.
    *                   If admin is not found, it contains a message indicating admin not found.
    * @throws {Error} If an error occurs while sending the OTP email.
    */

    forgetPassword: async function (email) {
        // You need to implement sending email logic here using your preferred email service provider (e.g., Nodemailer, SendGrid)
        // Example code using Nodemailer:
        const emptyParams = Utils.checkEmptyParams(
            { name: "email", value: email }
        );

        if (emptyParams.length > 0) {
            return Utils.errorResponse(
                `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
            );
        }

        try {
            const user = await UserModel.findOne({ email, is_deleted: false });

            if (!user) {
                return Utils.errorResponse(MessageConstants.USER_NOT_FOUND);
            }
            // user.otp = generateOTP();
            // await user.save();

            // const transporter = Utils.createTransporter(); // Implement createTransporter method in utils.js to configure Nodemailer transporter
            // await transporter.sendMail({
            //   from: "rahulpro3355@gmail.com",
            //   to: email,
            //   subject: "Forgot Password OTP",
            //   text: `Your OTP for resetting the password is: ${user.otp}`,
            // });
            return {
                message: MessageConstants.OTP_SENT_SUCCESSFULLY,
                // otp: user.otp,
            };
        } catch (error) {
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    /**
    * Reset user's password.
    * @param {string} newPassword - The new password for the user.
    * @param {Object} user - The user object whose password is to be reset.
    * @returns {Object} An object containing a message indicating the result of the operation.
    */
    resetPassword: async function (newPassword, user) {
        try {
            const emptyParams = Utils.checkEmptyParams(
                { name: "newPassword", value: newPassword }
            );

            if (emptyParams.length > 0) {
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }
            // Update password
            user.password = await PasswordUtils.encryptPassword(newPassword);
            await user.save();
            return {
                message: MessageConstants.PASSWORD_RESET_SUCCESSFUL,
            };
        } catch (error) {
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },
};

/**
 * Generate a six-digit OTP.
 * @returns {string} Six-digit OTP
 */
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = userAuthService;
