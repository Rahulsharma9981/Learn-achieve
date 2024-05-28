const MockTestModel = require("../../models/mockTest/MockTest.model");
const Utils = require("../../utility/utils"); // Import Utils module if not already imported
const MessageConstants = require("../../utility/MessageConstants"); // Import MessageConstants module if not already imported
const HTTPStatus = require("http-status"); // Import HTTPStatus module if not already imported
const { default: mongoose } = require("mongoose");

const mockTestService = {
  /**
   * Create a new mock test or update an existing one.
   * @param {Object} mockTestData - The data of the mock test to be created or updated.
   * @returns {Object} An object containing a success message and the created/updated mock test data, or an error response.
   */
  createMockTest: async (mockTestData) => {
    try {
      // Validate input parameters
      const emptyParams = Utils.checkEmptyParams(
        { name: "mockTestName", value: mockTestData.mockTestName },
        { name: "class_id", value: mockTestData.class_id },
        { name: "medium", value: mockTestData.medium },
        { name: "subject_ids", value: mockTestData.subject_ids },
        { name: "totalQuestions", value: mockTestData.totalQuestions },
        { name: "durationInMinutes", value: mockTestData.durationInMinutes }
      );

      if (emptyParams.length > 0) {
        // Return error response if any required parameter is missing
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
        );
      }

      const mock_test_id = mockTestData.mock_test_id;

      if (mock_test_id) {
        // Check if any existing mock test matches the conditions
        const existingMockTest = await MockTestModel.findById(mock_test_id);

        if (!existingMockTest) {
          return Utils.errorResponse(MessageConstants.INVALID_ID);
        }
        // Update existing mock test if mock_test_id is provided
        const updatedMockTest = await MockTestModel.findByIdAndUpdate(
          mock_test_id,
          mockTestData,
          { new: true }
        );
        const { _id: _id, ...user } = updatedMockTest.toObject();
        return {
          message: MessageConstants.UPDATE,
          mockTestData: { mock_test_id, ...user },
        };
      } else {
        // Create new mock test if no mock_test_id is provided
        const newMockTest = await MockTestModel.create(mockTestData);
        const { _id: mock_test_id, ...user } = newMockTest.toObject();
        return {
          message: MessageConstants.SUCCESS,
          mockTestData: { mock_test_id, ...user },
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
   * Fetches mock tests from the database with optional pagination and search criteria.
   * @param {number} limitValue - The limit for the number of mock tests to fetch.
   * @param {number} offsetValue - The number of mock tests to skip.
   * @param {string} searchTerm - The search term to filter mock tests by name.
   * @returns {Object} An object containing the fetched mock tests and the total count, or an error response.
   */
  listMockTests: async function (limitValue, offsetValue, searchTerm) {
    try {
      // Define the base query to filter non-deleted mock tests
      const baseQuery = { is_deleted: false };

      // Modify the base query to include the search term if provided
      if (searchTerm) {
        // Use a regex pattern to perform case-insensitive search on mockTestName field
        baseQuery.mockTestName = { $regex: searchTerm, $options: "i" };
      }

      // Fetch total count of mock tests based on the filtered query
      const totalCount = await MockTestModel.countDocuments(baseQuery);

      // Fetch mock tests from the database with pagination and filtered by search criteria
      const data = await MockTestModel.find(baseQuery)
        .skip(offsetValue * limitValue)
        .limit(limitValue);

      return { availableDataCount: totalCount, data: data };
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
  getAllMockTestWithoutPagination: async function () {
    try {
        var condition = { is_deleted: false, is_active: true }
        // Fetch blog categories from the database without pagination and not deleted
        const data = await MockTestModel.find(condition);
        return { message: MessageConstants.SUCCESS, data: data };
    } catch (error) {
        return Utils.errorResponse(
            MessageConstants.INTERNAL_SERVER_ERROR,
            HTTPStatus.INTERNAL_SERVER_ERROR
        );
    }
},

  /**
   * Update the status (is_active) of a mock test in the database.
   * @param {string} id - The ID of the mock test to be updated.
   * @param {boolean} is_active - The new status value for the mock test (true/false).
   * @returns {Object} An object containing a success message and the updated mock test, or an error response.
   */
  changeStatus: async function (id, is_active) {
    try {
      // Check if the mock test exists
      const existingMockTest = await MockTestModel.findById(id);

      if (!existingMockTest) {
        return Utils.errorResponse(MessageConstants.INVALID_ID);
      }

      // Update the is_active field
      existingMockTest.is_active = is_active;

      // Save the updated mock test to the database
      await existingMockTest.save();

      return {
        message: `Mock Test ${
          is_active ? "activated" : "deactivated"
        } successfully`,
        mockTest: existingMockTest,
      };
    } catch (error) {
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
  deleteMockTest: async function (ids) {
    try {
      // Check if IDs array is provided and not empty
      if (!Array.isArray(ids) || ids.length === 0) {
        return Utils.errorResponse(MessageConstants.INVALID_ID);
      }

      const invalidIds = [];

      // Validate and mark mock tests as deleted using Promise.all
      await Promise.all(
        ids.map(async (id) => {
          const existingData = await MockTestModel.findById(id);
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
        return Utils.errorResponse( `${MessageConstants.INVALID_ID}: ${invalidIds.join(", ")}` );
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
 * @param {string} mock_test_id - The ID of the topic to retrieve details for.
 * @returns {Object} An object containing a message and the details of the topic, or an error response.
 */
  getMockTestDetailById: async function (mock_test_id) {
    try {
      // Validate input parameters
      const emptyParams = Utils.checkEmptyParams({
        name: "mock_test_id",
        value: mock_test_id,
      });
      if (emptyParams.length > 0) {
        // Return error response if any required parameter is missing
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
        );
      }

      // Retrieve topic details associated with the provided topic ID
      const result = await MockTestModel.findById(mock_test_id);

      if (result) {
        // Return success message along with the topic details
        return { message: MessageConstants.SUCCESS, mockTestDetails: result };
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

module.exports = mockTestService;
