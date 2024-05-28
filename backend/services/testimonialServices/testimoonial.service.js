const TestimonialModel = require("../../models/testimonial/testimonial.model");
const Utils = require("../../utility/utils"); // Import Utils module if not already imported
const MessageConstants = require("../../utility/MessageConstants"); // Import MessageConstants module if not already imported
const HTTPStatus = require("http-status"); // Import HTTPStatus module if not already imported

const testimonialService = {
    /**
     * Create a new testimonial or update an existing one.
     * @param {Object} testimonialData - The data of the testimonial to be created or updated.
     * @returns {Object} An object containing a success message and the created/updated testimonial data, or an error response.
     */
    addTestimonial: async (testimonialData) => {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams(
                { name: "name", value: testimonialData.name },
                { name: "feedback", value: testimonialData.feedback }
            );

            if (emptyParams.length > 0) {
                // Return error response if any required parameter is missing
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            const testimonial_id = testimonialData.testimonial_id;

            if (testimonial_id) {
                // Check if any existing testimonial matches the conditions
                const existingTestimonial = await TestimonialModel.findById(testimonial_id);

                if (!existingTestimonial) {
                    return Utils.errorResponse(MessageConstants.INVALID_ID);
                }
                // Update existing testimonial if testimonial_id is provided
                const updatedTestimonial = await TestimonialModel.findByIdAndUpdate(
                    testimonial_id,
                    testimonialData,
                    { new: true }
                );
                const { _id: _id, ...user } = updatedTestimonial.toObject();
                return {
                    message: MessageConstants.UPDATE,
                    testimonialData: { testimonial_id, ...user },
                };
            } else {
                // Create new testimonial if no testimonial_id is provided
                const newTestimonial = await TestimonialModel.create(testimonialData);
                const { _id: testimonial_id, ...user } = newTestimonial.toObject();
                return {
                    message: MessageConstants.SUCCESS,
                    testimonialData: { testimonial_id, ...user },
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
     * Fetches testimonials from the database with optional pagination and search criteria.
     * @param {number} limitValue - The limit for the number of testimonials to fetch.
     * @param {number} offsetValue - The number of testimonials to skip.
     * @param {string} searchTerm - The search term to filter testimonials by name.
     * @returns {Object} An object containing the fetched testimonials and the total count, or an error response.
     */
    listAllTestimonial: async function (limitValue, offsetValue, searchTerm) {
        try {
            // Define the base query to filter non-deleted testimonials
            const baseQuery = { is_deleted: false };

            // Modify the base query to include the search term if provided
            if (searchTerm) {
                // Use a regex pattern to perform case-insensitive search on name field
                baseQuery.name = { $regex: searchTerm, $options: "i" };
            }

            // Fetch total count of testimonials based on the filtered query
            const totalCount = await TestimonialModel.countDocuments(baseQuery);

            // Fetch testimonials from the database with pagination and filtered by search criteria
            const result = await TestimonialModel.find(baseQuery)
                .skip(offsetValue * limitValue)
                .limit(limitValue);

            const formattedTestimonial = result.map((testimonialData) => ({
                testimonial_id: testimonialData._id, // Assigning _id to testimonial_id in the response
                name: testimonialData.name,
                designation: testimonialData.designation,
                feedback: testimonialData.feedback,
                is_active: testimonialData.is_active,
                is_deleted: testimonialData.is_deleted
                }));    
            return { availableDataCount: totalCount, testimonialData: formattedTestimonial };
        } catch (error) {
            // Return error response
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    /**
     * Update the status (is_active) of a testimonial in the database.
     * @param {string} id - The ID of the testimonial to be updated.
     * @param {boolean} is_active - The new status value for the testimonial (true/false).
     * @returns {Object} An object containing a success message and the updated testimonial, or an error response.
     */
    changeStatus: async function (id, is_active) {
        try {
            // Check if the testimonial exists
            const existingTestimonial = await TestimonialModel.findById(id);

            if (!existingTestimonial) {
                return Utils.errorResponse(MessageConstants.INVALID_ID);
            }

            // Update the is_active field
            existingTestimonial.is_active = is_active;

            // Save the updated Testimonial to the database
            await existingTestimonial.save();

            return {
                message: `Testimonial ${is_active ? "activated" : "deactivated"
                    } successfully`,
                blogCategory: existingTestimonial,
            };
        } catch (error) {
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    /**
     * Deletes testimonials with the provided IDs by marking them as deleted.
     * @param {Array<string>} ids - The IDs of the testimonials to be deleted.
     * @returns {Object} An object containing the message and the deleted testimonials, or an error response.
     */
    deleteTestimonial: async function (ids) {
        try {
            // Check if IDs array is provided and not empty
            if (!Array.isArray(ids) || ids.length === 0) {
                return Utils.errorResponse(MessageConstants.INVALID_ID);
            }

            const invalidIds = [];

            // Validate and mark testimonials as deleted using Promise.all
            await Promise.all(
                ids.map(async (id) => {
                    const existingData = await TestimonialModel.findById(id);
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
   * Retrieve testimonial details by testimonial ID.
   * @param {string} testimonial_id - The ID of the testimonial to retrieve details for.
   * @returns {Object} An object containing a message and the details of the testimonial, or an error response.
   */
    getTestimonialDetailById: async function (testimonial_id) {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams({
                name: "testimonial_id",
                value: testimonial_id,
            });
            if (emptyParams.length > 0) {
                // Return error response if any required parameter is missing
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            // Retrieve testimonial details associated with the provided ID
            const result = await TestimonialModel.findById(testimonial_id);

            if (result) {
                // Return success message along with the testimonial details
                const {_id:testimonial_id,name:name,designation:designation,feedback:feedback} = result.toObject();  
                return { message: MessageConstants.SUCCESS, testimonialDetails: {testimonial_id,name,designation,feedback} };
            } else {
                // Return error response if no testimonial found with the provided ID
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

module.exports = testimonialService;