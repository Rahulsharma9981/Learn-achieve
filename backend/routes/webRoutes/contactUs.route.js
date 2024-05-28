// File: routes/admin/auth.routes.js

// Import necessary modules
const express = require("express");
const router = express.Router();
const contactUsController = require("../../controllers/web/contactUs.controller");
const { userTokenVerification, userTempTokenVerification } = require("../../middleware/tokenVerification");

// Route to handle registration of users through API
router.post("/addContactApi", contactUsController.addContactApi);

// Export the router
module.exports = router;
