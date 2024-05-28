const express = require('express');
const router = express.Router();
const blogCategoryController = require('../../controllers/blog/blogCategory.controller');
const { adminTokenVerification } = require("../../middleware/tokenVerification");

/**
 * Route to add a new blog category.
 * POST /blog-category/add-blog-category
 */
router.post('/add-blog-category', adminTokenVerification, blogCategoryController.addBlogCategory);

/**
 * Route to list all blog categories.
 * GET /blog-category/list-all-blog-category
 */
router.get('/list-all-blog-category', adminTokenVerification, blogCategoryController.listAllBlogCategory);

/**
 * Route to retrieve all blog categories without pagination.
 * GET /blog-category/get-all-blog-category
 */
router.get("/get-all-blog-category", adminTokenVerification, blogCategoryController.getAllBlogCategoryWithoutPagination);

/**
 * Route to change the status of a blog category.
 * PUT /blog-category/change-status
 */
router.put("/change-status", adminTokenVerification, blogCategoryController.changeStatus);

/**
 * Route to delete a blog category.
 * POST /blog-category/delete-blog-category
 */
router.post("/delete-blog-category", adminTokenVerification, blogCategoryController.deleteBlogCategory);

/**
 * Route to get details of a blog category by ID.
 * GET /blog-category/getBlogCategoryDetailById
 */
router.get( "/getBlogCategoryDetailById", adminTokenVerification, blogCategoryController.getBlogCategoryDetailById );

module.exports = router;
