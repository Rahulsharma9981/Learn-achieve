const bannerService = require("../../services/banner/banner.service");
const Utils = require("../../utility/utils");

const bannerController = {

    /**
     * Handles the addition of a new banner.
     * @param {Express.Request} req - The Express request object
     * @param {Express.Response} res - The Express response object
     */
    addBanner: async function (req, res) {
        const result = await bannerService.addBanner(req);
        Utils.sendResponse(result, req, res);
    },

    /**
     * Fetches all banners with optional pagination and search query.
     * @param {Express.Request} req - The Express request object
     * @param {Express.Response} res - The Express response object
     */
    getAllBanner: async function (req, res) {
        const { limit, offset, searchQuery } = req.query;
        const limitValue = parseInt(limit) || 10; // Default limit is set to 10
        const offsetValue = parseInt(offset) || 0; // Default offset is set to 0
        const result = await bannerService.getAllBanner(limitValue, offsetValue, searchQuery || "");
        Utils.sendResponse(result, req, res);
    },

    /**
     * Fetches a banner by its ID.
     * @param {Express.Request} req - The Express request object
     * @param {Express.Response} res - The Express response object
     */
    getBannerById: async function (req, res) {
        const { id } = req.params;
        // Retrieve banner by ID using the service
        const result = await bannerService.getBannerById(id);
        // Send response
        Utils.sendResponse(result, req, res);
    },

    /**
     * Deletes a banner by its ID.
     * @param {Express.Request} req - The Express request object
     * @param {Express.Response} res - The Express response object
     */
    deleteBanner: async function (req, res) {
        const { id } = req.body;
        const result = await bannerService.deleteBanner(id);
        Utils.sendResponse(result, req, res);
    },
};

module.exports = bannerController;
