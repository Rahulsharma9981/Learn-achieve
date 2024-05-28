const mongoose = require('mongoose');

// Define the schema for the user collection
const contactUsSchema = new mongoose.Schema(
    {
        // First name of the user
        name: {
            type: String,
        },
        // Email address of the user (unique and lowercase)
        email: {
            type: String,
            lowercase: true,
            unique: true
        },
        // Address line 1 of the user
        subject: {
            type: String,
        },
        // Address line 2 of the user
        message: {
            type: String,
        },
        // Flag indicating if the user is active
        is_active: {
            type: Boolean,
            default: true, // Default value is true
        },
        // Flag indicating if the user is deleted
        is_deleted: {
            type: Boolean,
            default: false, // Default value is false
        },
        // Date when the user was created
        created_date: {
            type: Date,
            default: Date.now, // Default value is current date/time
        },
        // Date when the user was last updated
        updated_date: {
            type: Date,
            default: Date.now, // Default value is current date/time
        },
      
    },
    { collection: "ContactUs" } // Optional: specify the collection name
);

// Create a model using the schema
const ContactUs = mongoose.model('ContactUs', contactUsSchema);

module.exports = ContactUs;
