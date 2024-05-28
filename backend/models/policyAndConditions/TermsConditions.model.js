const mongoose = require('mongoose');

// Define the schema for the mock test
const termsConditionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        details: {
            type: String,
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
    { collection: "TermsConditions" } // Optional: specify the collection name
);

// Create a model using the schema
const TermsCondition = mongoose.model('TermsCondition', termsConditionSchema);

module.exports = TermsCondition;
