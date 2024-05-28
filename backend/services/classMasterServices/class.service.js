const Class = require("../../models/class/Class.model");
const Utils = require("../../utility/utils");
const MessageConstants = require("../../utility/MessageConstants");
const httpStatus = require("http-status");
const ClassService = {
  /**
   * Creates a new class with the provided name and end date.
   * @param {string} class_name - The name of the class to be created.
   * @param {Date} class_end_date - The end date of the class.
   * @returns {Object} An object containing the message and the newly created class, or an error response.
   */
  createClass: async function (class_name, class_end_date) {
    try {
      // Check if class name is provided
      if (!class_name) {
        return Utils.errorResponse(
          MessageConstants.CLASS_NAME_REQUIRED,
          httpStatus.BAD_REQUEST
        );
      }

      // Check if a class with the same name already exists
      const existingClass = await Class.findOne({
        class_name: class_name,
        is_deleted: false,
      });

      // If a class with the same name already exists, return an error response
      if (existingClass) {
        return Utils.errorResponse(
          MessageConstants.CLASS_NAME_DUPLICATE,
          httpStatus.CONFLICT
        );
      }

      // Create new class instance
      const newClass = await Class.create({
        class_name: class_name,
        class_end_date: class_end_date,
      });

      return {
        message: MessageConstants.CLASS_CREATED_SUCCESSFULLY,
        newClass: newClass,
      };
    } catch (error) {
      console.error("Error creating class:", error);
      // Return error response
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
 * Deletes classes with the provided IDs by marking them as deleted.
 * @param {Array<string>} ids - The IDs of the classes to be deleted.
 * @returns {Object} An object containing the message and the deleted classes, or an error response.
 */
  deleteClass: async function (ids) {
    try {
      // Check if IDs array is provided and not empty
      if (!Array.isArray(ids) || ids.length === 0) {
        return Utils.errorResponse(MessageConstants.INVALID_ID);
      }

      const invalidIds = [];

      // Validate and mark classes as deleted using Promise.all
      await Promise.all(
        ids.map(async (id) => {
          const existingData = await Class.findById(id);
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
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  },


  /**
   * Updates the class with the provided ID by modifying its properties.
   * @param {string} id - The ID of the class to be updated.
   * @param {string} class_name - The updated name of the class.
   * @param {Date} class_end_date - The updated end date of the class.
   * @returns {Object} An object containing the message and the updated class, or an error response.
   */
  updateClass: async function (id, class_name, class_end_date) {
    try {
      // Find the study material by its ID
      const classData = await Class.findById({
        _id: id,
        is_deleted: false
      });

      // Check if study material exists
      if (!classData) {
        // Return error message if study_material_id is invalid
        return { message: MessageConstants.INVALID_ID };
      }

      // Check if a class with the same name already exists
      const existingClass = await Class.findOne({
        class_name: class_name,
        _id: { $ne: id },
        is_deleted: false
      });

      // If a class with the same name already exists, return an error response
      if (existingClass) {
        return Utils.errorResponse(
          MessageConstants.CLASS_NAME_DUPLICATE,
          httpStatus.CONFLICT
        );
      }

      // Save the updated study material
      await Class.findByIdAndUpdate(
        id,
        {
          class_name: class_name,
          class_end_date: class_end_date
        },
        { new: true }
      );

      // Return success message along with the updated study material object
      return {
        message: MessageConstants.UPDATE_SUCCESS,
        data: classData,
      };
    } catch (error) {
      // Return error response
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * Fetches classes from the database with the specified limit and skip values,
   * excluding the ones that are marked as deleted.
   * @param {number} limitValue - The limit for the number of classes to fetch.
   * @param {number} offsetValue - The number of classes to skip.
   * @returns {Object} An object containing the fetched classes, or an error response.
   */
  getAllClasses: async function (limitValue, offsetValue, searchTerm) {
    try {
      // Define the base query to filter non-deleted classes
      const baseQuery = { is_deleted: false };

      // Modify the base query to include the search term if provided
      if (searchTerm) {
        // Use a regex pattern to perform case-insensitive search on class_name field
        baseQuery.class_name = { $regex: searchTerm, $options: 'i' };
      }

      // Fetch total count of classes based on the filtered query
      const totalCount = await Class.countDocuments(baseQuery);

      // Fetch classes from the database with pagination and filtered by search criteria
      const data = await Class.find(baseQuery)
        .skip(offsetValue * limitValue)
        .limit(limitValue);

      return { availableDataCount: totalCount, data: data };
    } catch (error) {
      // Return error response
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
  * Fetches classes from the database with the specified limit and skip values,
  * excluding the ones that are marked as deleted.
  * @returns {Object} An object containing the fetched classes, or an error response.
  */
  getAllClassesWithoutPagination: async function () {
    try {
      // Fetch classes from the database with the specified limit, skip, and not deleted
      const data = await Class.find({ is_deleted: false, is_active: true });
      return { message: MessageConstants.SUCCESS, data: data };
    } catch (error) {
      console.error("Error fetching classes:", error);
      // Return error response
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * Toggles the active status of a class based on the provided isActive parameter.
   * @param {string} id - The ID of the class to update.
   * @param {boolean} isActive - The new active status for the class.
   * @returns {Object} An object containing the updated class and a message, or an error response.
   */
  activeClassStatus: async function (id, isActive) {
    try {
      // Find the class by ID
      let existingClass = await Class.findById(id);

      // Check if class exists
      if (!existingClass) {
        return Utils.errorResponse("Class not found", httpStatus.NOT_FOUND);
      }

      // Update isActive field based on the provided parameter
      existingClass.is_active = isActive;

      // Save the updated class to the database
      await existingClass.save();

      // Return success response
      return {
        message: `Class ${isActive ? "activated" : "deactivated"} successfully`,
        updatedClass: existingClass,
      };
    } catch (error) {
      console.error(`Error toggling class status: ${error}`);
      // Return error response
      return Utils.errorResponse("Internal server error");
    }
  },

  getActiveClasses: async function () {
    try {
      // Fetch active classes from the database
      const activeClasses = await Class.find({
        is_active: true,
        is_deleted: false,
      });
      return activeClasses;
    } catch (error) {
      console.error("Error fetching active classes:", error);
      throw new Error("Internal server error");
    }
  },
  getClassById: async function (id) {
    try {
      // Find the class by ID
      const foundClass = await Class.findById(id);

      // Check if class exists
      if (!foundClass) {
        return Utils.errorResponse(
          MessageConstants.CLASS_NOT_FOUND,
          httpStatus.NOT_FOUND
        );
      }

      // Return the retrieved class
      return { class: foundClass };
    } catch (error) {
      console.error("Error fetching class by ID:", error);
      // Return error response
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  },
};

module.exports = ClassService;
