const express = require('express');
const router = express.Router();
const testimonialController = require('../../controllers/testimonial/testimonial.controller');
const { adminTokenVerification } = require("../../middleware/tokenVerification");

/**
 * Route to add a new testimonial.
 * POST /testimonial/add-testimonial
 */
router.post('/add-testimonial', adminTokenVerification, testimonialController.addTestimonial);

/**
 * Route to list all testimonials.
 * GET /testimonial/list-all-testimonial
 */
router.get('/list-all-testimonial', adminTokenVerification, testimonialController.listAllTestimonial);

/**
 * Route to change the status of a testimonial.
 * PUT /testimonial/change-status
 */
router.put("/change-status", adminTokenVerification, testimonialController.changeStatus);

/**
 * Route to delete a testimonial.
 * POST /testimonial/delete-testimonial
 */
router.post("/delete-testimonial", adminTokenVerification, testimonialController.deleteTestimonial);

/**
 * Route to get details of a testimonial by ID.
 * GET /testimonial/getTestimonialDetailById
 */
router.get( "/getTestimonialDetailById", adminTokenVerification, testimonialController.getTestimonialDetailById );

module.exports = router;
