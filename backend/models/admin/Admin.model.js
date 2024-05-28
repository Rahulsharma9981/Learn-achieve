// File: models/admin/Admin.model.js

const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String,
    },
    profile_pic: {
      type: String,
    },
    mobile_number: {
      type: String,
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
    otp: {
      type: String,
      default: null,
    },
  },
  { collection: "Admins" } // Optional: specify the collection name
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
