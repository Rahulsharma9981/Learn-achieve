const HTTPStatus = require("http-status");
const ContactUsModel = require("../../models/webModel/ContactUs.model");
const Utils = require("../../utility/utils");
const MessageConstants = require("../../utility/MessageConstants");
const ValidationHelper = require("../../utility/ValidationHelper");

const contactUsService = {
    /**
     * Register a new user.
     * @param {Object} contactData - The data of the user to be registered.
     * @returns {Object} An object containing a success message and the registered user data, or an error response.
     */
    addContactApi: async function (contactData) {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams(
                { name: "name", value: contactData.name },
                { name: "email", value: contactData.email },
                { name: "subject", value: contactData.subject },
                { name: "message", value: contactData.message }
            );
            if (emptyParams.length > 0) {
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            // Extract email and mobile number from contactData
            const emailId = contactData.email;

            // Check if email address is valid
            if (!ValidationHelper.isValidEmail(emailId)) {
                return Utils.errorResponse(MessageConstants.INVALID_EMAIL);
            }

            // Check if user with the same email already exists
            const existingEmailUser = await ContactUsModel.findOne({ email: emailId });
            if (existingEmailUser) {
                return Utils.errorResponse(MessageConstants.EMAIL_ALREADY_EXISTS);
            }

            // Create a new user
            const insertedcontactData = await ContactUsModel.create(contactData);

            // Extract necessary data from the inserted user data
            const { __v, _id: contactUs_id, ...user } = insertedcontactData.toObject();

            return { message: MessageConstants.SUCCESS, contactData: { contactUs_id, ...user } };
        } catch (error) {
            return Utils.errorResponse(MessageConstants.INTERNAL_SERVER_ERROR, HTTPStatus.INTERNAL_SERVER_ERROR);
        }
    },
};

module.exports = contactUsService;
