const PackageService = require('../../services/webService/package.service');
const Utils = require('../../utility/utils');

const packageController = {
    /**
     * List all mock tests with optional pagination and search.
     * @param {Object} req - The Express request object containing query parameters for pagination and search.
     * @param {Object} res - The Express response object used to send the response.
     */
    getAllPackageApi: async function (req, res) {
        const { limit, offset, searchQuery } = req.query;
        const limitValue = parseInt(limit) || 10; // Default limit is set to 10
        const offsetValue = parseInt(offset) || 0; // Default offset is set to 0
        const result = await PackageService.getAllPackageApi(limitValue, offsetValue, searchQuery || "");
        Utils.sendResponse(result, req, res);
    },
   
};

module.exports = packageController;
