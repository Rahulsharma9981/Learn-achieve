const express = require('express');
const router = express.Router();
const questionController = require('../../controllers/questionBankController/question.controller');
const { adminTokenVerification } = require("../../middleware/tokenVerification");
const multer = require('multer');
const path = require('path');

// Add a new question
router.post('/add-question', adminTokenVerification, questionController.addQuestion);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/questions/bulkUploads'); // Files will be uploaded to the 'uploads/' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now().toString() + path.extname(file.originalname)); // Use the original file name as the stored file name
    }
});

const upload = multer({ storage: storage }).single('file');
router.post('/bulk-upload-questions', adminTokenVerification, upload, questionController.bulkUploadQuestions);

// List question
router.get('/all-question-list', adminTokenVerification, questionController.allQuestionList);

router.get('/getBulkUploadHistory', adminTokenVerification, questionController.getBulkUploadHistory);

// Delete a subject by ID
router.post("/delete-question", adminTokenVerification, questionController.deleteQuestion);

// PUT route to manage subject status
router.put("/update-question-status", adminTokenVerification, questionController.updateQuestionStatus);

// Add a new question
router.post('/add-sub-question', adminTokenVerification, questionController.addSubQuestion);
// Route for deleting sub question using id
router.post( "/delete-sub-question", adminTokenVerification, questionController.deleteSubQuestion );

// Route for listing all topics
router.get( "/list-all-sub-question", adminTokenVerification, questionController.getAllSubQuestion );

// Route for getting study material details by ID, with admin token verification middleware
// router.get("/:id", adminTokenVerification, questionController.getSubQuestionDetailById);

module.exports = router;
