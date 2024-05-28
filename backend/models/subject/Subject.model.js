// File: models/admin/Admin.model.js

const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    subject_name: {
      type: String,
    },
    class_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Class",
    },

    created_date: {
      type: Date,
      default: Date.now,
    },
    updated_date: {
      type: Date,
      default: Date.now,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "Subjects" } // Optional: specify the collection name
);

const Subject = mongoose.model("Subject", subjectSchema);

module.exports = Subject;
