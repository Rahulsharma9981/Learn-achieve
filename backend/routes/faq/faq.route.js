const express = require('express'); // Import Express framework
const router = express.Router(); // Create a router object
const faqController = require('../../controllers/faq/faq.controller'); // Import FAQ controller
const { adminTokenVerification } = require("../../middleware/tokenVerification"); // Import admin token verification middleware

/**
 * Route to add a new FAQ.
 * POST /faq/add-faq
 */
router.post('/add-faq', adminTokenVerification, faqController.addFaq);

/**
 * Route to list all FAQs.
 * GET /faq/list-all-faq
 */
router.get('/list-all-faq', adminTokenVerification, faqController.listAllFaq);

/**
 * Route to change the status of a FAQ.
 * PUT /faq/change-status
 */
router.put("/change-status", adminTokenVerification, faqController.changeStatus);

/**
 * Route to delete a FAQ.
 * POST /faq/delete-faq
 */
router.post("/delete-faq", adminTokenVerification, faqController.deleteFaq);

/**
 * Route to get details of a FAQ by ID.
 * GET /faq/getFaqDetailById
 */
router.get("/getFaqDetailById", adminTokenVerification, faqController.getFaqDetailById);

module.exports = router; // Export the router object
