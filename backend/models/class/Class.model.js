// File: models/admin/Admin.model.js
const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  class_name: {
    type: String,
  },
  class_end_date: {
    type: Date,
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
  }
}, { collection: "Classes" }
);

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
