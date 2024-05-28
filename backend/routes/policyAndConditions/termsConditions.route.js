const express = require('express');
const router = express.Router();
const termsConditionController = require('../../controllers/policyAndConditions/termsCondition.controller');
const { adminTokenVerification } = require("../../middleware/tokenVerification");

/**
 * Route to add a new terms and conditions.
 * POST /terms-condition/add-terms-condition
 * Requires admin token verification middleware.
 */
router.post('/add-terms-condition', adminTokenVerification, termsConditionController.addTermsCondition);

/**
 * Route to get the terms and conditions.
 * GET /terms-condition/get-terms-condition
 * Requires admin token verification middleware.
 */
router.get('/get-terms-condition', adminTokenVerification, termsConditionController.getTermsCondition);

module.exports = router;
