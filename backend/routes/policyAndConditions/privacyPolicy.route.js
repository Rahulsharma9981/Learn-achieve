const express = require('express');
const router = express.Router();
const privacyPolicyController = require('../../controllers/policyAndConditions/privacyPolicy.controller');
const { adminTokenVerification } = require("../../middleware/tokenVerification");

/**
 * Route to add a new privacy policy.
 * POST /privacy-policy/add-privacy-policy
 * Requires admin token verification middleware.
 */
router.post('/add-privacy-policy', adminTokenVerification, privacyPolicyController.addPrivacyPolicy);

/**
 * Route to get the privacy policy.
 * GET /privacy-policy/get-privacy-policy
 * Requires admin token verification middleware.
 */
router.get('/get-privacy-policy', adminTokenVerification, privacyPolicyController.getPrivacyPolicy);

module.exports = router;
