const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user/usre.controller');
const { adminTokenVerification } = require("../../middleware/tokenVerification");

/**
 * Route to list all mock tests.
 * GET /user/list-all-user
 */
router.get('/list-all-user', adminTokenVerification, userController.listAllUsers);

/**
 * Route to delete a mock test.
 * POST /user/delete-user
 */
router.post("/delete-user", adminTokenVerification, userController.deleteUser);

// Route for getting topic details by ID, with admin token verification middleware
router.get("/getUserDetailById", adminTokenVerification, userController.getUserDetailById);

module.exports = router;
