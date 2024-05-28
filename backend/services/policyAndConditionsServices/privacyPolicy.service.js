const PrivacyPolicyModel = require("../../models/policyAndConditions/PrivacyPolicy.model");
const Utils = require("../../utility/utils"); // Import Utils module if not already imported
const MessageConstants = require("../../utility/MessageConstants"); // Import MessageConstants module if not already imported
const HTTPStatus = require("http-status"); // Import HTTPStatus module if not already imported

const privacyPolicyService = {
    /**
     * Create a new privacy policy or update an existing one.
     * @param {Object} privacyPolicyData - The data of the privacy policy to be created or updated.
     * @returns {Object} An object containing a success message and the created/updated privacy policy data, or an error response.
     */
    addPrivacyPolicy: async (privacyPolicyData) => {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams(
                { name: "title", value: privacyPolicyData.title },
                { name: "details", value: privacyPolicyData.details }
            );

            if (emptyParams.length > 0) {
                // Return error response if any required parameter is missing
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            const privacy_policy_id = privacyPolicyData.privacy_policy_id;

            if (privacy_policy_id) {
                // Check if any existing privacy policy matches the conditions
                const existingPrivacyPolicy = await PrivacyPolicyModel.findById(privacy_policy_id);

                if (!existingPrivacyPolicy) {
                    return Utils.errorResponse(MessageConstants.INVALID_ID);
                }
                // Update existing privacy policy if privacy_policy_id is provided
                const updatedPrivacyPolicy = await PrivacyPolicyModel.findByIdAndUpdate(
                    privacy_policy_id,
                    privacyPolicyData,
                    { new: true }
                );
                const { _id: _id, ...user } = updatedPrivacyPolicy.toObject();
                return {
                    message: MessageConstants.UPDATE,
                    privacyPolicyData: { privacy_policy_id, ...user },
                };
            } else {
                // Create new privacy policy if no privacy_policy_id is provided
                const newPrivacyPolicy = await PrivacyPolicyModel.create(privacyPolicyData);
                const { _id: privacy_policy_id, ...user } = newPrivacyPolicy.toObject();
                return {
                    message: MessageConstants.SUCCESS,
                    privacyPolicyData: { privacy_policy_id, ...user },
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
     * Fetches privacy policies from the database.
     * @returns {Object} An object containing the privacy policies data, or an error response.
     */
    getPrivacyPolicy: async function () {
        try {
            // Define the base query to filter non-deleted privacy policies
            const baseQuery = { is_deleted: false };
            // Fetch privacy policies from the database
            const data = await PrivacyPolicyModel.find(baseQuery);
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

module.exports = privacyPolicyService;
