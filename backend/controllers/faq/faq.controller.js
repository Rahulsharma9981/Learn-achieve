const FaqService = require('../../services/faq/faq.service'); // Import FaqService module
const Utils = require('../../utility/utils'); // Import Utils module for sending responses

const FaqController = {
    /**
     * Create a new FAQ.
     * @param {Object} req - The Express request object containing the FAQ data in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    addFaq: async function (req, res) {
        // Extract FAQ data from request body
        const faqData = req.body;
        // Call the service method to add a new FAQ
        const result = await FaqService.addFaq(faqData);
        // Send the response using the utility function
        Utils.sendResponse(result, req, res);  
    },

    /**
     * List all FAQs with optional pagination and search.
     * @param {Object} req - The Express request object containing query parameters for pagination and search.
     * @param {Object} res - The Express response object used to send the response.
     */
    listAllFaq: async function (req, res) {
        // Extract query parameters for pagination and search
        const { limit, offset, searchQuery } = req.query;
        // Parse limit and offset values, set defaults if not provided
        const limitValue = parseInt(limit) || 10; // Default limit is set to 10
        const offsetValue = parseInt(offset) || 0; // Default offset is set to 0
        // Call the service method to list all FAQs
        const result = await FaqService.listAllFaq(limitValue, offsetValue, searchQuery || "");
        // Send the response using the utility function
        Utils.sendResponse(result, req, res);
    },

    /**
     * Change the status of an FAQ by its ID.
     * @param {Object} req - The Express request object containing the FAQ ID and new status in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    changeStatus: async function (req, res) {
        // Extract FAQ ID and new status from request body
        const { id, is_active } = req.body;
        // Call the service method to change the status of the FAQ
        const result = await FaqService.changeStatus(id, is_active);
        // Send the response using the utility function
        Utils.sendResponse(result, req, res);
    },

    /**
     * Delete an FAQ by its ID.
     * @param {Object} req - The Express request object containing the FAQ ID in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    deleteFaq: async function (req, res) {
        // Extract FAQ ID from request body
        const { id } = req.body;
        // Call the service method to delete the FAQ
        const result = await FaqService.deleteFaq(id);
        // Send the response using the utility function
        Utils.sendResponse(result, req, res);
    },

    /**
     * Retrieve FAQ details by FAQ ID.
     * @param {Express.Request} req - The Express request object.
     * @param {Express.Response} res - The Express response object.
     */
    getFaqDetailById: async function (req, res) {
        // Extract FAQ ID from request query
        const { faq_id } = req.query;
        // Call the service method to retrieve FAQ details by ID
        const result = await FaqService.getFaqDetailById(faq_id);
        // Send the response using the utility function
        Utils.sendResponse(result, req, res);
    },
};

module.exports = FaqController; // Export FaqController module
