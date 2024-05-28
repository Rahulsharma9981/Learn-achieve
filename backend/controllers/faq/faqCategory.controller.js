const FaqCategoryService = require('../../services/faq/faqCategory.service'); // Import FaqCategoryService module
const Utils = require('../../utility/utils'); // Import Utils module for sending responses

const FaqCategoryController = {
    /**
     * Create a new faq category.
     * @param {Object} req - The Express request object containing the faq category data in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    addFaqCategory: async function (req, res) {
        // Extract faq category data from request body
        const faqCategoryData = req.body;
        // Call the service method to add a new faq category
        const result = await FaqCategoryService.addFaqCategory(faqCategoryData);
        // Send the response using the utility function
        Utils.sendResponse(result, req, res);  
    },

    /**
     * List all faq categories with optional pagination and search.
     * @param {Object} req - The Express request object containing query parameters for pagination and search.
     * @param {Object} res - The Express response object used to send the response.
     */
    listAllFaqCategory: async function (req, res) {
        // Extract query parameters for pagination and search
        const { limit, offset, searchQuery } = req.query;
        // Parse limit and offset values, set defaults if not provided
        const limitValue = parseInt(limit) || 10; // Default limit is set to 10
        const offsetValue = parseInt(offset) || 0; // Default offset is set to 0
        // Call the service method to list all faq categories
        const result = await FaqCategoryService.listAllFaqCategory(limitValue, offsetValue, searchQuery || "");
        // Send the response using the utility function
        Utils.sendResponse(result, req, res);
    },

    /**
     * Retrieve all blog categories without pagination.
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object used to send the response.
     */
    getAllFaqCategoryWithoutPagination: async function (req, res) {
        const result = await FaqCategoryService.getAllFaqCategoryWithoutPagination();
        Utils.sendResponse(result, req, res);
    },

    /**
     * Change the status of a faq category by its ID.
     * @param {Object} req - The Express request object containing the faq category ID and new status in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    changeStatus: async function (req, res) {
        // Extract faq category ID and new status from request body
        const { id, is_active } = req.body;
        // Call the service method to change the status of the faq category
        const result = await FaqCategoryService.changeStatus(id, is_active);
        // Send the response using the utility function
        Utils.sendResponse(result, req, res);
    },

    /**
     * Delete a faq category by its ID.
     * @param {Object} req - The Express request object containing the faq category ID in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    deleteFaqCategory: async function (req, res) {
        // Extract faq category ID from request body
        const { id } = req.body;
        // Call the service method to delete the faq category
        const result = await FaqCategoryService.deleteFaqCategory(id);
        // Send the response using the utility function
        Utils.sendResponse(result, req, res);
    },

    /**
     * Retrieve faq category details by faq category ID.
     * @param {Express.Request} req - The Express request object.
     * @param {Express.Response} res - The Express response object.
     */
    getFaqCategoryDetailById: async function (req, res) {
        // Extract faq category ID from request query
        const { faq_category_id } = req.query;
        // Call the service method to retrieve faq category details by ID
        const result = await FaqCategoryService.getFaqCategoryDetailById(faq_category_id);
        // Send the response using the utility function
        Utils.sendResponse(result, req, res);
    },
};

module.exports = FaqCategoryController; // Export FaqCategoryController module
