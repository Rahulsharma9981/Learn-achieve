const express = require("express");
const subjectMasterController = require("../../controllers/subjectMaster/subjectMaster.controller");
const { adminTokenVerification } = require("../../middleware/tokenVerification");

const router = express.Router();
// create  subject
router.post("/addSubject", adminTokenVerification, subjectMasterController.addSubject);

// Get All Subject
router.get("/all", adminTokenVerification, subjectMasterController.getAllSubjects);
router.get("/getAllSubjects", adminTokenVerification, subjectMasterController.getAllSubjectsWithoutPagination);

// Delete a subject by ID
router.post("/deleteSubject", adminTokenVerification, subjectMasterController.deleteSubject);

// Update a subject by its ID
router.put("/updateSubject", adminTokenVerification, subjectMasterController.updateSubject);

// PUT route to manage subject status
router.put("/updateSubjectStatus", adminTokenVerification, subjectMasterController.updateSubjectStatus);

module.exports = router;
