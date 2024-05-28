const express = require('express');
const router = express.Router();
const blogController = require('../../controllers/blog/blog.controller');
const { adminTokenVerification } = require("../../middleware/tokenVerification");
const multer = require('multer'); // Import multer for handling file uploads



// Multer configuration for handling image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/blog'); // Files will be uploaded to the 'uploads/' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Use unique file name
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only files with specified extensions
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/webp') {
        cb(null, true);
    } else {
        cb(new Error('Only .jpg, .jpeg, and .webp files are allowed'));
    }
};

// Multer middleware for single file upload
const upload = multer({ storage: storage, fileFilter: fileFilter }).fields([{ name: 'featuredImage', maxCount: 1 }, { name: 'mainImage', maxCount: 1 }]);

// Route to add a new blog
router.post('/add-blog', adminTokenVerification, upload, blogController.addBlog);

/**
 * Route to list all blog categories.
 * GET /blog-category/list-all-blog-category
 */
router.get('/list-all-blog', adminTokenVerification, blogController.listAllBlog);

/**
 * Route to change the status of a blog category.
 * PUT /blog-category/change-status
 */
router.put("/change-status", adminTokenVerification, blogController.changeStatus);

/**
 * Route to delete a blog category.
 * POST /blog-category/delete-blog-category
 */
router.post("/delete-blog", adminTokenVerification, blogController.deleteBlog);

/**
 * Route to get details of a blog category by ID.
 * GET /blog-category/getBlogCategoryDetailById
 */
router.get( "/getBlogDetailById", adminTokenVerification, blogController.getBlogDetailById );

module.exports = router;
