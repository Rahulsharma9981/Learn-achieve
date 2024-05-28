const AuthorService = require('../../services/author/author.service');
const Utils = require('../../utility/utils');

const AuthorController = {
    /**
     * Create a new author.
     * @param {Object} req - The Express request object containing the author data in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    addAuthor: async function (req, res) {
        const authorData = req.body;
        const result = await AuthorService.addAuthor(authorData, req);
        Utils.sendResponse(result, req, res);  
    },

    /**
     * List all authors with optional pagination and search.
     * @param {Object} req - The Express request object containing query parameters for pagination and search.
     * @param {Object} res - The Express response object used to send the response.
     */
    listAuthors: async function (req, res) {
        const { limit, offset, searchQuery } = req.query;
        const limitValue = parseInt(limit) || 10; // Default limit is set to 10
        const offsetValue = parseInt(offset) || 0; // Default offset is set to 0
        const result = await AuthorService.listAuthors(limitValue, offsetValue, searchQuery || "");
        Utils.sendResponse(result, req, res);
    },

    /**
     * Retrieve all authors without pagination.
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     */
    getAllAuthorWithoutPagination: async function (req, res) {
        const result = await AuthorService.getAllAuthorWithoutPagination();
        Utils.sendResponse(result, req, res);
    },

    /**
     * Change the status of an author by its ID.
     * @param {Object} req - The Express request object containing the author ID and new status in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    changeStatus: async function (req, res) {
        const { id, is_active } = req.body;
        const result = await AuthorService.changeStatus(id, is_active);
        Utils.sendResponse(result, req, res);
    },

    /**
     * Delete an author by its ID.
     * @param {Object} req - The Express request object containing the author ID in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    deleteAuthor: async function (req, res) {
        const { id } = req.body;
        const result = await AuthorService.deleteAuthor(id);
        Utils.sendResponse(result, req, res);
    },

    /**
     * Retrieve author details by author ID.
     * @param {Express.Request} req - The Express request object
     * @param {Express.Response} res - The Express response object
     */
    getAuthorDetailById: async function (req, res) {
        // Extract author ID from the request query
        const { author_id } = req.query;
        // Call the service method to retrieve author details by ID
        const result = await AuthorService.getAuthorDetailById(author_id);
        // Send the response
        Utils.sendResponse(result, req, res);
    },
};

module.exports = AuthorController;
