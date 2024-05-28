const studyMaterialService = require("../../services/studyMaterialServices/studyMaterial.service");
const Utils = require("../../utility/utils");

const studyMaterialController = {
  /**
   * Add or edit study material.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  addStudyMaterial: async function (req, res) {
    const { classId, subjectId, medium, study_material_id } = req.body;
    const result = await studyMaterialService.addStudyMaterial(
      classId,
      subjectId,
      medium,
      study_material_id
    );
    Utils.sendResponse(result, req, res);
  },

  /**
   * Controller function to list all study materials
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  listAllStudyMaterials: async function (req, res) {
    // Fetch all study materials from the database
    const { limit, offset, searchQuery,classSearchQuery, subjectSearchQuery } = req.query;
    const limitValue = parseInt(limit) || 10; // Default limit is set to 10
    const offsetValue = parseInt(offset) || 0; // Default offset is set to 0
    const result = await studyMaterialService.getAllStudyMaterials(
      limitValue,
      offsetValue,
      searchQuery || "",
      classSearchQuery || "",
      subjectSearchQuery || ""
    );
    Utils.sendResponse(result, req, res);
  },

  /**
   * Delete study material.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  deleteStudyMaterial: async function (req, res) {
    // const study_material_id = req.params.id;
    const { ids } = req.body;
    const result = await studyMaterialService.deleteStudyMaterial(ids);
    Utils.sendResponse(result, req, res);
  },

  /**
   * Delete module.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  deleteModule: async function (req, res) {
    const { ids } = req.body;
    const result = await studyMaterialService.deleteModule(ids);
    Utils.sendResponse(result, req, res);
  },

  /**
   * Delete topic.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  deleteTopic: async function (req, res) {
    const { ids } = req.body;
    const result = await studyMaterialService.deleteTopic(ids);
    Utils.sendResponse(result, req, res);
  },

  /**
   * Change the is_active status of a study material by its ID.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  changeStatus: async function (req, res) {
    // Extract the study material ID from the request parameters
    const { id, is_active } = req.body;

    // Call the service method to change the is_active status
    const result = await studyMaterialService.changeStatus(id, is_active);

    // Send the response
    Utils.sendResponse(result, req, res);
  },

  /**
   * Retrieve study material details by ID.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  getStudyMaterialDetailById: async function (req, res) {
    // Extract study material ID from the request body
    const { study_material_id } = req.body;

    // Call the service method to retrieve study material details by ID
    const studyMaterialDetail =
      await studyMaterialService.getStudyMaterialDetailById(study_material_id);

    // Send the response
    Utils.sendResponse(studyMaterialDetail, req, res);
  },

  //Module MATHOD

  /**
   * List all modules associated with a study material.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  listAllModule: async function (req, res) {
    const { study_material_id, searchQuery } = req.query;
    const result = await studyMaterialService.listAllModules(
      study_material_id,
      searchQuery
    );
    Utils.sendResponse(result, req, res);
  },

  /**
   * List all modules associated with a study material.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  listAllModuleBySubject: async function (req, res) {
    const { subject_id, medium } = req.query;
    const result = await studyMaterialService.listAllModuleBySubject(
      subject_id, 
      medium
    );
    Utils.sendResponse(result, req, res);
  },

  /**
   * Retrieve module details by module ID.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  getModuleDetailById: async function (req, res) {
    // Extract module ID from the request body
    const { module_id } = req.body;

    // Call the service method to retrieve module details by ID
    const result = await studyMaterialService.getModuleDetailById(module_id);

    // Send the response
    Utils.sendResponse(result, req, res);
  },

  /**
   * Add or edit a module associated with a study material.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  addAndEditModule: async function (req, res) {
    const { study_material_id, module_name, module_id } = req.body;
    const result = await studyMaterialService.addAndEditModules(
      module_name,
      study_material_id,
      module_id
    );
    Utils.sendResponse(result, req, res);
  },

  // TOPIC METHODS

  /**
   * Add or edit a topic.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  addAndEditTopic: async function (req, res) {
    try {
      // Calling the service method to add or edit the topic
      const result = await studyMaterialService.addAndEditTopics(req.body, req, res);
      // Sending the response
      Utils.sendResponse(result, req, res);
    } catch (error) {
      // Handling errors and sending error response
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Retrieve all topics associated with a study material.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  getAllTopics: async function (req, res) {
    // Extract study_material_id and module_id from the request body
    const { module_id } = req.query;

    // Call the service method to retrieve all topics
    const result = await studyMaterialService.getAllTopics(
      module_id
    );

    // Send the response
    Utils.sendResponse(result, req, res);
  },

  /**
   * Retrieve topic details by topic ID.
   * @param {Express.Request} req - The Express request object
   * @param {Express.Response} res - The Express response object
   */
  getTopicDetailById: async function (req, res) {
    // Extract topic ID from the request body
    const { topic_id } = req.body;

    // Call the service method to retrieve topic details by ID
    const result = await studyMaterialService.getTopicDetailById(topic_id);

    // Send the response
    Utils.sendResponse(result, req, res);
  },
};

module.exports = studyMaterialController;
