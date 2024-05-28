import axios from "axios";
import ApiConstants from "../Utils/ApiConstant";
import SessionManager from "../Utils/Session";

const StudyMaterialService = {
  // Existing login function
  getAllStudyMaterials: async (offset, limit, searchQuery,className,subjectName) => {
  
    try {
      const response = await axios.get(
        ApiConstants.getAllStudyMaterials +
        `?offset=${offset}&limit=${limit}&searchQuery=${searchQuery.trim()}&classSearchQuery=${className.trim()}&subjectSearchQuery=${subjectName.trim()}`,
        {
          headers: {
            Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      throw error;
    }
  },

  getAllModules: async (study_material_id, searchQuery) => {
    try {
      const response = await axios.get(
        ApiConstants.getAllModules +
        `?study_material_id=${study_material_id}&searchQuery=${searchQuery.trim()}`,
        {
          headers: {
            Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      throw error;
    }
  },

  getAllModulesBySubject: async (subject_id, medium) => {
    try {
      const response = await axios.get(
        ApiConstants.getAllModulesBySubject + `?subject_id=${subject_id}&medium=${medium}`,
        {
          headers: {
            Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      throw error;
    }
  },

  getAllTopics: async (module_id) => {
    try {
      const response = await axios.get(
        ApiConstants.getAllTopics + `?module_id=${module_id}`,
        {
          headers: {
            Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      throw error;
    }
  },

  deleteStudyMaterial: async (id) => {
    try {
      const response = await axios.post(
        ApiConstants.deleteStudyMaterial,
        {
          ids: id,
        },
        {
          headers: {
            Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      throw error;
    }
  },

  deleteModule: async (id) => {
    try {
      const response = await axios.post(
        ApiConstants.deleteModule,
        {
          ids: [id],
        },
        {
          headers: {
            Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      throw error;
    }
  },

  deleteTopic: async (id) => {
    try {
      const response = await axios.post(
        ApiConstants.deleteTopic,
        {
          ids: [id],
        },
        {
          headers: {
            Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      throw error;
    }
  },

  updateStudyMaterialStatus: async (id, status) => {
    try {
      const response = await axios.put(
        ApiConstants.updateStudyMaterialStatus,
        {
          id: id,
          is_active: status,
        },
        {
          headers: {
            Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      throw error;
    }
  },

  addStudyMaterial: async (subjectId, classId, medium) => {
    try {
      const response = await axios.post(
        ApiConstants.addStudyMaterial,
        { subjectId: subjectId, classId: classId, medium: medium.trim() },
        {
          headers: {
            Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      throw error;
    }
  },

  addTopic: async (topic_name, module_id, study_material_id, details, files, youtube_links, topic_id) => {
    try {
      const formData = new FormData();
      formData.append("topic_name", topic_name.trim())
      formData.append("module_id", module_id)
      formData.append("study_material_id", study_material_id)
      formData.append("details", details.trim())
      formData.append("youtube_links", youtube_links)
      formData.append("topic_id", topic_id)
      var oldFiles = []
      files.forEach((file) => {
        if (typeof file.type !== 'undefined') {
          formData.append('files', file);
        } else {
          oldFiles.push(file);
        }
      });
      formData.append("oldFiles", JSON.stringify(oldFiles));
      const response = await axios.post(ApiConstants.addTopic, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
        }
      });
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      throw error;
    }
  },

  updateStudyMaterial: async (
    subjectId,
    classId,
    medium,
    study_material_id
  ) => {
    try {
      const response = await axios.post(
        ApiConstants.addStudyMaterial,
        {
          subjectId: subjectId,
          classId: classId,
          medium: medium.trim(),
          study_material_id: study_material_id,
        },
        {
          headers: {
            Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      throw error;
    }
  },

  addModule: async (module_name, study_material_id) => {
    try {
      const response = await axios.post(
        ApiConstants.addModule,
        {
          module_name: module_name.trim(),
          study_material_id: study_material_id,
        },
        {
          headers: {
            Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      throw error;
    }
  },

  updateModule: async (module_id, module_name, study_material_id) => {
    try {
      const response = await axios.post(
        ApiConstants.addModule,
        {
          module_id: module_id,
          module_name: module_name.trim(),
          study_material_id: study_material_id,
        },
        {
          headers: {
            Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      throw error;
    }
  },
};

export default StudyMaterialService;
