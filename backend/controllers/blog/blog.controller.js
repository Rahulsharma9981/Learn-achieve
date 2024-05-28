const BlogService = require('../../services/blogServices/blog.service');
const Utils = require('../../utility/utils');

const BlogController = {
    /**
     * Create a new blog category.
     * @param {Object} req - The Express request object containing the blog category data in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    addBlog: async function (req, res) {
        const blogData = req.body;
        const result = await BlogService.addBlog(blogData,req);
        Utils.sendResponse(result, req, res);  
    },

    /**
     * List all blog categories with optional pagination and search.
     * @param {Object} req - The Express request object containing query parameters for pagination and search.
     * @param {Object} res - The Express response object used to send the response.
     */
    listAllBlog: async function (req, res) {
        const { limit, offset, searchQuery } = req.query;
        const limitValue = parseInt(limit) || 10; // Default limit is set to 10
        const offsetValue = parseInt(offset) || 0; // Default offset is set to 0
        const result = await BlogService.listAllBlog(limitValue, offsetValue, searchQuery || "");
        Utils.sendResponse(result, req, res);
    },


    /**
     * Change the status of a blog category by its ID.
     * @param {Object} req - The Express request object containing the blog category ID and new status in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    changeStatus: async function (req, res) {
        const { id, is_active } = req.body;
        const result = await BlogService.changeStatus(id, is_active);
        Utils.sendResponse(result, req, res);
    },

    /**
     * Delete a blog category by its ID.
     * @param {Object} req - The Express request object containing the blog category ID in the body.
     * @param {Object} res - The Express response object used to send the response.
     */
    deleteBlog: async function (req, res) {
        const { id } = req.body;
        const result = await BlogService.deleteBlog(id);
        Utils.sendResponse(result, req, res);
    },

    /**
     * Retrieve blog category details by category ID.
     * @param {Express.Request} req - The Express request object.
     * @param {Express.Response} res - The Express response object.
     */
    getBlogDetailById: async function (req, res) {
        // Extract category ID from the request query
        const { blog_id } = req.query;
        // Call the service method to retrieve category details by ID
        const result = await BlogService.getBlogDetailById(blog_id);
        // Send the response
        Utils.sendResponse(result, req, res);
    },
};

module.exports = BlogController;
