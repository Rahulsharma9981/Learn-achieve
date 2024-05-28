const FaqCategoryModel = require("../../models/faq/faqCategory.model"); // Import FaqCategoryModel for interacting with the database
const Utils = require("../../utility/utils"); // Import Utils module for handling utility functions
const MessageConstants = require("../../utility/MessageConstants"); // Import MessageConstants module for storing constant messages
const HTTPStatus = require("http-status"); // Import HTTPStatus module for HTTP status codes

const faqCategoryService = {
    /**
     * Create a new FAQ category or update an existing one.
     * @param {Object} faqCategoryData - The data of the FAQ category to be created or updated.
     * @returns {Object} An object containing a success message and the created/updated FAQ category data, or an error response.
     */
    addFaqCategory: async (faqCategoryData) => {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams(
                { name: "faqCategoryName", value: faqCategoryData.faqCategoryName }
            );

            if (emptyParams.length > 0) {
                // Return error response if any required parameter is missing
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            const faq_category_id = faqCategoryData.faq_category_id;

            if (faq_category_id) {
                // Check if any existing FAQ category matches the conditions
                const existingFaqCategory = await FaqCategoryModel.findById(faq_category_id);

                if (!existingFaqCategory) {
                    return Utils.errorResponse(MessageConstants.INVALID_ID);
                }

                const existingData = await FaqCategoryModel.findOne({
                    faqCategoryName: faqCategoryData.faqCategoryName,
                    _id: { $ne: faq_category_id },
                    is_deleted: false
                });
          
                if (existingData) {
                    return Utils.errorResponse(MessageConstants.FAQ_CATEGORY_EXISTS);
                }
                // Update existing FAQ category if faq_category_id is provided
                const updatedFaqCategory = await FaqCategoryModel.findByIdAndUpdate(
                    faq_category_id,
                    faqCategoryData,
                    { new: true }
                );
                const { _id: _id, ...user } = updatedFaqCategory.toObject();
                return { message: MessageConstants.UPDATE, faqCategoryData: { faq_category_id, ...user }, };
            } else {

                const existingData = await FaqCategoryModel.findOne({
                    faqCategoryName: faqCategoryData.faqCategoryName,
                    is_deleted: false
                });
          
                if (existingData) {
                    return Utils.errorResponse(MessageConstants.FAQ_CATEGORY_EXISTS);
                }
                // Create new FAQ category if no faq_category_id is provided
                const newFaqCategory = await FaqCategoryModel.create(faqCategoryData);
                const { _id: faq_category_id, ...user } = newFaqCategory.toObject();
                return {
                    message: MessageConstants.SUCCESS,
                    faqCategoryData: { faq_category_id, ...user },
                };
            }
        } catch (error) {
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    /**
     * Fetches FAQ categories from the database with optional pagination and search criteria.
     * @param {number} limitValue - The limit for the number of FAQ categories to fetch.
     * @param {number} offsetValue - The number of FAQ categories to skip.
     * @param {string} searchTerm - The search term to filter FAQ categories by name.
     * @returns {Object} An object containing the fetched FAQ categories and the total count, or an error response.
     */
    listAllFaqCategory: async function (limitValue, offsetValue, searchTerm) {
        try {
            // Define the base query to filter non-deleted FAQ categories
            const baseQuery = { is_deleted: false };

            // Modify the base query to include the search term if provided
            if (searchTerm) {
                // Use a regex pattern to perform case-insensitive search on name field
                baseQuery.faqCategoryName = { $regex: searchTerm, $options: "i" };
            }

            // Fetch total count of FAQ categories based on the filtered query
            const totalCount = await FaqCategoryModel.countDocuments(baseQuery);

            // Fetch FAQ categories from the database with pagination and filtered by search criteria
            const result = await FaqCategoryModel.find(baseQuery)
                .skip(offsetValue * limitValue)
                .limit(limitValue);

            const formattedFaqCategory = result.map((faqCategory) => ({
                faq_category_id: faqCategory._id, // Assigning _id to faq_category_id in the response
                faqCategoryName: faqCategory.faqCategoryName,
                is_active: faqCategory.is_active,
                is_deleted: faqCategory.is_deleted
                }));    
            return { availableDataCount: totalCount, faqCategory: formattedFaqCategory };
        } catch (error) {
            // Return error response
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

     /**
     * Fetches blog categories from the database without pagination,
     * excluding the ones that are marked as deleted.
     * @returns {Object} An object containing the fetched blog categories, or an error response.
     */
    getAllFaqCategoryWithoutPagination: async function () {
        try {
            var condition = { is_deleted: false, is_active: true }
            // Fetch blog categories from the database without pagination and not deleted
            const result = await FaqCategoryModel.find(condition);
            const formattedFaqCategory = result.map((faqCategory) => ({
                faq_category_id: faqCategory._id, // Assigning _id to faq_category_id in the response
                faqCategoryName: faqCategory.faqCategoryName
            }));    
            return { message: MessageConstants.SUCCESS, data: formattedFaqCategory };
        } catch (error) {
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    /**
     * Update the status (is_active) of a FAQ category in the database.
     * @param {string} id - The ID of the FAQ category to be updated.
     * @param {boolean} is_active - The new status value for the FAQ category (true/false).
     * @returns {Object} An object containing a success message and the updated FAQ category, or an error response.
     */
    changeStatus: async function (id, is_active) {
        try {
            // Check if the FAQ category exists
            const existingFaqCategory = await FaqCategoryModel.findById(id);

            if (!existingFaqCategory) {
                return Utils.errorResponse(MessageConstants.INVALID_ID);
            }

            // Update the is_active field
            existingFaqCategory.is_active = is_active;

            // Save the updated FAQ category to the database
            await existingFaqCategory.save();

            return {
                message: `FAQ Category ${is_active ? "activated" : "deactivated"
                    } successfully`,
                faqCategory: existingFaqCategory,
            };
        } catch (error) {
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    /**
     * Deletes FAQ categories with the provided IDs by marking them as deleted.
     * @param {Array<string>} ids - The IDs of the FAQ categories to be deleted.
     * @returns {Object} An object containing the message and the deleted FAQ categories, or an error response.
     */
    deleteFaqCategory: async function (ids) {
        try {
            // Check if IDs array is provided and not empty
            if (!Array.isArray(ids) || ids.length === 0) {
                return Utils.errorResponse(MessageConstants.INVALID_ID);
            }

            const invalidIds = [];

            // Validate and mark FAQ categories as deleted using Promise.all
            await Promise.all(
                ids.map(async (id) => {
                    const existingData = await FaqCategoryModel.findById(id);
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

    /**
     * Retrieve FAQ category details by FAQ category ID.
     * @param {string} faq_category_id - The ID of the FAQ category to retrieve details for.
     * @returns {Object} An object containing a message and the details of the FAQ category, or an error response.
     */
    getFaqCategoryDetailById: async function (faq_category_id) {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams({
                name: "faq_category_id",
                value: faq_category_id,
            });
            if (emptyParams.length > 0) {
                // Return error response if any required parameter is missing
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            // Retrieve FAQ category details associated with the provided ID
            const result = await FaqCategoryModel.findById(faq_category_id);

            if (result) {
                // Return success message along with the FAQ category details
                const {_id:faq_category_id,faqCategoryName:faqCategoryName} = result.toObject();  
                return { message: MessageConstants.SUCCESS, faqCategoryDetails: {faq_category_id,faqCategoryName} };
            } else {
                // Return error response if no FAQ category found with the provided ID
                return { message: MessageConstants.INVALID_ID };
            }
        } catch (error) {
            // Return error response in case of any unexpected error
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },
};

module.exports = faqCategoryService; // Export faqCategoryService module
