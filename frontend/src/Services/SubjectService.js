import axios from "axios";
import ApiConstants from "../Utils/ApiConstant";
import SessionManager from "../Utils/Session";

const SubjectService = {
  // Existing login function
  getAllSubjects: async (offset, limit, searchQuery) => {
    console.log("search query",searchQuery)
    try {
      const response = await axios.get(ApiConstants.getAllSubjects + `?offset=${offset}&limit=${limit}&searchQuery=${searchQuery?.trim()}`, {
        headers: {
          Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
        },
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

  getAllSubjectsWithoutPagination: async (classId) => {
    try {
      const response = await axios.get(ApiConstants.getAllSubjectsWithoutPagination + `?class_id=${classId}`, {
        headers: {
          Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
        },
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

  deleteSubject: async (id) => {
    try {
      const response = await axios.post(ApiConstants.deleteSubject, {
        ids: id
      },
        {
          headers: {
            Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
          },
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

  updateSubjectStatus: async (id, status) => {
    try {
      const response = await axios.put(ApiConstants.updateSubjectStatus, {
        id: id,
        is_active: status
      }, {
        headers: {
          Authorization: `Bearer ${SessionManager.shared.getSessionToken()}`,
        },
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

  addSubject: async ({ subject_name, class_id }) => {
    try {
      const response = await axios.post(
        ApiConstants.addSubject,
        { subject_name: subject_name.trim(), class_id: class_id },
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

  updateSubject: async ({ id, class_id, subject_name }) => {
    try {
      const response = await axios.put(
        ApiConstants.updateSubject,
        { id: id, class_id: class_id, subject_name: subject_name.trim() },
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

export default SubjectService;
