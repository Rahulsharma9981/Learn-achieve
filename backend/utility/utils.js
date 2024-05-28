const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodeMailer = require("nodemailer");
// File: utility/utils.js
require("dotenv").config();

class Utils {
  static createTransporter() {
    return nodeMailer.createTransport({
      host: "smpt.gmail.com",
      port: 465,
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: "rahulpro3355@gmail.com",
        pass: "ieqgyxkdtkkfntkk",
      },
    });
  }

  /**
   * Send response based on the result.
   * @param {Object} result - Result object containing data or error
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {void}
   */
  static sendResponse(result, req, res) {
    const { status, ...data } = result;
    if (data?.error !== undefined && data.error !== null && data.error.length > 0) {
      res.status(400).send(data);
    } else if (
      status !== undefined &&
      status !== null &&
      Number.isInteger(status)
    ) {
      res.status(status).send(data);
    } else {
      res.status(200).send(data);
    }
  }

  /**
   * Check for empty or null parameters.
   * @param {...{ name: string, value: any }} params - List of parameter objects { name, value }
   * @returns {string[]} Names of parameters that are empty or null
   */
  static checkEmptyParams(...params) {
    const emptyParams = [];
    params.forEach((param) => {
      if (!param.value) {
        emptyParams.push(param.name);
      }
    });
    return emptyParams;
  }

  /**
   * Generate JWT Token for Authorization
   * @param {Object} payload - Json object to bind with the token
   * @param {String} expiration - expiration time of the token
   */
  static generateJWTToken(
    payload,
    expiration = process.env.DEFAULT_JWT_EXPIRATION
  ) {
    return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: expiration });
  }

  /**
   * Decode JWT Token
   * @param {string} token - JWT token to decode
   * @returns {Object} Decoded payload or null if token is invalid
   */
  static jwtDecode(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate a JSON object for error response with given message and optional status.
   * @param {string} message - Error message
   * @param {number} [status=400] - HTTP status code (defaulted to 400)
   * @returns {Object} JSON object for error response
   */
  static errorResponse(message, status = 400) {
    return { error: message, status: status };
  }
}

module.exports = Utils;
