const mongoose = require('mongoose');

// Define the schema for the user collection
const userSchema = new mongoose.Schema(
    {
        // First name of the user
        firstName: {
            type: String,
        },
        // Middle name of the user
        middleName: {
            type: String,
        },
        // Last name of the user
        lastName: {
            type: String,
        },
        // Date of birth of the user
        dateOfBirth: {
            type: Date,
        },
        // Gender of the user
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'] // Gender options
        },
        // Name of the school the user attends
        schoolName: {
            type: String,
        },
        // Medium of instruction at the school
        medium: {
            type: String,
        },
        // Class or grade of the user
        class: {
            type: String,
        },
        // Email address of the user (unique and lowercase)
        email: {
            type: String,
            lowercase: true,
            unique: true
        },
        // Mobile number of the user (unique)
        mobile: {
            type: String,
            unique: true
        },
        // Address line 1 of the user
        addressLine1: {
            type: String,
        },
        // Address line 2 of the user
        addressLine2: {
            type: String,
        },
        // State of the user's address
        state: {
            type: String,
        },
        // District of the user's address
        district: {
            type: String,
        },
        // PIN code of the user's address
        pinCode: {
            type: String,
        },
        // Password of the user
        password: {
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
        // One-time password (OTP) for user verification
        otp: {
            type: String,
            default: null, // Default value is null
        }
    },
    { collection: "Users" } // Optional: specify the collection name
);

// Create a model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
