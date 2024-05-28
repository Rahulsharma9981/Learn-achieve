const express = require('express');
const router = express.Router();
const packageController = require('../../controllers/package/package.controller');
const { adminTokenVerification } = require("../../middleware/tokenVerification");
const multer = require('multer'); // Import multer for handling file uploads


// Multer configuration for handling image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/package'); // Files will be uploaded to the 'uploads/' directory
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
/**
 * Route to add a new mock test.
 * POST /package/add-package
 */
router.post('/add-package', adminTokenVerification, upload, packageController.addPackage);

/**
 * Route to list all mock tests.
 * GET /package/list-all-package
 */
router.get('/list-all-package', adminTokenVerification, packageController.listAllPackages);

/**
 * Route to change the status of a mock test.
 * PUT /package/change-status
 */
router.put("/change-status", adminTokenVerification, packageController.changeStatus);

/**
 * Route to delete a mock test.
 * POST /package/delete-package
 */
router.post("/delete-package", adminTokenVerification, packageController.deletePackage);

// Route for getting topic details by ID, with admin token verification middleware
router.get("/getPackageDetailById", adminTokenVerification, packageController.getPackageDetailById);

module.exports = router;
