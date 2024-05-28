// File: routes/class.routes.js
const express = require("express");
const router = express.Router();
const classController = require("../../controllers/classMaster/class.controller");
const { adminTokenVerification } = require("../../middleware/tokenVerification");

// Route for creating a new class
router.post("/addclass", adminTokenVerification, classController.AddClass);

// Route for updating a class
router.put("/updateClass",adminTokenVerification, classController.updateClass);

// Route for activating a class
router.put("/updateClassStatus", adminTokenVerification, classController.updateClassStatus);

// Route for deleting a class
router.post("/deleteClass", adminTokenVerification, classController.deleteClass); // Define the delete route

// Route for getting all classes with optional limit and skip parameters
router.get("/all", adminTokenVerification, classController.getAllClasses);
router.get("/getAllClasses", adminTokenVerification, classController.getAllClassesWithoutPagination);

// Route to get active classes
router.get("/active-classes", adminTokenVerification, classController.getActiveClasses);
// Route to get a class by ID
router.get("/:id", adminTokenVerification, classController.getClassById);

module.exports = router;
