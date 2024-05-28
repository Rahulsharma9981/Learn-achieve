const FaqModel = require("../../models/faq/faq.model"); // Import FaqModel for interacting with the database
const Utils = require("../../utility/utils"); // Import Utils module for handling utility functions
const MessageConstants = require("../../utility/MessageConstants"); // Import MessageConstants module for storing constant messages
const HTTPStatus = require("http-status"); // Import HTTPStatus module for HTTP status codes

const faqService = {
    /**
     * Create a new FAQ category or update an existing one.
     * @param {Object} faqData - The data of the FAQ category to be created or updated.
     * @returns {Object} An object containing a success message and the created/updated FAQ category data, or an error response.
     */
    addFaq: async (faqData) => {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams(
                { name: "faq_category_id", value: faqData.faq_category_id },
                { name: "question", value: faqData.question },
                { name: "answer", value: faqData.answer }
            );

            if (emptyParams.length > 0) {
                // Return error response if any required parameter is missing
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            const faq_id = faqData.faq_id;

            if (faq_id) {
                // Check if any existing FAQ category matches the conditions
                const existingFaq = await FaqModel.findById(faq_id);

                if (!existingFaq) {
                    return Utils.errorResponse(MessageConstants.INVALID_ID);
                }
                // Update existing FAQ category if faq_id is provided
                const updatedFaq = await FaqModel.findByIdAndUpdate(
                    faq_id,
                    faqData,
                    { new: true }
                );
                const { _id: _id, ...user } = updatedFaq.toObject();
                return { message: MessageConstants.UPDATE, faqData: { faq_id, ...user }, };
            } else {
                // Create new FAQ category if no faq_id is provided
                const newFaq = await FaqModel.create(faqData);
                const { _id: faq_id, ...user } = newFaq.toObject();
                return {
                    message: MessageConstants.SUCCESS,
                    faqData: { faq_id, ...user },
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
     * @param {string} searchTerm - The search term to filter FAQ categories by question.
     * @returns {Object} An object containing the fetched FAQ categories and the total count, or an error response.
     */
    listAllFaq: async function (limitValue, offsetValue, searchTerm) {
        try {
            // Define the base query to filter non-deleted FAQ categories
            const baseQuery = { is_deleted: false };

            // Modify the base query to include the search term if provided
            if (searchTerm) {
                // Use a regex pattern to perform case-insensitive search on question field
                baseQuery.question = { $regex: searchTerm, $options: "i" };
            }

            // Fetch total count of FAQ categories based on the filtered query
            const totalCount = await FaqModel.countDocuments(baseQuery);

            // Fetch FAQ categories from the database with pagination and filtered by search criteria
            const result = await FaqModel.find(baseQuery)
                .skip(offsetValue * limitValue)
                .limit(limitValue);

            const formattedFaq = result.map((faq) => ({
                faq_id: faq._id, // Assigning _id to faq_id in the response
                faq_category_id: faq.faq_category_id,
                question: faq.question,
                answer: faq.answer,
                is_active: faq.is_active,
                is_deleted: faq.is_deleted
                }));    
            return { availableDataCount: totalCount, faqData: formattedFaq };
        } catch (error) {
            // Return error response
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
            const existingFaq = await FaqModel.findById(id);

            if (!existingFaq) {
                return Utils.errorResponse(MessageConstants.INVALID_ID);
            }

            // Update the is_active field
            existingFaq.is_active = is_active;

            // Save the updated FAQ category to the database
            await existingFaq.save();

            return {
                message: `FAQ ${is_active ? "activated" : "deactivated"
                    } successfully`,
                faq: existingFaq,
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
    deleteFaq: async function (ids) {
        try {
            // Check if IDs array is provided and not empty
            if (!Array.isArray(ids) || ids.length === 0) {
                return Utils.errorResponse(MessageConstants.INVALID_ID);
            }

            const invalidIds = [];

            // Validate and mark FAQ categories as deleted using Promise.all
            await Promise.all(
                ids.map(async (id) => {
                    const existingData = await FaqModel.findById(id);
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
     * @param {string} faq_id - The ID of the FAQ category to retrieve details for.
     * @returns {Object} An object containing a message and the details of the FAQ category, or an error response.
     */
    getFaqDetailById: async function (faq_id) {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams({
                name: "faq_id",
                value: faq_id,
            });
            if (emptyParams.length > 0) {
                // Return error response if any required parameter is missing
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            // Retrieve FAQ category details associated with the provided ID
            const result = await FaqModel.findById(faq_id);

            if (result) {
                // Return success message along with the FAQ category details
                const {_id:faq_id,faq_category_id:faq_category_id,question:question,answer:answer} = result.toObject();  
                return { message: MessageConstants.SUCCESS, faqDetails: {faq_id,faq_category_id,question,answer} };
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

module.exports = faqService; // Export faqCategoryService module
