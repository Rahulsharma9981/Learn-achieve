const PackageModel = require("../../models/package/package.model");
const Utils = require("../../utility/utils"); // Import Utils module if not already imported
const MessageConstants = require("../../utility/MessageConstants"); // Import MessageConstants module if not already imported
const HTTPStatus = require("http-status"); // Import HTTPStatus module if not already imported

const packageService = {
    /**
     * Fetches mock tests from the database with optional pagination and search criteria.
     * @param {number} limitValue - The limit for the number of mock tests to fetch.
     * @param {number} offsetValue - The number of mock tests to skip.
     * @param {string} searchTerm - The search term to filter mock tests by name.
     * @returns {Object} An object containing the fetched mock tests and the total count, or an error response.
     */
    getAllPackageApi: async function (limitValue, offsetValue, searchTerm) {
        try {
            // Define the base query to filter non-deleted mock tests
            const baseQuery = { is_deleted: false };

            // Modify the base query to include the search term if provided
            if (searchTerm) {
                // Use a regex pattern to perform case-insensitive search on packageName field
                baseQuery.packageName = { $regex: searchTerm, $options: "i" };
            }

            // Fetch mock tests from the database with pagination and filtered by search criteria
            const data = await PackageModel.find(baseQuery)
                .skip(offsetValue * limitValue)
                .limit(limitValue);
            return { package:data };
        } catch (error) {
            // Return error response
            return Utils.errorResponse(MessageConstants.INTERNAL_SERVER_ERROR, HTTPStatus.INTERNAL_SERVER_ERROR);
        }
    },


};

module.exports = packageService;
