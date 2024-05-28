const SubjectService = require("../../services/subjectMasterServices/Subject.service");
const Utils = require("../../utility/utils");
const MessageConstants = require("../../utility/MessageConstants");
const HTTPStatus = require("http-status");

const subjectMasterController = {
  /**
   * Add a new subject to the database.
   * @param {Object} req - The Express request object containing subject details in the body.
   * @param {Object} res - The Express response object used to send the response.
   * @returns {void} This function sends a response using the provided response object.
   */
  addSubject: async function (req, res) {
    const { subject_name, class_id } = req.body;
    const result = await SubjectService.addSubject(subject_name, class_id);
    Utils.sendResponse(result, req, res);
  },

  getAllSubjects: async function (req, res) {
    const { limit, offset, searchQuery } = req.query;
    const limitValue = parseInt(limit) || 10; // Default limit is set to 10
    const offsetValue = parseInt(offset) || 0; // Default offset is set to 0
    const result = await SubjectService.getAllSubjects(limitValue, offsetValue, searchQuery || "");
    Utils.sendResponse(result, req, res);
  },

  getAllSubjectsWithoutPagination: async function (req, res) {
    const {class_id} = req.query;
    const result = await SubjectService.getAllSubjectsWithoutPagination(class_id);
    Utils.sendResponse(result, req, res);
  },

  /**
   * Delete a subject by its ID.
   * @param {Object} req - The Express request object containing the subject ID in params.
   * @param {Object} res - The Express response object used to send the response.
   * @returns {void} This function sends a response using the provided response object.
   */
  deleteSubject: async function (req, res) {
    const { ids } = req.body;
    const result = await SubjectService.deleteSubject(ids);
    Utils.sendResponse(result, req, res);
  },

  /**
   * Update a subject's details by its ID.
   * @param {Object} req - The Express request object containing the subject ID in params and updated details in body.
   * @param {Object} res - The Express response object used to send the response.
   * @returns {void} This function sends a response using the provided response object.
   */
  updateSubject: async function (req, res) {
    const { id, class_id, subject_name } = req.body;
    const result = await SubjectService.updateSubject(id, class_id, subject_name);
    Utils.sendResponse(result, req, res);
  },

  /**
   * Manage the status of a subject (activate or deactivate) by its ID.
   * @param {Object} req - The Express request object containing the subject ID in params and the new status in body.
   * @param {Object} res - The Express response object used to send the response.
   * @returns {void} This function sends a response using the provided response object.
   */

  updateSubjectStatus: async function (req, res) {
    const { id, is_active } = req.body;
    const result = await SubjectService.updateSubjectStatus(id, is_active);
    Utils.sendResponse(result, req, res);
  },
};

module.exports = subjectMasterController;
