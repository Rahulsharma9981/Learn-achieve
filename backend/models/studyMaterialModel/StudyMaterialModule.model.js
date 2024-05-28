// File: models/study material/StudyMaterialModule.model.js

const mongoose = require("mongoose");

const StudyMaterialModuleSchema = new mongoose.Schema(
  {
    study_material_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"studyMaterial",
    },
    
    module_name: {
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
  
  { collection: "StudyMaterialModules" } // Optional: specify the collection name
);

const StudyMaterialModule = mongoose.model("StudyMaterialModule", StudyMaterialModuleSchema);

module.exports = StudyMaterialModule;
