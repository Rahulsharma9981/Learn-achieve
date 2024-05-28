const mongoose = require("mongoose");

// Define the schema for the author
const authorSchema = new mongoose.Schema(
  {
    // Name of the author
    name: {
      type: String,
      required: true, // Name is required
    },

    // Image path of the author
    image: {
      type: Object,
      required: true, // Image path is required
    },

    // Brief introduction of the author
    briefIntro: {
      type: String,
      required: true, // Brief introduction is required
    },

    // Instagram profile link of the author
    instagramLink: {
      type: String,
    },

    // Youtube channel link of the author
    youtubeLink: {
      type: String,
    },

    // Twitter profile link of the author
    twitterLink: {
      type: String,
    },

    // Facebook profile link of the author
    facebookLink: {
      type: String,
    },

    // LinkedIn profile link of the author
    linkedInLink: {
      type: String,
    },

    // Whether the author is active or not (default is true)
    is_active: {
      type: Boolean,
      default: true, // Default value is true
    },

    // Whether the author is deleted or not (default is false)
    is_deleted: {
      type: Boolean,
      default: false, // Default value is false
    },

    // Date when the author was created (default is the current date/time)
    created_date: {
      type: Date,
      default: Date.now, // Default value is the current date/time
    },

    // Date when the author was last updated (default is the current date/time)
    updated_date: {
      type: Date,
      default: Date.now, // Default value is the current date/time
    },
  },
  { collection: "Authors" } // Optional: specify the collection name
);

// Create a model using the schema
const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
