const UserService = require('../../services/userServices/user.service');
const Utils = require('../../utility/utils');

const userController = {

    /**
     * List all mock tests with optional pagination and search.
     * @param {Object} req - The Express request object containing query parameters for pagination and search.
     * @param {Object} res - The Express response object used to send the response.
     */
    listAllUsers: async function (req, res) {
        const { limit, offset, searchQuery } = req.query;
        const limitValue = parseInt(limit) || 10; // Default limit is set to 10
        const offsetValue = parseInt(offset) || 0; // Default offset is set to 0
        const result = await UserService.listAllUsers(limitValue, offsetValue, searchQuery || "");
        Utils.sendResponse(result, req, res);
    },

    /**
     * Delete a mock test by its ID.
     * @param {Object} req - The Express request object containing the mock test ID in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    deleteUser: async function (req, res) {
        const { id } = req.body;
        const result = await UserService.deleteUser(id);
        Utils.sendResponse(result, req, res);
    },

    /**
     * Retrieve topic details by topic ID.
     * @param {Express.Request} req - The Express request object
     * @param {Express.Response} res - The Express response object
     */
    getUserDetailById: async function (req, res) {
        // Extract topic ID from the request body
        const { user_id } = req.query;
        // Call the service method to retrieve topic details by ID
        const result = await UserService.getUserDetailById(user_id);
        // Send the response
        Utils.sendResponse(result, req, res);
    },
};

module.exports = userController;
