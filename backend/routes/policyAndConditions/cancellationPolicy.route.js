const express = require('express');
const router = express.Router();
const cancellationConditionController = require('../../controllers/policyAndConditions/cancellationCondition.controller');
const { adminTokenVerification } = require("../../middleware/tokenVerification");

/**
 * Route to add a new cancellation condition.
 * POST /cancellation-condition/add-cancellation-Condition
 * Requires admin token verification middleware.
 */
router.post('/add-cancellation-Condition', adminTokenVerification, cancellationConditionController.addCancellationCondition);

/**
 * Route to get all cancellation conditions.
 * GET /cancellation-condition/get-cancellation-Condition
 * Requires admin token verification middleware.
 */
router.get('/get-cancellation-Condition', adminTokenVerification, cancellationConditionController.getCancellationCondition);

module.exports = router;
