const questionService = require('../../services/questionBankServices/question.service');
const Utils = require('../../utility/utils');

const questionController = {
  /**
    * Add or edit a module associated with a study material.
    * @param {Express.Request} req - The Express request object
    * @param {Express.Response} res - The Express response object
    */
  addQuestion: async function (req, res) {
    const result = await questionService.addQuestion(req.body);
    Utils.sendResponse(result, req, res);
  },

  getBulkUploadHistory: async function (req, res) {
    const { limit, offset, searchQuery } = req.query;
    const limitValue = parseInt(limit) || 10; // Default limit is set to 10
    const offsetValue = parseInt(offset) || 0; // Default offset is set to 0
    const result = await questionService.getBulkUploadHistory(limitValue, offsetValue, searchQuery || "");
    Utils.sendResponse(result, req, res);
  },

  bulkUploadQuestions: async function (req, res) {
    const result = await questionService.bulkUploadQuestions(req, res);
    if (result)
      Utils.sendResponse(result, req, res);
  },

  /**
  * Controller function to list all study materials
  * @param {Express.Request} req - The Express request object
  * @param {Express.Response} res - The Express response object
  */
  allQuestionList: async function (req, res) {
    // Fetch all study materials from the database
    const { limit, offset, searchQuery } = req.query;
    const limitValue = parseInt(limit) || 10; // Default limit is set to 10
    const offsetValue = parseInt(offset) || 0; // Default offset is set to 0
    const result = await questionService.allQuestionList(limitValue, offsetValue, searchQuery || "");
    // Send the study materials as response
    Utils.sendResponse(result, req, res);
  },

  /**
   * Delete a subject by its ID.
   * @param {Object} req - The Express request object containing the subject ID in params.
   * @param {Object} res - The Express response object used to send the response.
   * @returns {void} This function sends a response using the provided response object.
   */
  deleteQuestion: async function (req, res) {
    const { ids } = req.body;
    const result = await questionService.deleteQuestion(ids);
    Utils.sendResponse(result, req, res);
  },

  /**
   * Manage the status of a subject (activate or deactivate) by its ID.
   * @param {Object} req - The Express request object containing the subject ID in params and the new status in body.
   * @param {Object} res - The Express response object used to send the response.
   * @returns {void} This function sends a response using the provided response object.
   */

  updateQuestionStatus: async function (req, res) {
    const { id, is_active } = req.body;
    const result = await questionService.updateQuestionStatus(id, is_active);
    Utils.sendResponse(result, req, res);
  },


  /**
    * Add or edit a module associated with a study material.
    * @param {Express.Request} req - The Express request object
    * @param {Express.Response} res - The Express response object
    */
  addSubQuestion: async function (req, res) {
    const result = await questionService.addSubQuestion(req.body);
    Utils.sendResponse(result, req, res);
  },

  /**
   * Delete topic.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  deleteSubQuestion: async function (req, res) {
    const { ids } = req.body;
    const result = await questionService.deleteSubQuestion(ids);
    Utils.sendResponse(result, req, res);
  },

  /**
   * Retrieve all sub question associated with a study material.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  getAllSubQuestion: async function (req, res) {
    // Extract study_material_id and module_id from the request body
    const { question_id } = req.query;
    // Call the service method to retrieve all topics
    const result = await questionService.getAllSubQuestion( question_id );
    // Send the response
    Utils.sendResponse(result, req, res);
  },

};

module.exports = questionController;
