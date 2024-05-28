const TestimonialService = require('../../services/testimonialServices/testimoonial.service');
const Utils = require('../../utility/utils');

const TestimonialController = {
    /**
     * Create a new testimonial.
     * @param {Object} req - The Express request object containing the testimonial data in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    addTestimonial: async function (req, res) {
        const testimonialData = req.body;
        const result = await TestimonialService.addTestimonial(testimonialData);
        Utils.sendResponse(result, req, res);  
    },

    /**
     * List all testimonials with optional pagination and search.
     * @param {Object} req - The Express request object containing query parameters for pagination and search.
     * @param {Object} res - The Express response object used to send the response.
     */
    listAllTestimonial: async function (req, res) {
        const { limit, offset, searchQuery } = req.query;
        const limitValue = parseInt(limit) || 10; // Default limit is set to 10
        const offsetValue = parseInt(offset) || 0; // Default offset is set to 0
        const result = await TestimonialService.listAllTestimonial(limitValue, offsetValue, searchQuery || "");
        Utils.sendResponse(result, req, res);
    },

    /**
     * Change the status of a testimonial by its ID.
     * @param {Object} req - The Express request object containing the testimonial ID and new status in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    changeStatus: async function (req, res) {
        const { id, is_active } = req.body;
        const result = await TestimonialService.changeStatus(id, is_active);
        Utils.sendResponse(result, req, res);
    },

    /**
     * Delete a testimonial by its ID.
     * @param {Object} req - The Express request object containing the testimonial ID in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    deleteTestimonial: async function (req, res) {
        const { id } = req.body;
        const result = await TestimonialService.deleteTestimonial(id);
        Utils.sendResponse(result, req, res);
    },

    /**
     * Retrieve testimonial details by testimonial ID.
     * @param {Express.Request} req - The Express request object.
     * @param {Express.Response} res - The Express response object.
     */
    getTestimonialDetailById: async function (req, res) {
        // Extract testimonial ID from the request query
        const { testimonial_id } = req.query;
        // Call the service method to retrieve testimonial details by ID
        const result = await TestimonialService.getTestimonialDetailById(testimonial_id);
        // Send the response
        Utils.sendResponse(result, req, res);
    },
};

module.exports = TestimonialController;