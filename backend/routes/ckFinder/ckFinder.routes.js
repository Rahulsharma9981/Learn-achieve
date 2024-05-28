const express = require('express');
const multer = require('multer');
const path = require('path');
const { adminTokenVerification } = require("../../middleware/tokenVerification");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/ckFinder"); // Set the destination folder for file uploads
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename for each uploaded file
    }
});

const upload = multer({ storage });
// Upload endpoint

router.post('/upload', adminTokenVerification, upload.single('upload'), (req, res) => {
    // Handle file upload
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    // Send back the uploaded file URL
    res.json({ url: file.path });
});

module.exports = router;
