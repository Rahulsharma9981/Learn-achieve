const mongoose = require('mongoose');

// Define the schema for the mock test
const mockTestSchema = new mongoose.Schema(
    {
        mockTestName: {
            type: String,
            required: true
        },
        medium: {
            type: String,
            required: true
        },
        class_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class', // Reference to the Class model
            required: true
        },
        subject_ids: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject', // Reference to the Subject model
            required: true
        }],
        totalQuestions: {
            type: Number,
            required: true
        },
        durationInMinutes: {
            type: Number,
            required: true
        },
        is_active: {
            type: Boolean,
            default: true, // Default value is true
        },
        is_deleted: {
            type: Boolean,
            default: false, // Default value is false
        },
        // Date when the mock test was created
        created_date: {
            type: Date,
            default: Date.now, // Default value is the current date/time
        },
        // Date when the mock test was last updated
        updated_date: {
            type: Date,
            default: Date.now, // Default value is the current date/time
        },
    },
    { collection: "MockTests" } // Optional: specify the collection name
);

// Create a model using the schema
const MockTest = mongoose.model('MockTest', mockTestSchema);

module.exports = MockTest;
