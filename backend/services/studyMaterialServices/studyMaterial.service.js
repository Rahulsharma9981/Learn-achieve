const HTTPStatus = require("http-status");
const StudyMaterialModel = require("../../models/studyMaterialModel/StudyMaterial.model");
const StudyMaterialModuleModel = require("../../models/studyMaterialModel/StudyMaterialModule.model");
const TopicModel = require("../../models/studyMaterialModel/Topic.model");
const Utils = require("../../utility/utils");
const MessageConstants = require("../../utility/MessageConstants");
const Subject = require("../../models/subject/Subject.model");
const Topic = require("../../models/studyMaterialModel/Topic.model");
const fs = require('fs');
const StudyMaterial = require("../../models/studyMaterialModel/StudyMaterial.model");
const mongoose = require('mongoose');

const studyMaterialService = {
  /**
   * Add or edit study material.
   * @param {string} classId - Class Id
   * @param {string} subjectId - Subject Id
   * @param {string} medium - Medium
   * @param {string} study_material_id - Study Material Id (Optional for editing)
   * @returns {Object} An object containing a message and the ID of the added/updated study material, or an error response.
   */
  addStudyMaterial: async function (
    classId,
    subjectId,
    medium,
    study_material_id
  ) {
    try {
      // Validate input parameters
      const emptyParams = Utils.checkEmptyParams(
        { name: "classId", value: classId },
        { name: "subjectId", value: subjectId },
        { name: "medium", value: medium }
      );

      const matchConditions = {
        classId: classId,
        subjectId: subjectId,
        medium: medium,
        is_deleted: false
      }

      if (study_material_id) {
        matchConditions._id = { $ne: study_material_id };
      }

      const existingData = await StudyMaterialModel.findOne(matchConditions);
      if (existingData) {
        return Utils.errorResponse(MessageConstants.STUDY_MATERIAL_ALREADY_EXISTS);
      }

      const classMismatch = await Subject.findOne({
        _id: subjectId,
        class_id: classId
      });

      if (!classMismatch) {
        return Utils.errorResponse("Cannot find the subject in given class");
      }

      if (emptyParams.length > 0) {
        // Return error response if any required parameter is missing
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
        );
      }

      if (study_material_id) {
        const data = await StudyMaterialModel.findByIdAndUpdate(
          study_material_id,
          {
            classId: classId,
            subjectId: subjectId,
            medium: medium,
          }
        );

        if (!data) {
          return Utils.errorResponse(MessageConstants.INVALID_ID);
        }

        return { message: MessageConstants.SUCCESS };
      }

      // Add Study Material
      const addStudyMaterial = await StudyMaterialModel.create({
        classId,
        subjectId,
        medium,
      });

      const { _id } = addStudyMaterial.toObject();
      return {
        message: MessageConstants.SUCCESS,
        study_material_id: _id,
      };
    } catch (error) {
      console.log(error);
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * Service function to retrieve all study materials with specified fields.
   * @returns {Promise<Object>} A promise resolving to an object containing a message indicating the success or failure of the operation, along with the list of study materials containing only the specified fields.
   */
  getAllStudyMaterials: async function (limitValue, offsetValue, searchQuery ,classSearchQuery, subjectSearchQuery) {
    try {
      // Define base match conditions for active and non-deleted classes and subjects
      const matchConditions = {
        "class.is_deleted": false,
        "class.is_active": true,
        "subject.is_deleted": false,
        "subject.is_active": true,
        is_deleted: false,
      };

            // Check if searchQuery is provided
            if (searchQuery) {
              // Case-insensitive regex pattern for searchQuery
              matchConditions.$or = [
                  { "subject.subject_name": { $regex: searchQuery, $options: "i" } }, // Search by subject_name
                  { medium: { $regex: searchQuery, $options: "i" } }, // Search by medium
                  { "class.class_name": { $regex: searchQuery, $options: "i" } }, // Search by class_name
              ];
          } else if(classSearchQuery || subjectSearchQuery){
              // Add search term conditions for class name and subject name if provided
              if (classSearchQuery || subjectSearchQuery) {
                  matchConditions.$and = []; // Use $and operator to ensure both conditions are met
                  if (classSearchQuery) {
                      matchConditions.$and.push({ "class.class_name": { $regex: classSearchQuery, $options: "i" } });
                  }
                  if (subjectSearchQuery) {
                      matchConditions.$and.push({ "subject.subject_name": { $regex: subjectSearchQuery, $options: "i" } });
                  }
              }
          }
  

      // Aggregate pipeline to count total matching subjects
      const totalCountAggregate = await StudyMaterialModel.aggregate([
        {
          $lookup: {
            from: "Classes",
            localField: "classId",
            foreignField: "_id",
            as: "class",
          },
        },
        {
          $lookup: {
            from: "Subjects",
            localField: "subjectId",
            foreignField: "_id",
            as: "subject",
          },
        },
        { $match: matchConditions },
        { $count: "totalCount" },
      ]).exec();

      const totalCount =
        totalCountAggregate.length > 0 ? totalCountAggregate[0].totalCount : 0;

      // Aggregate pipeline to fetch subjects with pagination and search conditions
      const subjectsAggregate = await StudyMaterialModel.aggregate([
        {
          $lookup: {
            from: "Classes",
            localField: "classId",
            foreignField: "_id",
            as: "class",
          },
        },
        {
          $lookup: {
            from: "Subjects",
            localField: "subjectId",
            foreignField: "_id",
            as: "subject",
          },
        },
        { $match: matchConditions },
        { $skip: offsetValue * limitValue },
        { $limit: limitValue },
      ]).exec();

      // Format the study material list according to the required fields
      const formattedStudyMaterial = subjectsAggregate.map((studyMaterial) => ({
        id: studyMaterial._id, // Assigning _id to study_material_id in the response
        subject_name: studyMaterial.subject[0].subject_name,
        subject_id: studyMaterial.subject[0]._id,
        class_id: studyMaterial.class[0]._id,
        class_name: studyMaterial.class[0].class_name,
        medium: studyMaterial.medium,
        is_deleted: studyMaterial.is_deleted,
        is_active: studyMaterial.is_active,
      }));

      // Return success message along with the list of study materials
      return {
        message: MessageConstants.SUCCESS,
        data: formattedStudyMaterial,
        availableDataCount: totalCount,
      };
    } catch (error) {
      // Return error response in case of any unexpected error
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * Retrieve study material details by ID.
   * @param {string} study_material_id - The ID of the study material to retrieve details for.
   * @returns {Object} An object containing a message indicating the success or failure of the operation, along with the study material details, or an error response.
   */
  getStudyMaterialDetailById: async function (study_material_id) {
    try {
      // Validate input parameters
      const emptyParams = Utils.checkEmptyParams({
        name: "study_material_id",
        value: study_material_id,
      });
      if (emptyParams.length > 0) {
        // Return error response if any required parameter is missing
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
        );
      }

      // Find study material by ID
      const studyMaterial = await StudyMaterialModel.findById(
        study_material_id
      );
      if (!studyMaterial) {
        // Return error message if study_material_id is invalid
        return { message: MessageConstants.INVALID_ID };
      }

      // Return success message along with study material details
      return {
        message: MessageConstants.SUCCESS,
        studyMaterialDetails: studyMaterial,
      };
    } catch (error) {
      // Return error response in case of any unexpected error
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * Delete study material(s) by ID(s).
   * @param {string} study_material_id - The ID of the study material to delete.
   * @param {Array<string>} arry_study_material_id - An array of study material IDs to delete.
   * @returns {Object} An object containing a message indicating the success or failure of the deletion operation.
   */
  deleteStudyMaterial: async function (ids) {
    try {
      // Check if IDs array is provided and not empty
      if (!Array.isArray(ids) || ids.length === 0) {
        return Utils.errorResponse(MessageConstants.INVALID_ID);
      }

      const invalidIds = [];

      // Validate and mark classes as deleted using Promise.all
      await Promise.all(
        ids.map(async (id) => {
          const existingData = await StudyMaterialModel.findById(id);
          if (!existingData) {
            invalidIds.push(id);
          } else {
            existingData.is_deleted = true;
            await existingData.save();
          }
        })
      );

      // Check if class exists
      if (invalidIds.length > 0) {
        return Utils.errorResponse(
          MessageConstants.INVALID_ID + ` ${invalidIds.join(",")}`
        );
      }

      return { message: MessageConstants.DELETE };
    } catch (error) {
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  deleteModule: async function (ids) {
    try {
      // Check if IDs array is provided and not empty
      if (!Array.isArray(ids) || ids.length === 0) {
        return Utils.errorResponse(MessageConstants.INVALID_ID);
      }

      const invalidIds = [];

      // Validate and mark classes as deleted using Promise.all
      await Promise.all(
        ids.map(async (id) => {
          const existingData = await StudyMaterialModuleModel.findById(id);
          if (!existingData) {
            invalidIds.push(id);
          } else {
            existingData.is_deleted = true;
            await existingData.save();
          }
        })
      );

      // Check if class exists
      if (invalidIds.length > 0) {
        return Utils.errorResponse(
          MessageConstants.INVALID_ID + ` ${invalidIds.join(",")}`
        );
      }

      return { message: MessageConstants.DELETE };
    } catch (error) {
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  deleteTopic: async function (ids) {
    try {
      // Check if IDs array is provided and not empty
      if (!Array.isArray(ids) || ids.length === 0) {
        return Utils.errorResponse(MessageConstants.INVALID_ID);
      }

      const invalidIds = [];

      // Validate and mark classes as deleted using Promise.all
      await Promise.all(
        ids.map(async (id) => {
          const existingData = await Topic.findById(id);
          if (!existingData) {
            invalidIds.push(id);
          } else {
            existingData.is_deleted = true;
            await existingData.save();
          }
        })
      );

      // Check if class exists
      if (invalidIds.length > 0) {
        return Utils.errorResponse(
          MessageConstants.INVALID_ID + ` ${invalidIds.join(",")}`
        );
      }

      return { message: MessageConstants.DELETE };
    } catch (error) {
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * Change the is_active status of a study material by its ID.
   * @param {string} id - The ID of the study material to change the status for.
   * @returns {Object} An object containing a message indicating the success or failure of the status change operation, along with the updated study material object.
   */
  changeStatus: async function (id, is_active) {
    try {
      // Find the study material by its ID
      const studyMaterial = await StudyMaterialModel.findById(id, {
        is_deleted: false,
      });

      // Check if study material exists
      if (!studyMaterial) {
        // Return error message if study_material_id is invalid
        return { message: MessageConstants.INVALID_ID };
      }

      // Toggle the is_active status
      studyMaterial.is_active = is_active;

      // Save the updated study material
      await studyMaterial.save();

      // Return success message along with the updated study material object
      return {
        message: MessageConstants.StatusChange,
        studyMaterial: studyMaterial,
      };
    } catch (error) {
      // Return error response in case of any unexpected error
      return Utils.errorResponse(
        "Internal server error",
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  // MODULE METHODS
  /**
   * Add or edit a module associated with a study material.
   * @param {string} module_name - Module name
   * @param {string} study_material_id - Study Material Id
   * @param {string} module_id - Module Id (Optional for editing)
   * @returns {Object} An object containing a message indicating success or failure of adding/editing module.
   */
  addAndEditModules: async function (
    module_name,
    study_material_id,
    module_id
  ) {
    try {
      // Validate input parameters
      const emptyParams = Utils.checkEmptyParams(
        { name: "study_material_id", value: study_material_id },
        { name: "module_name", value: module_name }
      );

      if (emptyParams.length > 0) {
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
        );
      }

      const matchConditions = {
        module_name: module_name,
        study_material_id: study_material_id,
        is_deleted: false
      }

      if (module_id) {
        matchConditions._id = { $ne: module_id };
      }

      const existingData = await StudyMaterialModuleModel.findOne(matchConditions);
      if (existingData) {
        return Utils.errorResponse(MessageConstants.MODULE_ALREADY_EXISTS);
      }

      // Add or Update Study Material Module
      if (module_id && module_id !== "") {
        // Check if module_id exists
        const checkId = await StudyMaterialModuleModel.findById(module_id);
        if (checkId) {
          // Update module details
          const updated_date = new Date();
          const updateStudyMaterialModule =
            await StudyMaterialModuleModel.findByIdAndUpdate(
              module_id,
              { module_name, study_material_id, updated_date },
              { new: true }
            );
          return { message: MessageConstants.UPDATE };
        } else {
          return Utils.errorResponse(MessageConstants.INVALID_ID);
        }
      } else {
        // Create new study material module
        const addStudyMaterialModule = await StudyMaterialModuleModel.create({
          module_name,
          study_material_id,
        });
        return { message: MessageConstants.SUCCESS };
      }
    } catch (error) {
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * Retrieve module details by module ID.
   * @param {string} module_id - The ID of the module to retrieve details for.
   * @returns {Object} An object containing a message and the details of the module, or an error response.
   */
  getModuleDetailById: async function (module_id) {
    try {
      // Validate input parameters
      const emptyParams = Utils.checkEmptyParams({
        name: "module_id",
        value: module_id,
      });
      if (emptyParams.length > 0) {
        // Return error response if any required parameter is missing
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
        );
      }

      // Retrieve module details associated with the provided module ID
      const result = await StudyMaterialModuleModel.findById(module_id);

      if (result) {
        // Return success message along with the module details
        return { message: MessageConstants.SUCCESS, moduleDetails: result };
      } else {
        // Return error response if no module found with the provided ID
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

  /**
   * List all modules associated with a specific study material.
   * @param {string} study_material_id - The ID of the study material for which modules are listed.
   * @returns {Object} An object containing a message and the list of modules, or an error response.
   */
  listAllModules: async function (study_material_id, searchQuery) {
    try {
      // Validate input parameters
      const emptyParams = Utils.checkEmptyParams({
        name: "study_material_id",
        value: study_material_id,
      });

      if (emptyParams.length > 0) {
        // Return error response if any required parameter is missing
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
        );
      }

      const baseQuery = {
        study_material_id: study_material_id,
        is_deleted: false, // Ensure the module is not marked as deleted
      };

      // Modify the base query to include the search term if provided
      if (searchQuery) {
        // Use a regex pattern to perform case-insensitive search on class_name field
        baseQuery.module_name = { $regex: searchQuery, $options: "i" };
      }

      // Retrieve all modules associated with the provided study material ID
      const result = await StudyMaterialModuleModel.find(baseQuery, {
        module_name: 1,
        _id: 1,
      });

      const formattedTopics = result.map((module) => ({
        module_id: module._id, // Assigning _id to module_id in the response
        module_name: module.module_name,
      }));
      // Return success message along with the list of modules
      return { message: MessageConstants.SUCCESS, moduleList: formattedTopics };
    } catch (error) {
      // Return error response in case of any unexpected error
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * List all modules associated with a specific study material.
   * @param {string} subject_id - The ID of the study material for which modules are listed.
   * @returns {Object} An object containing a message and the list of modules, or an error response.
   */
  listAllModuleBySubject: async function (subject_id, medium) {
    try {
      // Validate input parameters
      const emptyParams = Utils.checkEmptyParams(
        { name: "subject_id", value: subject_id },
        { name: "medium", value: medium }
      );

      if (emptyParams.length > 0) {
        // Return error response if any required parameter is missing
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
        );
      }

      StudyMaterial
      // Aggregate pipeline to fetch subjects with pagination and search conditions
      const subjectsAggregate = await StudyMaterialModuleModel.aggregate([
        {
          $lookup: {
            from: "StudyMaterials",
            localField: "study_material_id",
            foreignField: "_id",
            as: "studyMaterial",
          },
        },
        {
          $match: {
            "studyMaterial.subjectId": new mongoose.Types.ObjectId(subject_id),
            "studyMaterial.medium": medium,
            "studyMaterial.is_deleted": false,
            "studyMaterial.is_active": true,
            is_deleted: false
          }
        }
      ]).exec();

      const data = subjectsAggregate.map((module) => ({
        module_id: module._id,
        module_name: module.module_name
      }));

      // Return success message along with the list of modules
      return { message: MessageConstants.SUCCESS, moduleList: data };
    } catch (error) {
      console.log(error);
      // Return error response in case of any unexpected error
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  // TOPIC METHODS

  /**
   * Add or edit a topic.
   * @param {Object} topicData - Object containing topic data
   * @returns {Object} Result of the operation
   */
  addAndEditTopics: async function (topicData, req, res) {
    try {
      // Extract topic ID
      var topic_id = topicData.topic_id;

      // Add or Update Study Material Topic
      if (topic_id && topic_id !== "") {
        // Validate input parameters
        const emptyParams = Utils.checkEmptyParams(
          { name: "topic_name", value: topicData.topic_name },
          { name: "details", value: topicData.details }
        );

        if (emptyParams.length > 0) {
          this.removeUnnecessaryFiles(req.files);
          return Utils.errorResponse(
            `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
          );
        }

        // Check if topic_id exists
        const checkId = await TopicModel.findById(topic_id);
        if (checkId) {
          // Update topic details
          const date = new Date();
          let updated_date = date;
          let topic_name = topicData.topic_name;
          let details = topicData.details;
          let links = topicData.youtube_links.split(',');
          let youtube_links = [...links].filter((e) => e.trim() != "");

          var filesData = [];
          req.files?.map((file) => filesData.push({
            name: file.originalname,
            size: file.size,
            url: file.path
          }))

          var oldFiles = JSON.parse(topicData.oldFiles);
          var filesToRemove = checkId.files.filter((file) => oldFiles.findIndex((e) => e.url === file.url) === -1)
          if (filesToRemove && filesToRemove.length > 0) {
            filesToRemove.map((file) => {
              fs.unlink(file.url, (err) => {
                if (err) console.log(err);
              });
            })
          }

          var files = [...filesData, ...oldFiles];
          const existingData = await TopicModel.findOne({
            topic_name: topicData.topic_name,
            module_id: topicData.module_id,
            study_material_id: topicData.study_material_id,
            _id: { $ne: topic_id },
            is_deleted: false
          });

          if (existingData) {
            this.removeUnnecessaryFiles(req.files);
            return Utils.errorResponse(MessageConstants.TOPIC_ALREADY_EXISTS);
          }

          await TopicModel.findByIdAndUpdate(
            topic_id,
            { topic_name, details, files, youtube_links, updated_date }
          );

          return { message: MessageConstants.UPDATE };
        } else {
          this.removeUnnecessaryFiles(req.files);
          return Utils.errorResponse(MessageConstants.INVALID_ID);
        }
      } else {
        // Validate input parameters
        const emptyParams = Utils.checkEmptyParams(
          { name: "topic_name", value: topicData.topic_name },
          { name: "module_id", value: topicData.module_id },
          { name: "study_material_id", value: topicData.study_material_id },
          { name: "details", value: topicData.details },
        );

        if (emptyParams.length > 0) {
          removeUnnecessaryFiles(req.files);
          return Utils.errorResponse(
            `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
          );
        }

        const existingData = await TopicModel.findOne({
          topic_name: topicData.topic_name,
          module_id: topicData.module_id,
          study_material_id: topicData.study_material_id,
          is_deleted: false
        });

        if (existingData) {
          this.removeUnnecessaryFiles(req.files);
          return Utils.errorResponse(MessageConstants.TOPIC_ALREADY_EXISTS);
        }

        var filesData = [];
        req.files.map((file) => filesData.push({
          name: file.originalname,
          size: file.size,
          url: file.path
        }))

        topicData.files = filesData;

        let links = topicData.youtube_links.split(',');
        topicData.youtube_links = [...links].filter((e) => e.trim() != "");

        // Create new study material Topic
        const topic = await TopicModel.create(topicData);
        return { message: "Topic added successfully" };
      }
    } catch (error) {
      console.log(error);
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  removeUnnecessaryFiles: function (files) {
    files.map((file) => {
      fs.unlink(file.path, (err) => {
        if (err) console.log(err);
      });
    })
  },

  /**
   * Retrieve all topics associated with a specific study material and module.
   * @param {string} module_id - The ID of the module for which topics are listed.
   * @returns {Object} An object containing a message and the list of topics, or an error response.
   */
  getAllTopics: async function (module_id) {
    try {
      // Validate input parameters
      const emptyParams = Utils.checkEmptyParams(
        { name: "module_id", value: module_id }
      );
      if (emptyParams.length > 0) {
        // Return error response if any required parameter is missing
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
        );
      }

      // Retrieve all topics associated with the provided study material ID and module ID
      const result = await TopicModel.find(
        {
          module_id: module_id,
          is_deleted: false, // Ensure the topic is not marked as deleted
        }
      );

      const formattedTopics = result.map((topic) => ({
        topic_id: topic._id, // Assigning _id to module_id in the response
        topic_name: topic.topic_name,
        details: topic.details,
        youtube_links: topic.youtube_links || [],
        uploaded_files: topic.files || []
      }));

      // Return success message along with the list of topics
      return { message: MessageConstants.SUCCESS, topicList: formattedTopics };
    } catch (error) {
      // Return error response in case of any unexpected error
      return Utils.errorResponse(
        MessageConstants.INTERNAL_SERVER_ERROR,
        HTTPStatus.INTERNAL_SERVER_ERROR
      );
    }
  },

  /**
   * Retrieve topic details by topic ID.
   * @param {string} topic_id - The ID of the topic to retrieve details for.
   * @returns {Object} An object containing a message and the details of the topic, or an error response.
   */
  getTopicDetailById: async function (topic_id) {
    try {
      // Validate input parameters
      const emptyParams = Utils.checkEmptyParams({
        name: "topic_id",
        value: topic_id,
      });
      if (emptyParams.length > 0) {
        // Return error response if any required parameter is missing
        return Utils.errorResponse(
          `${MessageConstants.MISSING_PARAMETERS}: ${emptyParams.join(", ")}`
        );
      }

      // Retrieve topic details associated with the provided topic ID
      const result = await TopicModel.findById(topic_id);

      if (result) {
        // Return success message along with the topic details
        return { message: MessageConstants.SUCCESS, topicDetails: result };
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

module.exports = studyMaterialService;
