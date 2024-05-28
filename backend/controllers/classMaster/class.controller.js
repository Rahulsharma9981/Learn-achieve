// File: controllers/class.controller.js

const Class = require("../../models/class/Class.model");
const ClassService = require("../../services/classMasterServices/class.service");
const Utils = require("../../utility/utils");
const httpStatus = require("http-status");
const MessageConstants = require("../../utility/MessageConstants");

const classController = {
  /**
   * Retrieves a list of classes with pagination support.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  getAllClasses: async function (req, res) {
    const { limit, offset, searchQuery } = req.query;
    const limitValue = parseInt(limit) || 10; // Default limit is set to 10
    const offsetValue = parseInt(offset) || 0; // Default offset is set to 0
    const result = await ClassService.getAllClasses(limitValue, offsetValue, searchQuery || "");
    Utils.sendResponse(result, req, res);
  },

  /**
   * Retrieves a list of classes with pagination support.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  getAllClassesWithoutPagination: async function (req, res) {
    const result = await ClassService.getAllClassesWithoutPagination();
    Utils.sendResponse(result, req, res);
  },

  /**
   * Deletes a class by ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  deleteClass: async function (req, res) {
    const { id } = req.body;
    const result = await ClassService.deleteClass(id);
    Utils.sendResponse(result, req, res);
  },

  /**
   * Update a class by its ID.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   * @returns {void}
   */
  updateClass: async function (req, res) {
    try {
      const { id, class_name, class_end_date } = req.body;

      const result = await ClassService.updateClass(
        id,
        class_name,
        class_end_date
      );
      Utils.sendResponse(result, req, res);
    } catch (error) {
      Utils.sendResponse( Utils.errorResponse(MessageConstants.INTERNAL_SERVER_ERROR),req,res);
    }
  },

  /**
   * Create a new class.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   * @returns {void}
   */
  AddClass: async function (req, res) {
    try {
      const { class_name, class_end_date } = req.body;

      const result = await ClassService.createClass(class_name, class_end_date);
      // Utils.sendResponse(result, req, res);
      if (result.error) {
        Utils.sendResponse(result, req, res);
      } else {
        Utils.sendResponse({ message: result.message }, req, res);
      }
    } catch (error) {
      console.error("Error creating class:", error);
      // Send error response
      Utils.sendResponse(
        { error: MessageConstants.INTERNAL_SERVER_ERROR },
        req,
        res
      );
    }
  },

  /**
   * Deactivates a class by setting its isActive field to false.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Object} A response object indicating success or failure.
   */
  updateClassStatus: async function (req, res) {
    try {
      const { id, isActive } = req.body;

      // Check if ID is provided
      if (!id) {
        return Utils.errorResponse(
          MessageConstants.CLASS_ID_REQUIRED,
          httpStatus.BAD_REQUEST
        );
      }

      // Find the class by ID
      let existingClass = await Class.findById({ _id: id });

      // Check if class exists
      if (!existingClass) {
        return Utils.errorResponse(
          MessageConstants.CLASS_NOT_FOUND,
          httpStatus.NOT_FOUND
        );
      }

      // Update isActive field to false
      existingClass.is_active = isActive;

      // Save the updated class to the database
      await existingClass.save();

      // Send success response
      Utils.sendResponse(
        {
          message: MessageConstants.CLASS_DEACTIVATED_SUCCESSFULLY,
          updatedClass: existingClass,
        },
        req,
        res
      );
    } catch (error) {
      console.error("Error deactivating class:", error);
      // Send error response
      Utils.sendResponse(
        Utils.errorResponse(MessageConstants.INTERNAL_SERVER_ERROR),
        req,
        res
      );
    }
  },

  getActiveClasses: async function (req, res) {
    try {
      // Fetch active classes using the service
      const activeClasses = await ClassService.getActiveClasses();

      // Send success response with the retrieved active classes
      Utils.sendResponse({ activeClasses }, req, res);
    } catch (error) {
      console.error("Error fetching active classes:", error);
      // Send error response
      Utils.sendResponse(
        Utils.errorResponse(MessageConstants.INTERNAL_SERVER_ERROR),
        req,
        res
      );
    }
  },
  
  getClassById: async function (req, res) {
    try {
      const { id } = req.params;

      // Check if ID is provided
      if (!id) {
        return Utils.sendResponse(
          Utils.errorResponse(
            MessageConstants.CLASS_ID_REQUIRED,
            httpStatus.BAD_REQUEST
          ),
          req,
          res
        );
      }

      // Retrieve class by ID using the service
      const result = await ClassService.getClassById(id);

      // Send response
      Utils.sendResponse(result, req, res);
    } catch (error) {
      console.error("Error fetching class by ID:", error);
      // Send error response
      Utils.sendResponse(
        Utils.errorResponse(MessageConstants.INTERNAL_SERVER_ERROR),
        req,
        res
      );
    }
  },
};

module.exports = classController;
