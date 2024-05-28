const mongoose = require('mongoose');

// Define the schema for the mock test
const testimonialsSchema = new mongoose.Schema(
    {
        name: {
            type: String, // Data type for the name field
        },
        designation: {
            type: String, // Data type for the designation field
        },
        feedback: {
            type: String, // Data type for the feedback field
        },
        is_active: {
            type: Boolean, // Data type for the is_active field
            default: true, // Default value is true if not provided
        },
        is_deleted: {
            type: Boolean, // Data type for the is_deleted field
            default: false, // Default value is false if not provided
        },
        // Date when the mock test was created
        created_date: {
            type: Date, // Data type for the created_date field
            default: Date.now, // Default value is the current date/time if not provided
        },
        // Date when the mock test was last updated
        updated_date: {
            type: Date, // Data type for the updated_date field
            default: Date.now, // Default value is the current date/time if not provided
        },
    },
    { collection: "Testimonials" } // Optional: specify the collection name
);

// Create a model using the schema
const Testimonials = mongoose.model('Testimonial', testimonialsSchema);

module.exports = Testimonials;
