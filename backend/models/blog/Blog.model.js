const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
    {
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BlogCategory', // Reference to BlogCategory model
        },

        author_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Author', // Reference to Author model
        },
        date: {
            type: Date,
        },
        title: {
            type: String,
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
    { collection: "Blogs" } // Optional: specify the collection name

);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
