const mongoose = require('mongoose'); // Import mongoose for database schema creation

// Define the schema for the FAQ category
const faqSchema = new mongoose.Schema(
    {
        faq_category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FaqCategory', // Reference to FaqCategory model
        },
        question: {
            type: String, // Data type for the question field
        },
        answer: {
            type: String, // Data type for the answer field
        },
        is_active: {
            type: Boolean, // Data type for the is_active field
            default: true, // Default value is true if not provided
        },
        is_deleted: {
            type: Boolean, // Data type for the is_deleted field
            default: false, // Default value is false if not provided
        },
        // Date when the FAQ category was created
        created_date: {
            type: Date, // Data type for the created_date field
            default: Date.now, // Default value is the current date/time if not provided
        },
        // Date when the FAQ category was last updated
        updated_date: {
            type: Date, // Data type for the updated_date field
            default: Date.now, // Default value is the current date/time if not provided
        },
    },
    { collection: "Faqs" } // Optional: specify the collection name
);

// Create a model using the schema
const Faq = mongoose.model('Faq', faqSchema);

module.exports = Faq; // Export Faq model
