const express = require('express');
const router = express.Router();
const authorController = require("../../controllers/author/author.controller");
const { adminTokenVerification } = require("../../middleware/tokenVerification");
const multer = require('multer');

// Multer configuration for handling image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/author'); // Files will be uploaded to the 'uploads/' directory
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
const upload = multer({ storage: storage, fileFilter: fileFilter }).single('image');

/**
 * Route to add a new author.
 * POST /author/add-author
 */
router.post('/add-author', adminTokenVerification, upload, authorController.addAuthor);

/**
 * Route to list all authors.
 * GET /author/list-authors
 */
router.get('/list-authors', adminTokenVerification, authorController.listAuthors);

/**
 * Route to get all authors without pagination.
 * GET /author/get-all-author
 */
router.get("/get-all-author", adminTokenVerification, authorController.getAllAuthorWithoutPagination);

/**
 * Route to change the status of an author.
 * PUT /author/change-status
 */
router.put("/change-status", adminTokenVerification, authorController.changeStatus);

/**
 * Route to delete an author.
 * POST /author/delete-author
 */
router.post("/delete-author", adminTokenVerification, authorController.deleteAuthor);

/**
 * Route to get author details by ID.
 * GET /author/getAuthorDetailById
 */
router.get("/getAuthorDetailById", adminTokenVerification, authorController.getAuthorDetailById);

module.exports = router;
