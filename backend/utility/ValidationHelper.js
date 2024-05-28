// File: utility/ValidationHelper.js

class ValidationHelper {
    /**
     * Validate email address format.
     * @param {string} email - Email address to validate
     * @returns {boolean} True if the email address is valid, otherwise false
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate Indian mobile number format.
     * @param {string} mobileNumber - Mobile number to validate
     * @returns {boolean} True if the mobile number is valid, otherwise false
     */
    static isValidMobileNumber(mobileNumber) {
        const mobileRegex = /^[6-9]\d{9}$/;
        return mobileRegex.test(mobileNumber);
    }
}

module.exports = ValidationHelper;
