// File: models/admin/Admin.model.js

const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
{
    banner_image: {
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
},
{ collection: "Banners" } // Optional: specify the collection name
);

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;
