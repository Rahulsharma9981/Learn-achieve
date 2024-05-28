const Banner = require("../../models/banner/Banner.model");
const Utils = require("../../utility/utils");
const MessageConstants = require("../../utility/MessageConstants");
const HTTPStatus = require("http-status");

const bannerService = {
  
  /**
   * Handles the addition of a new banner.
   * @param {Express.Request} req - The Express request object containing the file.
   * @returns {Object} An object containing a success message and the added banner data, or an error response.
   */
  addBanner: async function (req) {
    try {
      var dataToAdd = {};
      if (req.file) {
        dataToAdd.banner_image = req.file.path;
      } else {
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: banner_image`,
          HTTPStatus.BAD_REQUEST
        );
      }
      const updateData = await Banner.create(dataToAdd);
      return { message: MessageConstants.SUCCESS, data: updateData };
    } catch (error) {
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * Retrieves all banners with optional pagination and search query.
   * @param {number} limitValue - The maximum number of banners to fetch.
   * @param {number} offsetValue - The number of banners to skip.
   * @param {string} searchTerm - The term to search for in banner data.
   * @returns {Object} An object containing the total count of banners and the retrieved banner data, or an error response.
   */
  getAllBanner: async function (limitValue, offsetValue, searchTerm) {
    try {
      // Define the base query to filter non-deleted banners
      const baseQuery = { is_deleted: false };

      // Fetch total count of banners based on the filtered query
      const totalCount = await Banner.countDocuments(baseQuery);

      // Fetch banners from the database with pagination and filtered by search criteria
      const bannerData = await Banner.find(baseQuery).skip(offsetValue * limitValue).limit(limitValue);

      const data = bannerData.map((element) => ({
        id: element._id,
        banner_image: element.banner_image,
        is_active: element.is_active,
        is_deleted: element.is_deleted
      }));
      return { availableDataCount: totalCount, data: data };
    } catch (error) {
      return Utils.errorResponse(MessageConstants.INTERNAL_SERVER_ERROR, HTTPStatus.INTERNAL_SERVER_ERROR);
    }
  },

  /**
   * Retrieves banner details by banner ID.
   * @param {string} id - The ID of the banner to retrieve details for.
   * @returns {Object} An object containing a success message and the details of the banner, or an error response.
   */
  getBannerById: async function (id) {
    try {
      // Validate input parameters
      const emptyParams = Utils.checkEmptyParams({
        name: "id",
        value: id,
      });
      if (emptyParams.length > 0) {
        // Return error response if any required parameter is missing
        return Utils.errorResponse( `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}` );
      }

      // Retrieve banner details associated with the provided banner ID
      const result = await Banner.findById(id);

      if (result) {
        // Return success message along with the banner details
        return { message: MessageConstants.SUCCESS, bannerDetails: result };
      } else {
        // Return error response if no banner found with the provided ID
        return { message: MessageConstants.INVALID_ID };
      }
    } catch (error) {
      // Return error response in case of any unexpected error
      return Utils.errorResponse( MessageConstants.INTERNAL_SERVER_ERROR, HTTPStatus.INTERNAL_SERVER_ERROR );
    }
  },

  /**
   * Deletes banners with the provided IDs by marking them as deleted.
   * @param {Array<string>} ids - The IDs of the banners to be deleted.
   * @returns {Object} An object containing the message and the deleted banners, or an error response.
   */
  deleteBanner: async function (ids) {
    try {
      // Check if IDs array is provided and not empty
      if (!Array.isArray(ids) || ids.length === 0) {
        return Utils.errorResponse(MessageConstants.INVALID_ID);
      }

      const invalidIds = [];

      // Validate and mark banners as deleted using Promise.all
      await Promise.all(
        ids.map(async (id) => {
          const existingData = await Banner.findById(id);
          if (!existingData) {
            invalidIds.push(id);
          } else {
            existingData.is_deleted = true;
            await existingData.save();
          }
        })
      );

      // Check if any invalid IDs were provided
      if (invalidIds.length > 0) {
        return Utils.errorResponse(`${MessageConstants.INVALID_ID}: ${invalidIds.join(", ")}`);
      }

      return { message: MessageConstants.DELETE };
    } catch (error) {
      // Return error response
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },
};

module.exports = bannerService;
