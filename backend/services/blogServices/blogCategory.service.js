const BlogCategoryModel = require("../../models/blog/BlogCategory.model");
const Utils = require("../../utility/utils"); // Import Utils module if not already imported
const MessageConstants = require("../../utility/MessageConstants"); // Import MessageConstants module if not already imported
const HTTPStatus = require("http-status"); // Import HTTPStatus module if not already imported

const blogCategoryService = {
    /**
     * Create a new blog category or update an existing one.
     * @param {Object} blogCategoryData - The data of the blog category to be created or updated.
     * @returns {Object} An object containing a success message and the created/updated blog category data, or an error response.
     */
    addBlogCategory: async (blogCategoryData) => {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams(
                { name: "categoryName", value: blogCategoryData.categoryName }
            );

            if (emptyParams.length > 0) {
                // Return error response if any required parameter is missing
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            const blog_category_id = blogCategoryData.blog_category_id;

            if (blog_category_id) {
                // Check if any existing blog category matches the conditions
                const existingBlogCategory = await BlogCategoryModel.findById(blog_category_id);

                if (!existingBlogCategory) {
                    return Utils.errorResponse(MessageConstants.INVALID_ID);
                }

                const existingData = await BlogCategoryModel.findOne({
                    categoryName: blogCategoryData.categoryName,
                    _id: { $ne: blog_category_id },
                    is_deleted: false
                });
          
                if (existingData) {
                    return Utils.errorResponse(MessageConstants.BLOG_CATEGORY_EXISTS);
                }
                // Update existing blog category if blog_category_id is provided
                const updatedBlogCategory = await BlogCategoryModel.findByIdAndUpdate(
                    blog_category_id,
                    blogCategoryData,
                    { new: true }
                );
                const { _id: _id, ...user } = updatedBlogCategory.toObject();
                return {
                    message: MessageConstants.UPDATE,
                    blogCategoryData: { blog_category_id, ...user },
                };
            } else {
                const existingData = await BlogCategoryModel.findOne({
                    categoryName: blogCategoryData.categoryName,
                    is_deleted: false
                });
          
                if (existingData) {
                    return Utils.errorResponse(MessageConstants.BLOG_CATEGORY_EXISTS);
                }
                // Create new blog category if no blog_category_id is provided
                const newBlogCategory = await BlogCategoryModel.create(blogCategoryData);
                const { _id: blog_category_id, ...user } = newBlogCategory.toObject();
                return {
                    message: MessageConstants.SUCCESS,
                    blogCategoryData: { blog_category_id, ...user },
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
     * Fetches blog categories from the database with optional pagination and search criteria.
     * @param {number} limitValue - The limit for the number of blog categories to fetch.
     * @param {number} offsetValue - The number of blog categories to skip.
     * @param {string} searchTerm - The search term to filter blog categories by name.
     * @returns {Object} An object containing the fetched blog categories and the total count, or an error response.
     */
    listBlogCategorys: async function (limitValue, offsetValue, searchTerm) {
        try {
            // Define the base query to filter non-deleted blog categories
            const baseQuery = { is_deleted: false };

            // Modify the base query to include the search term if provided
            if (searchTerm) {
                // Use a regex pattern to perform case-insensitive search on categoryName field
                baseQuery.categoryName = { $regex: searchTerm, $options: "i" };
            }

            // Fetch total count of blog categories based on the filtered query
            const totalCount = await BlogCategoryModel.countDocuments(baseQuery);

            // Fetch blog categories from the database with pagination and filtered by search criteria
            const result = await BlogCategoryModel.find(baseQuery)
                .skip(offsetValue * limitValue)
                .limit(limitValue);

            const formattedBlogCategory = result.map((blogCategory) => ({
                blog_category_id: blogCategory._id, // Assigning _id to module_id in the response
                categoryName: blogCategory.categoryName,
                is_active: blogCategory.is_active,
                is_deleted: blogCategory.is_deleted
                }));    
            return { availableDataCount: totalCount, blogCategory: formattedBlogCategory };
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
    getAllBlogCategoryWithoutPagination: async function () {
        try {
            var condition = { is_deleted: false, is_active: true }
            // Fetch blog categories from the database without pagination and not deleted
            const data = await BlogCategoryModel.find(condition);
            return { message: MessageConstants.SUCCESS, data: data };
        } catch (error) {
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    /**
     * Update the status (is_active) of a blog category in the database.
     * @param {string} id - The ID of the blog category to be updated.
     * @param {boolean} is_active - The new status value for the blog category (true/false).
     * @returns {Object} An object containing a success message and the updated blog category, or an error response.
     */
    changeStatus: async function (id, is_active) {
        try {
            // Check if the blog category exists
            const existingBlogCategory = await BlogCategoryModel.findById(id);

            if (!existingBlogCategory) {
                return Utils.errorResponse(MessageConstants.INVALID_ID);
            }

            // Update the is_active field
            existingBlogCategory.is_active = is_active;

            // Save the updated blog category to the database
            await existingBlogCategory.save();

            return {
                message: `Blog Category ${is_active ? "activated" : "deactivated"
                    } successfully`,
                blogCategory: existingBlogCategory,
            };
        } catch (error) {
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    /**
     * Deletes blog categories with the provided IDs by marking them as deleted.
     * @param {Array<string>} ids - The IDs of the blog categories to be deleted.
     * @returns {Object} An object containing the message and the deleted blog categories, or an error response.
     */
    deleteBlogCategory: async function (ids) {
        try {
            // Check if IDs array is provided and not empty
            if (!Array.isArray(ids) || ids.length === 0) {
                return Utils.errorResponse(MessageConstants.INVALID_ID);
            }

            const invalidIds = [];

            // Validate and mark blog categories as deleted using Promise.all
            await Promise.all(
                ids.map(async (id) => {
                    const existingData = await BlogCategoryModel.findById(id);
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
   * Retrieve blog category details by category ID.
   * @param {string} blog_category_id - The ID of the category to retrieve details for.
   * @returns {Object} An object containing a message and the details of the category, or an error response.
   */
    getBlogCategoryDetailById: async function (blog_category_id) {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams({
                name: "blog_category_id",
                value: blog_category_id,
            });
            if (emptyParams.length > 0) {
                // Return error response if any required parameter is missing
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            // Retrieve category details associated with the provided ID
            const result = await BlogCategoryModel.findById(blog_category_id);

            if (result) {
                // Return success message along with the category details
                const {_id:blog_category_id,categoryName:categoryName} = result.toObject();  
                return { message: MessageConstants.SUCCESS, blogCategoryDetails: {blog_category_id,categoryName} };
            } else {
                // Return error response if no category found with the provided ID
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

module.exports = blogCategoryService;
