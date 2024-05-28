const PackageModel = require("../../models/package/package.model");
const Utils = require("../../utility/utils"); // Import Utils module if not already imported
const MessageConstants = require("../../utility/MessageConstants"); // Import MessageConstants module if not already imported
const HTTPStatus = require("http-status"); // Import HTTPStatus module if not already imported
const { default: mongoose } = require("mongoose");

const packageService = {
  /**
   * Create a new mock test or update an existing one.
   * @param {Object} packageData - The data of the mock test to be created or updated.
   * @returns {Object} An object containing a success message and the created/updated mock test data, or an error response.
   */
  addPackage: async function (packageData, req) {
    try {
      // Validate input parameters
      const emptyParams = Utils.checkEmptyParams(
        { name: "packageName", value: packageData.packageName },
        { name: "validityInDays", value: packageData.validityInDays },
        { name: "actualPrice", value: packageData.actualPrice },
        { name: "discountedPrice", value: packageData.discountedPrice }
      );

      if (emptyParams.length > 0) {
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
        );
      }

      // Convert numberOfAttempts to an array of numbers
      let numberOfAttempts = [];
      if (typeof packageData.numberOfAttempts === "string") {
        numberOfAttempts = packageData.numberOfAttempts
          .split(",")
          .map((attempt) => Number(attempt.trim()));
      } else if (Array.isArray(packageData.numberOfAttempts)) {
        numberOfAttempts = packageData.numberOfAttempts.map((attempt) =>
          Number(attempt)
        );
      } else {
        // Handle other cases if necessary
      }
      let mockTest_ids = [];
      if (Array.isArray(packageData.mockTests)) {
        mockTest_ids = packageData.mockTests.map((test) => {
          if (
            typeof test.mockTest_id === "string" &&
            /^[0-9a-fA-F]{24}$/.test(test.mockTest_id)
          ) {
            return new mongoose.Types.ObjectId(test.mockTest_id);
          } else {
            return Utils.errorResponse("Invalid mockTest_id format");
          }
        });
      } else {
        return Utils.errorResponse("mockTests must be an array");
      }

      // Handle file uploads if required
      if (req.files) {
         // Added by (Rahul) 
        packageData.mainImage = {
          name: req.files["mainImage"][0].originalname,
          size: req.files["mainImage"][0].size,
          url: req.files["mainImage"][0].path,
          type: req.files["mainImage"][0].mimetype,
        };
        packageData.featuredImage = {
          name: req.files["featuredImage"][0].originalname,
          size: req.files["featuredImage"][0].size,
          url: req.files["featuredImage"][0].path,
          type: req.files["featuredImage"][0].mimetype,
        };
      } else {
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${"image"}`
        );
      }

      const package_id = packageData.package_id;

      if (package_id) {
        // Update existing package if package_id is provided
        const updatedPackage = await PackageModel.findByIdAndUpdate(
          package_id,
          packageData,
          { new: true }
        );
        const { _id, ...user } = updatedPackage.toObject();
        return {
          message: MessageConstants.UPDATE,
          packageData: { package_id, ...user },
        };
      } else {
        // Create new package if no package_id is provided
        const newPackage = await PackageModel.create({
          ...packageData,
         
          mockTest_ids: mockTest_ids,
          numberOfAttempts: numberOfAttempts,
        });
        const { _id: package_id, ...user } = newPackage.toObject();
        return {
          message: MessageConstants.SUCCESS,
          packageData: { package_id, ...user },
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
  listAllPackages: async function (limitValue, offsetValue, searchTerm) {
    try {
      // Define the base query to filter non-deleted mock tests
      const baseQuery = { is_deleted: false };

      // Modify the base query to include the search term if provided
      if (searchTerm) {
        // Use a regex pattern to perform case-insensitive search on packageName field
        baseQuery.packageName = { $regex: searchTerm, $options: "i" };
      }

      // Fetch total count of mock tests based on the filtered query
      const totalCount = await PackageModel.countDocuments(baseQuery);

      // Fetch mock tests from the database with pagination and filtered by search criteria
      const data = await PackageModel.find(baseQuery)
        .skip(offsetValue * limitValue)
        .limit(limitValue);

      return { availableDataCount: totalCount, data: data };
    } catch (error) {
      // Return error response
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERRO
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
      const existingPackage = await PackageModel.findById(id);

      if (!existingPackage) {
        return Utils.errorResponse(MessageConstants.INVALID_ID);
      }

      // Update the is_active field
      existingPackage.is_active = is_active;

      // Save the updated mock test to the database
      await existingPackage.save();

      return {
        message: `Package ${
          is_active ? "activated" : "deactivated"
        } successfully`,
        package: existingPackage,
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
  deletePackage: async function (ids) {
    try {
      // Check if IDs array is provided and not empty
      if (!Array.isArray(ids) || ids.length === 0) {
        return Utils.errorResponse(MessageConstants.INVALID_ID);
      }

      const invalidIds = [];

      // Validate and mark mock tests as deleted using Promise.all
      await Promise.all(
        ids.map(async (id) => {
          const existingData = await PackageModel.findById(id);
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
        return Utils.errorResponse(
          `${MessageConstants.INVALID_ID}: ${invalidIds.join(", ")}`
        );
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
   * @param {string} packaeg_id - The ID of the topic to retrieve details for.
   * @returns {Object} An object containing a message and the details of the topic, or an error response.
   */
  getPackageDetailById: async function (packaeg_id) {
    try {
      // Validate input parameters
      const emptyParams = Utils.checkEmptyParams({
        name: "packaeg_id",
        value: packaeg_id,
      });
      if (emptyParams.length > 0) {
        // Return error response if any required parameter is missing
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
        );
      }

      // Retrieve topic details associated with the provided topic ID
      const result = await PackageModel.findById(packaeg_id);

      if (result) {
        // Return success message along with the topic details
        return { message: MessageConstants.SUCCESS, packageDetails: result };
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

module.exports = packageService;
