const cancellationPolicyService = require('../../services/policyAndConditionsServices/cancellationPolicy.service');
const Utils = require('../../utility/utils');

const cancellationPolicyController = {
    /**
     * Add a new cancellation condition.
     * @param {Object} req - The Express request object containing the cancellation condition data in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    addCancellationCondition: async function (req, res) {
        const cancellationPolicyData = req.body;
        const result = await cancellationPolicyService.addCancellationCondition(cancellationPolicyData);
        Utils.sendResponse(result, req, res);  
    },

    /**
     * Get all cancellation conditions.
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object used to send the response.
     */
    getCancellationCondition: async function (req, res) {
        const result = await cancellationPolicyService.getCancellationCondition();
        Utils.sendResponse(result, req, res);
    },
};

module.exports = cancellationPolicyController;
