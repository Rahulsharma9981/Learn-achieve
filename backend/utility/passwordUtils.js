// File: utility/passwordUtils.js

const bcrypt = require("bcrypt");

const passwordUtils = {
  /**
   * Encrypts the given password.
   * @param {string} password - The password to encrypt.
   * @returns {Promise<string>} A promise that resolves to the encrypted password.
   */
  encryptPassword: async function (password) {
    const saltRounds = 10;
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error("Error encrypting password");
    }
  },

  /**
   * Validates the given password against the given hashed password.
   * @param {string} password - The password to validate.
   * @param {string} hashedPassword - The hashed password to compare against.
   * @returns {Promise<boolean>} A promise that resolves to true if the passwords match, otherwise false.
   */
  validatePassword: async function (password, hashedPassword) {
    try {
      const isValid = await bcrypt.compare(password, hashedPassword);
      return isValid;
    } catch (error) {
      console.error("Error validating password:", error);
      throw new Error("Error validating password");
    }
  },
};

module.exports = passwordUtils;
