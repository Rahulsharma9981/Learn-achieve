const express = require('express');
const router = express.Router();
const faqCategoryController = require('../../controllers/faq/faqCategory.controller');
const { adminTokenVerification } = require("../../middleware/tokenVerification");

/**
 * Route to add a new FaqCategory.
 * POST /faqCategory/add-faq-category
 */
router.post('/add-faq-category', adminTokenVerification, faqCategoryController.addFaqCategory);

/**
 * Route to list all FaqCategories.
 * GET /faqCategory/list-all-faq-category
 */
router.get('/list-all-faq-category', adminTokenVerification, faqCategoryController.listAllFaqCategory);

/**
 * Route to retrieve all faq categories without pagination.
 * GET /faq-category/get-all-faq-category
 */
router.get("/get-all-faq-category", adminTokenVerification, faqCategoryController.getAllFaqCategoryWithoutPagination);

/**
 * Route to change the status of a FaqCategory.
 * PUT /faqCategory/change-status
 */
router.put("/change-status", adminTokenVerification, faqCategoryController.changeStatus);

/**
 * Route to delete a FaqCategory.
 * POST /faqCategory/delete-faq-category
 */
router.post("/delete-faq-category", adminTokenVerification, faqCategoryController.deleteFaqCategory);

/**
 * Route to get details of a FaqCategory by ID.
 * GET /faqCategory/getFaqCategoryDetailById
 */
router.get("/getFaqCategoryDetailById", adminTokenVerification, faqCategoryController.getFaqCategoryDetailById);

module.exports = router;
