const BlogModel = require("../../models/blog/Blog.model");
const Utils = require("../../utility/utils"); // Import Utils module if not already imported
const MessageConstants = require("../../utility/MessageConstants"); // Import MessageConstants module if not already imported
const HTTPStatus = require("http-status"); // Import HTTPStatus module if not already imported
const moment = require('moment');

const blogCategoryService = {
    /**
     * Create a new blog category or update an existing one.
     * @param {Object} blogData - The data of the blog category to be created or updated.
     * @returns {Object} An object containing a success message and the created/updated blog category data, or an error response.
     */
    addBlog: async (blogData,req) => {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams(
                { name: "category_id", value: blogData.category_id },
                { name: "author_id", value: blogData.author_id },
                { name: "date", value: blogData.date },
                { name: "title", value: blogData.title },
                { name: "briefIntro", value: blogData.briefIntro },
                { name: "details", value: blogData.details },
            );

            if (emptyParams.length > 0) {
                // Return error response if any required parameter is missing
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            const blog_id = blogData.blog_id;
            if (req.files) {
                // blogData.mainImage = req.files['mainImage'][0].path;
                // blogData.featuredImage = req.files['featuredImage'][0].path; // commented By (Rahul)
                
                // Added by (Rahul) 
                blogData.mainImage = {
                    name: req.files["mainImage"][0].originalname,
                    size: req.files["mainImage"][0].size,
                    url: req.files["mainImage"][0].path,
                    type: req.files["mainImage"][0].mimetype,
                  };
                  blogData.featuredImage = {
                    name: req.files["featuredImage"][0].originalname,
                    size: req.files["featuredImage"][0].size,
                    url: req.files["featuredImage"][0].path,
                    type: req.files["featuredImage"][0].mimetype,
                  };
            } else {
                return Utils.errorResponse(`${MessageConstants.MISSING_PARAMETERS}: ${"image"}`);
            }

            if (blog_id) {
                // Check if any existing blog category matches the conditions
                const existingBlogCategory = await BlogModel.findById(blog_id);

                if (!existingBlogCategory) {
                    return Utils.errorResponse(MessageConstants.INVALID_ID);
                }
                // Update existing blog category if blog_id is provided
                const updatedBlogCategory = await BlogModel.findByIdAndUpdate(
                    blog_id,
                    blogData,
                    { new: true }
                );
                const { _id: _id, ...user } = updatedBlogCategory.toObject();
                return {
                    message: MessageConstants.UPDATE,
                    blogData: { blog_id, ...user },
                };
            } else {
                // Create new blog category if no blog_id is provided
                const newBlogCategory = await BlogModel.create(blogData);
                const { _id: blog_id, ...user } = newBlogCategory.toObject();
                return {
                    message: MessageConstants.SUCCESS,
                    blogData: { blog_id, ...user },
                };
            }
        } catch (error) {
            console.log("this is eror",error)
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
    listAllBlog: async function (limitValue, offsetValue, searchTerm) {
        try {
            // Define the base query to filter non-deleted blog categories
            const baseQuery = { is_deleted: false };

            // Modify the base query to include the search term if provided
            if (searchTerm) {
                // Use a regex pattern to perform case-insensitive search on categoryName field
                baseQuery.title = { $regex: searchTerm, $options: "i" };
            }

            // Fetch total count of blog categories based on the filtered query
            const totalCount = await BlogModel.countDocuments(baseQuery);

            // Fetch blog categories from the database with pagination and filtered by search criteria
            const result = await BlogModel.find(baseQuery)
                .skip(offsetValue * limitValue)
                .limit(limitValue);

            const formattedBlog = result.map((blog) => ({
                blog_id: blog._id, // Assigning _id to module_id in the response
                title: blog.title,
                date: moment(blog.date).format('DD MMMM,YYYY'), // Format the date using moment.js
                briefIntro: blog.briefIntro,
                details: blog.details,
                mainImage: blog.mainImage,
                featuredImage: blog.featuredImage,
                is_active: blog.is_active,
                is_deleted: blog.is_deleted,
                author_id: blog.author_id,
                category_id: blog.category_id
                }));    
            return { availableDataCount: totalCount, blogs: formattedBlog };
        } catch (error) {
            // Return error response
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
            const existingBlog = await BlogModel.findById(id);

            if (!existingBlog) {
                return Utils.errorResponse(MessageConstants.INVALID_ID);
            }

            // Update the is_active field
            existingBlog.is_active = is_active;

            // Save the updated blog category to the database
            await existingBlog.save();

            return {
                message: `Blog ${is_active ? "activated" : "deactivated"
                    } successfully`,
                blogCategory: existingBlog,
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
    deleteBlog: async function (ids) {
        try {
            // Check if IDs array is provided and not empty
            if (!Array.isArray(ids) || ids.length === 0) {
                return Utils.errorResponse(MessageConstants.INVALID_ID);
            }

            const invalidIds = [];

            // Validate and mark blog categories as deleted using Promise.all
            await Promise.all(
                ids.map(async (id) => {
                    const existingData = await BlogModel.findById(id);
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
            console.log(error);
            // Return error response
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },


    /**
   * Retrieve blog category details by category ID.
   * @param {string} blog_id - The ID of the category to retrieve details for.
   * @returns {Object} An object containing a message and the details of the category, or an error response.
   */
    getBlogDetailById: async function (blog_id) {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams({
                name: "blog_id",
                value: blog_id,
            });
            if (emptyParams.length > 0) {
                // Return error response if any required parameter is missing
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            // Retrieve category details associated with the provided ID
            const result = await BlogModel.findById(blog_id);

            if (result) {
                // Return success message along with the category details
                const {_id:blog_id,title:title,date:date,briefIntro:briefIntro,details:details,category_id:category_id,author_id:author_id,mainImage:mainImage,featuredImage:featuredImage} = result.toObject();  
                return { message: MessageConstants.SUCCESS, blogDetails: {blog_id,title,date,briefIntro,details,category_id,author_id,mainImage,featuredImage} };
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
