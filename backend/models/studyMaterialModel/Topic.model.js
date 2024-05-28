// File: models/study material/topic.js

const mongoose = require('mongoose');

// Define the schema for the topic model
const topicSchema = new mongoose.Schema(
    {
        // Name of the topic
        topic_name: { 
            type: String
        },
        // Reference to the associated study material
        study_material_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"studyMaterial",
        },
        // Reference to the associated module
        module_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "studyMaterialModule",
        },
        // Details of the topic
        details: { 
            type: String
        },
        // URLs of uploaded files (PDFs, Docs, PPTs)
        files: [
            { type: Object }
        ],
        // URLs of YouTube videos
        youtube_links: [
            { type: String }
        ],
        // Date when the topic was created
        created_date: {
            type: Date,
            default: Date.now,
        },
        // Date when the topic was last updated
        updated_date: {
            type: Date,
            default: Date.now,
        },
        // Flag to indicate if the topic is active
        is_active: {
            type: Boolean,
            default: true,
        },
        // Flag to indicate if the topic is deleted
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    { collection: "Topics" } // Optional: specify the collection name
);

// Create the Topic model based on the schema
const Topic = mongoose.model("Topic", topicSchema);

// Export the Topic model
module.exports = Topic;
