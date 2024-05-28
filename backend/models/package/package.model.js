const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
    {
        packageName: {
            type: String,
        },
        validityInDays: {
            type: Number,
        },
        actualPrice: {
            type: Number,
        },
        discountedPrice: {
            type: Number,
        },
        featuredImage: {
            type: Object,
        },
        mainImage: {
            type: Object,
        },
        briefIntro: {
            type: String,
        },
        details: {
            type: String,
        },
        mockTests: [{
            mockTest_id: {
                type:mongoose.Schema.Types.ObjectId,
                ref: 'MockTest' // Assuming 'MockTest' is the name of your mock test model
            },
            numberOfAttempts: Number
        }],

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
    { collection: "Packages" } // Optional: specify the collection name

);

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
