const PackageService = require('../../services/packageServices/package.service');
const Utils = require('../../utility/utils');

const packageController = {
    /**
     * Create a new mock test.
     * @param {Object} req - The Express request object containing the mock test data in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    addPackage: async function (req, res) {
        const packageData = req.body;
        const result = await PackageService.addPackage(packageData,req);
        Utils.sendResponse(result, req, res);  
    },

    /**
     * List all mock tests with optional pagination and search.
     * @param {Object} req - The Express request object containing query parameters for pagination and search.
     * @param {Object} res - The Express response object used to send the response.
     */
    listAllPackages: async function (req, res) {
        const { limit, offset, searchQuery } = req.query;
        const limitValue = parseInt(limit) || 10; // Default limit is set to 10
        const offsetValue = parseInt(offset) || 0; // Default offset is set to 0
        const result = await PackageService.listAllPackages(limitValue, offsetValue, searchQuery || "");
        Utils.sendResponse(result, req, res);
    },

    /**
     * Change the status of a mock test by its ID.
     * @param {Object} req - The Express request object containing the mock test ID and new status in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    changeStatus: async function (req, res) {
        const { id, is_active } = req.body;
        const result = await PackageService.changeStatus(id, is_active);
        Utils.sendResponse(result, req, res);
    },

    /**
     * Delete a mock test by its ID.
     * @param {Object} req - The Express request object containing the mock test ID in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    deletePackage: async function (req, res) {
        const { id } = req.body;
        const result = await PackageService.deletePackage(id);
        Utils.sendResponse(result, req, res);
    },

    /**
     * Retrieve topic details by topic ID.
     * @param {Express.Request} req - The Express request object
     * @param {Express.Response} res - The Express response object
     */
    getPackageDetailById: async function (req, res) {
        // Extract topic ID from the request body
        const { packaeg_id } = req.query;
        // Call the service method to retrieve topic details by ID
        const result = await PackageService.getPackageDetailById(packaeg_id);
        // Send the response
        Utils.sendResponse(result, req, res);
    },
};

module.exports = packageController;
