const mongoose = require('mongoose');

const bulkUploadQuestionsSchema = new mongoose.Schema(
    {
        file_name: {
            type: String
        },
        successCount: {
            type: Number
        },
        failedCount: {
            type: Number
        },
        totalCount: {
            type: Number
        },
        logFile: {
            type: String
        },
        created_date: {
            type: Date,
            default: Date.now,
        },
    },
    { collection: "BulkUploadQuestions" } // Optional: specify the collection name
);

const bulkUploadQuestions = mongoose.model('BulkUploadQuestion', bulkUploadQuestionsSchema);
module.exports = bulkUploadQuestions;
