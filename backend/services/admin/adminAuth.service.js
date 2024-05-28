const HTTPStatus = require("http-status");
const Admin = require("../../models/admin/Admin.model");
const Utils = require("../../utility/utils");
const PasswordUtils = require("../../utility/passwordUtils");
const MessageConstants = require("../../utility/MessageConstants");
const ValidationHelper = require("../../utility/ValidationHelper");
const { OtpVerificationType } = require("../../utility/Enums");
const fs = require("fs");
const speakeasy = require('speakeasy');

const adminAuthService = {
  resetPassword: async function (newPassword, admin) {
    try {
      // Update password
      admin.password = await PasswordUtils.encryptPassword(newPassword);
      await admin.save();
      return {
        message: MessageConstants.PASSWORD_RESET_SUCCESSFUL,
      };
    } catch (error) {
      console.error("Error resetting password:", error);
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

    try {
      const admin = await Admin.findOne({ email, is_deleted: false });

      if (!admin) {
        return Utils.errorResponse(MessageConstants.ADMIN_NOT_FOUND);
      }
      // admin.otp = generateOTP();
      // await admin.save();

      // const transporter = Utils.createTransporter(); // Implement createTransporter method in utils.js to configure Nodemailer transporter
      // await transporter.sendMail({
      //   from: "rahulpro3355@gmail.com",
      //   to: email,
      //   subject: "Forgot Password OTP",
      //   text: `Your OTP for resetting the password is: ${admin.otp}`,
      // });
      return {
        message: MessageConstants.OTP_SENT_SUCCESSFULLY,
        // otp: admin.otp,
      };
    } catch (error) {
      console.log(error);
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * Admin login using email and password.
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @returns {Promise<Object>} Result of the login operation
   */
  login: async function (email, password) {
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
      const admin = await Admin.findOne({ email });

      // Check if admin exists
      if (!admin) {
        return Utils.errorResponse(MessageConstants.ADMIN_NOT_FOUND);
      }

      // Check if admin is active and not deleted
      if (!admin.is_active || admin.is_deleted) {
        return Utils.errorResponse(
          MessageConstants.ADMIN_NOT_ACTIVE_OR_DELETED
        );
      }

      // Validate password
      const isValidPassword = await PasswordUtils.validatePassword(
        password,
        admin.password
      );
      if (!isValidPassword) {
        return Utils.errorResponse(MessageConstants.INVALID_PASSWORD);
      }

      // // Generate OTP
      // admin.otp = generateOTP();
      // await admin.save();

      // Return success response with OTP
      return {
        message: MessageConstants.OTP_SENT_SUCCESSFULLY,
        // otp: admin.otp,
      };
    } catch (error) {
      console.error(error);
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
      const admin = await Admin.findOne({ email });

      // Check if admin exists
      if (!admin) {
        return Utils.errorResponse(MessageConstants.ADMIN_NOT_FOUND);
      }

      // Check if admin is active and not deleted
      if (!admin.is_active || admin.is_deleted) {
        return Utils.errorResponse(
          MessageConstants.ADMIN_NOT_ACTIVE_OR_DELETED
        );
      }

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

      // admin.otp = null;
      // await admin.save();

      var token;
      if (type == OtpVerificationType.forgotPassword) {
        token = Utils.generateJWTToken({
          temp_id: admin._id,
          email: admin.email,
        });
      } else {
        token = Utils.generateJWTToken({
          admin_id: admin._id,
          email: admin.email,
        });
      }

      return {
        message: MessageConstants.OTP_VERIFICATION_SUCCESSFUL,
        token: token,
        adminData: admin,
      };
    } catch (error) {
      console.error(error);
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * Register Admin.
   * @param {string} name - Admin name
   * @param {string} email - Admin email
   * @param {string} password - Admin password
   * @param {string} mobileNumber - Admin mobile number
   * @returns {Promise<Object>} Result of the Admin Registration.
   */
  register: async function (name, email, _password, mobileNumber) {
    try {
      // Validate input parameters
      const emptyParams = Utils.checkEmptyParams(
        { name: "name", value: name },
        { name: "email", value: email },
        { name: "password", value: _password },
        { name: "mobileNumber", value: mobileNumber }
      );
      if (emptyParams.length > 0) {
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
        );
      }

      // Check if email address is valid
      if (!ValidationHelper.isValidEmail(email)) {
        return Utils.errorResponse(MessageConstants.INVALID_EMAIL);
      }

      // Check if mobile number is valid
      if (!ValidationHelper.isValidMobileNumber(mobileNumber)) {
        return Utils.errorResponse(MessageConstants.INVALID_MOBILE_NUMBER);
      }

      // Check if admin with the same email already exists
      const existingEmailAdmin = await Admin.findOne({ email });
      if (existingEmailAdmin) {
        return Utils.errorResponse(MessageConstants.EMAIL_ALREADY_EXISTS);
      }

      // Check if admin with the same mobile number already exists
      const existingMobileAdmin = await Admin.findOne({
        mobile_number: mobileNumber,
      });
      if (existingMobileAdmin) {
        return Utils.errorResponse(
          MessageConstants.MOBILE_NUMBER_ALREADY_EXISTS
        );
      }

      // Create a new admin
      const admin = await Admin.create({
        name,
        email,
        mobile_number: mobileNumber,
        password: await PasswordUtils.encryptPassword(_password),
      });
      const { password, otp, __v, _id: admin_id, ...user } = admin.toObject();
      return {
        message: MessageConstants.ADMIN_CREATED,
        adminData: { admin_id, ...user },
      };
    } catch (error) {
      console.log(error);
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * Get the data of current user
   */
  getDetails: async function (authenticatedUser) {
    try {
      let { password, otp, __v, _id: admin_id, ...user } = authenticatedUser.toObject();
      return {
        message: MessageConstants.DETAILS_FETCHED_SUCCESSFULLY,
        user: { admin_id, ...user },
      };
    } catch (error) {
      console.error(error);
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  changePassword: async function (currentPassword, newPassword, admin) {
    try {
      // Validate input parameters
      const emptyParams = Utils.checkEmptyParams(
        { name: "currentPassword", value: currentPassword },
        { name: "newPassword", value: newPassword }
      );

      if (emptyParams.length > 0) {
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
        );
      }

      // Validate if the current password matches the admin's password
      const isValidPassword = await PasswordUtils.validatePassword(currentPassword, admin.password);

      if (!isValidPassword) {
        return Utils.errorResponse(MessageConstants.INVALID_CURRENT_PASSWORD, HTTPStatus.BAD_REQUEST);
      }

      // Validate if the new password is different from the current password
      if (currentPassword === newPassword) {
        return Utils.errorResponse(MessageConstants.NEW_PASSWORD_SAME_AS_CURRENT, HTTPStatus.BAD_REQUEST);
      }

      // Update the password
      admin.password = await PasswordUtils.encryptPassword(newPassword);
      await admin.save();

      return {
        message: MessageConstants.PASSWORD_RESET_SUCCESSFUL,
      };
    } catch (error) {
      return Utils.errorResponse(MessageConstants.INTERNAL_SERVER_ERROR, HTTPStatus.INTERNAL_SERVER_ERROR);
    }
  },

  updateProfileDetails: async function (admin, name, mobileNumber, req) {
    try {
      // Validate input parameters
      const emptyParams = Utils.checkEmptyParams(
        { name: "name", value: name },
        { name: "mobileNumber", value: mobileNumber }
      );

      if (emptyParams.length > 0) {
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`,
          HTTPStatus.BAD_REQUEST
        );
      }

      // Check if mobile number is valid
      if (!ValidationHelper.isValidMobileNumber(mobileNumber)) {
        return Utils.errorResponse(MessageConstants.INVALID_MOBILE_NUMBER, HTTPStatus.BAD_REQUEST);
      }

      var dataToUpdate = {
        name: name,
        mobile_number: mobileNumber,
      }

      if (req.file) {
        if (admin.profile_pic && admin.profile_pic != "") {
          fs.unlink(admin.profile_pic, (err) => { if (err) console.log(err) });
        }
        dataToUpdate.profile_pic = req.file.path
      }

      const userData = await Admin.findByIdAndUpdate(admin._id, dataToUpdate, { new: true });

      let { password, otp, __v, _id: admin_id, ...user } = userData.toObject();
      return {
        message: MessageConstants.PROFILE_DETAILS_UPDATED,
        user: { admin_id, ...user },
      };
    } catch (error) {
      return Utils.errorResponse(MessageConstants.INTERNAL_SERVER_ERROR, HTTPStatus.INTERNAL_SERVER_ERROR);
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

module.exports = adminAuthService;
