const privacyPolicyService = require('../../services/policyAndConditionsServices/privacyPolicy.service');
const Utils = require('../../utility/utils');

const privacyPolicyController = {
    /**
     * Add a new privacy policy.
     * @param {Object} req - The Express request object containing the privacy policy data in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    addPrivacyPolicy: async function (req, res) {
        const privacyPolicyData = req.body;
        const result = await privacyPolicyService.addPrivacyPolicy(privacyPolicyData);
        Utils.sendResponse(result, req, res);  
    },

    /**
     * Get all privacy policies.
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object used to send the response.
     */
    getPrivacyPolicy: async function (req, res) {
        const result = await privacyPolicyService.getPrivacyPolicy();
        Utils.sendResponse(result, req, res);
    },
};

module.exports = privacyPolicyController;
