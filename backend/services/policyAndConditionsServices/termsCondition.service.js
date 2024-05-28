const TermsConditionModel = require("../../models/policyAndConditions/TermsConditions.model");
const Utils = require("../../utility/utils"); // Import Utils module if not already imported
const MessageConstants = require("../../utility/MessageConstants"); // Import MessageConstants module if not already imported
const HTTPStatus = require("http-status"); // Import HTTPStatus module if not already imported

const termsConditionService = {
    /**
     * Create a new terms condition or update an existing one.
     * @param {Object} termsConditionData - The data of the terms condition to be created or updated.
     * @returns {Object} An object containing a success message and the created/updated terms condition data, or an error response.
     */
    addTermsCondition: async (termsConditionData) => {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams(
                { name: "title", value: termsConditionData.title },
                { name: "details", value: termsConditionData.details }
            );

            if (emptyParams.length > 0) {
                // Return error response if any required parameter is missing
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            const terms_condition_id = termsConditionData.terms_condition_id;

            if (terms_condition_id) {
                // Check if any existing terms condition matches the conditions
                const existingTermsCondition = await TermsConditionModel.findById(terms_condition_id);

                if (!existingTermsCondition) {
                    return Utils.errorResponse(MessageConstants.INVALID_ID);
                }
                // Update existing terms condition if terms_condition_id is provided
                const updatedTermsCondition = await TermsConditionModel.findByIdAndUpdate(
                    terms_condition_id,
                    termsConditionData,
                    { new: true }
                );
                const { _id: _id, ...user } = updatedTermsCondition.toObject();
                return {
                    message: MessageConstants.UPDATE,
                    termsConditionData: { terms_condition_id, ...user },
                };
            } else {
                // Create new terms condition if no terms_condition_id is provided
                const newTermsCondition = await TermsConditionModel.create(termsConditionData);
                const { _id: terms_condition_id, ...user } = newTermsCondition.toObject();
                return {
                    message: MessageConstants.SUCCESS,
                    termsConditionData: { terms_condition_id, ...user },
                };
            }
        } catch (error) {
            // Return error response if an exception occurs during the operation
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    /**
     * Fetches terms conditions from the database.
     * @returns {Object} An object containing the terms conditions data, or an error response.
     */
    getTermsCondition: async function () {
        try {
            // Define the base query to filter non-deleted terms conditions
            const baseQuery = { is_deleted: false };
            // Fetch terms conditions from the database
            const data = await TermsConditionModel.find(baseQuery);
            return { data: data };
        } catch (error) {
            // Return error response if an exception occurs during the operation
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },
};

module.exports = termsConditionService;
