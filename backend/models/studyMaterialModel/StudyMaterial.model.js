// File: models/study material/studyMaterial.model.js

const mongoose = require("mongoose");

const studyMaterialSchema = new mongoose.Schema(
  {
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Class",
    },

    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
    },
    
    medium: {
        type: String
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
  
  { collection: "StudyMaterials" } // Optional: specify the collection name
);

const StudyMaterial = mongoose.model("StudyMaterial", studyMaterialSchema);

module.exports = StudyMaterial;
