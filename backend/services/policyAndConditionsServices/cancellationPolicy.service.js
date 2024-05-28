const CancellationPolicyModel = require("../../models/policyAndConditions/CancellationPolicy.model");
const Utils = require("../../utility/utils"); // Import Utils module if not already imported
const MessageConstants = require("../../utility/MessageConstants"); // Import MessageConstants module if not already imported
const HTTPStatus = require("http-status"); // Import HTTPStatus module if not already imported

const cancellationPolicyService = {
    /**
     * Create a new cancellation policy or update an existing one.
     * @param {Object} cancellationPolicyData - The data of the cancellation policy to be created or updated.
     * @returns {Object} An object containing a success message and the created/updated cancellation policy data, or an error response.
     */
    addCancellationCondition: async (cancellationPolicyData) => {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams(
                { name: "title", value: cancellationPolicyData.title },
                { name: "details", value: cancellationPolicyData.details }
            );

            if (emptyParams.length > 0) {
                // Return error response if any required parameter is missing
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            const cancellation_policy_id = cancellationPolicyData.cancellation_policy_id;

            if (cancellation_policy_id) {
                // Check if any existing cancellation policy matches the conditions
                const existingCancellationPolicy = await CancellationPolicyModel.findById(cancellation_policy_id);

                if (!existingCancellationPolicy) {
                    return Utils.errorResponse(MessageConstants.INVALID_ID);
                }
                // Update existing cancellation policy if cancellation_policy_id is provided
                const updatedCancellationPolicy = await CancellationPolicyModel.findByIdAndUpdate(
                    cancellation_policy_id,
                    cancellationPolicyData,
                    { new: true }
                );
                const { _id: _id, ...user } = updatedCancellationPolicy.toObject();
                return {
                    message: MessageConstants.UPDATE,
                    cancellationPolicyData: { cancellation_policy_id, ...user },
                };
            } else {
                // Create new cancellation policy if no cancellation_policy_id is provided
                const newCancellationPolicy = await CancellationPolicyModel.create(cancellationPolicyData);
                const { _id: cancellation_policy_id, ...user } = newCancellationPolicy.toObject();
                return {
                    message: MessageConstants.SUCCESS,
                    cancellationPolicyData: { cancellation_policy_id, ...user },
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
     * Fetches cancellation policies from the database.
     * @returns {Object} An object containing the cancellation policies data, or an error response.
     */
    getCancellationCondition: async function () {
        try {
            // Define the base query to filter non-deleted cancellation policies
            const baseQuery = { is_deleted: false };
            // Fetch cancellation policies from the database
            const data = await CancellationPolicyModel.find(baseQuery);
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

module.exports = cancellationPolicyService;
