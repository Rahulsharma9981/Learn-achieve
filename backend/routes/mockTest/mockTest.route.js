const express = require('express');
const router = express.Router();
const mockTestController = require('../../controllers/mockTest/mockTest.controller');
const { adminTokenVerification } = require("../../middleware/tokenVerification");

/**
 * Route to create a new mock test.
 * POST /mock-test/create-mock-test
 */
router.post('/create-mock-test', adminTokenVerification, mockTestController.createMockTest);

/**
 * Route to list all mock tests.
 * GET /mock-test/list-all-mock-test
 */
router.get('/list-all-mock-test', adminTokenVerification, mockTestController.listAllMockTests);

/**
 * Route to retrieve all mock test without pagination.
 * GET /mock-test/get-all-mock-test
 */
router.get("/get-all-mock-test", adminTokenVerification, mockTestController.getAllMockTestWithoutPagination);

/**
 * Route to change the status of a mock test.
 * PUT /mock-test/change-status
 */
router.put("/change-status", adminTokenVerification, mockTestController.changeStatus);

/**
 * Route to delete a mock test.
 * POST /mock-test/delete-mock-test
 */
router.post("/delete-mock-test", adminTokenVerification, mockTestController.deleteMockTest);

// Route for getting topic details by ID, with admin token verification middleware
router.get( "/getMockTestDetailById", adminTokenVerification, mockTestController.getMockTestDetailById );

module.exports = router;
