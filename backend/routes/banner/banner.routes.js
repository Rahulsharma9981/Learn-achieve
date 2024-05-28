const express = require('express');
const router = express.Router();
const bannerController = require('../../controllers/banner/banner.controller');
const { adminTokenVerification } = require("../../middleware/tokenVerification");
const multer = require("multer");
var path = require('path')

// Multer configuration for handling file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/banner/banner_image'); // Destination directory for storing files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + path.extname(file.originalname)); // Use original file name with timestamp as the stored file name
    }
});

// Multer middleware for single file upload
const upload = multer({ storage: storage }).single('banner_image');

// Route for adding a new banner
router.post("/add-banner", adminTokenVerification, upload, bannerController.addBanner);

// Route for fetching all banners
router.get("/all", adminTokenVerification, bannerController.getAllBanner);

// Route for fetching a banner by ID
router.get("/:id", adminTokenVerification, bannerController.getBannerById);

// Route for deleting a banner
router.post("/deleteBanner", adminTokenVerification, bannerController.deleteBanner);

module.exports = router;
