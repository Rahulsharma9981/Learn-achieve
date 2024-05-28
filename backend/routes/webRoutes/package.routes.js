const express = require('express');
const router = express.Router();
const packageController = require('../../controllers/web/package.controller');
const { userTokenVerification } = require("../../middleware/tokenVerification");

/**
 * Route to list all mock tests.
 * GET /package/list-all-package
 */
router.get('/getAllPackageApi', userTokenVerification, packageController.getAllPackageApi);

module.exports = router;
