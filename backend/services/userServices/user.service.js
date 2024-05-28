const UserModel = require("../../models/webModel/User.model");
const Utils = require("../../utility/utils"); // Import Utils module if not already imported
const MessageConstants = require("../../utility/MessageConstants"); // Import MessageConstants module if not already imported
const HTTPStatus = require("http-status"); // Import HTTPStatus module if not already imported
const moment = require('moment');

const userService = {

    /**
     * Fetches mock tests from the database with optional pagination and search criteria.
     * @param {number} limitValue - The limit for the number of mock tests to fetch.
     * @param {number} offsetValue - The number of mock tests to skip.
     * @param {string} searchTerm - The search term to filter mock tests by name.
     * @returns {Object} An object containing the fetched mock tests and the total count, or an error response.
     */
    listAllUsers: async function (limitValue, offsetValue, searchTerm) {
        try {
            // Define the base query to filter non-deleted mock tests
            const baseQuery = { is_deleted: false };

            // Modify the base query to include the search term if provided
            if (searchTerm) {
                // Use a regex pattern to perform case-insensitive search on mockTestName field
                baseQuery.mockTestName = { $regex: searchTerm, $options: "i" };
            }

            // Fetch total count of mock tests based on the filtered query
            const totalCount = await UserModel.countDocuments(baseQuery);

            // Fetch mock tests from the database with pagination and filtered by search criteria
            const result = await UserModel.find(baseQuery)
                .skip(offsetValue * limitValue)
                .limit(limitValue);

            const formattedUser = result.map((user) => ({
                user_id: user._id, // Assigning _id to module_id in the response
                firstName: user.firstName,
                middleName: user.middleName,
                lastName: user.lastName,
                email: user.email,
                mobile: user.mobile,
                schoolName: user.schoolName
                }));    

            return { availableDataCount: totalCount, UserData: formattedUser };
        } catch (error) {
            // Return error response
            return Utils.errorResponse(
                MessageConstants.INTERNAL_SERVER_ERROR,
                HTTPStatus.INTERNAL_SERVER_ERROR
            );
        }
    },

    /**
     * Deletes mock tests with the provided IDs by marking them as deleted.
     * @param {Array<string>} ids - The IDs of the mock tests to be deleted.
     * @returns {Object} An object containing the message and the deleted mock tests, or an error response.
     */
    deleteUser: async function (ids) {
        try {
            // Check if IDs array is provided and not empty
            if (!Array.isArray(ids) || ids.length === 0) {
                return Utils.errorResponse(MessageConstants.INVALID_ID);
            }

            const invalidIds = [];

            // Validate and mark mock tests as deleted using Promise.all
            await Promise.all(
                ids.map(async (id) => {
                    const existingData = await UserModel.findById(id);
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
   * Retrieve topic details by topic ID.
   * @param {string} user_id - The ID of the topic to retrieve details for.
   * @returns {Object} An object containing a message and the details of the topic, or an error response.
   */
    getUserDetailById: async function (user_id) {
        try {
            // Validate input parameters
            const emptyParams = Utils.checkEmptyParams({ name: "user_id", value: user_id});
            if (emptyParams.length > 0) {
                // Return error response if any required parameter is missing
                return Utils.errorResponse(
                    `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
                );
            }

            // Retrieve topic details associated with the provided topic ID
            const result = await UserModel.findById(user_id);

            if (result) {
                const {password, otp, __v,is_active,is_deleted,created_date,updated_date,_id:user_id,dateOfBirth:DOB, ...user } = result.toObject();
                var dateOfBirth = moment(DOB).format('DD/MM/YYYY');
                // Return success message along with the topic details
                return { message: MessageConstants.SUCCESS, userDetails: {user_id, dateOfBirth, ...user} };
            } else {
                // Return error response if no topic found with the provided ID
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

module.exports = userService;
