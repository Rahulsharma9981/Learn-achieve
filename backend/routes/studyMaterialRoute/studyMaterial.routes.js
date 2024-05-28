// File: routes/studyMaterialRoute/studyMaterial.routes.js

const express = require("express");
const router = express.Router();
const studyMaterialController = require("../../controllers/studyMaterialController/studyMaterial.controller");
const {
  adminTokenVerification,
} = require("../../middleware/tokenVerification");
const multer = require("multer");
var path = require('path')

// Route for adding or editing study material using classId, subjectId, medium, and study_material_id (update data)
router.post(
  "/add-study-material",
  adminTokenVerification,
  studyMaterialController.addStudyMaterial
);

// Route to list all study materials
router.get(
  "/list-all-study-material",
  adminTokenVerification,
  studyMaterialController.listAllStudyMaterials
);

// Route for deleting study material using id
router.post(
  "/delete-study-material",
  adminTokenVerification,
  studyMaterialController.deleteStudyMaterial
);

// Route for deleting module using id
router.post(
  "/delete-module",
  adminTokenVerification,
  studyMaterialController.deleteModule
);

// Route for deleting topic using id
router.post(
  "/delete-topic",
  adminTokenVerification,
  studyMaterialController.deleteTopic
);

// Route to change the is_active status
router.put(
  "/change-status",
  adminTokenVerification,
  studyMaterialController.changeStatus
);

// Route for getting study material details by ID, with admin token verification middleware
router.get(
  "/getStudyMaterialDetailById",
  adminTokenVerification,
  studyMaterialController.getStudyMaterialDetailById
);

// Module Routes

// Route for adding or editing a module using study_material_id and updating data (module_id)
router.post(
  "/add-edit-module",
  adminTokenVerification,
  studyMaterialController.addAndEditModule
);

// Route for getting module details by ID, with admin token verification middleware
router.get(
  "/getModuleDetailById",
  adminTokenVerification,
  studyMaterialController.getModuleDetailById
);

// Route for listing all modules associated with a study material
router.get(
  "/list-all-module",
  adminTokenVerification,
  studyMaterialController.listAllModule
);

// Route for listing all modules associated with a study material
router.get(
  "/list-all-module-by-subject",
  adminTokenVerification,
  studyMaterialController.listAllModuleBySubject
);

// Topic Routes

// Route for adding a new topic
// Multer configuration for handling multiple files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/studyMaterial/files'); // Files will be uploaded to the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    cb(null,  Date.now().toString() + path.extname(file.originalname)); // Use the original file name as the stored file name
  }
});

const upload = multer({ storage: storage }).array('files');
router.post(
  "/add-edit-topic",
  adminTokenVerification,
  upload,
  studyMaterialController.addAndEditTopic
);

// Route for getting topic details by ID, with admin token verification middleware
router.get(
  "/getTopicDetailById",
  adminTokenVerification,
  studyMaterialController.getTopicDetailById
);

// Route for listing all topics
router.get(
  "/list-all-topics",
  adminTokenVerification,
  studyMaterialController.getAllTopics
);

module.exports = router;
