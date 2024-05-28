const termsConditionService = require('../../services/policyAndConditionsServices/termsCondition.service');
const Utils = require('../../utility/utils');

const termsConditionController = {
    /**
     * Add a new terms and conditions entry.
     * @param {Object} req - The Express request object containing the terms and conditions data in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    addTermsCondition: async function (req, res) {
        const termsConditionData = req.body;
        const result = await termsConditionService.addTermsCondition(termsConditionData);
        Utils.sendResponse(result, req, res);  
    },

    /**
     * Get all terms and conditions entries.
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object used to send the response.
     */
    getTermsCondition: async function (req, res) {
        const result = await termsConditionService.getTermsCondition();
        Utils.sendResponse(result, req, res);
    },
};

module.exports = termsConditionController;
