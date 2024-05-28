import axios from "axios";
import ApiConstants from "../Utils/ApiConstant";
import SessionManager from "../Utils/Session";

const ClassService = {
  // Existing login function
  getAllClasses: async (offset, limit, searchQuery) => {
    try {
      const response = await axios.get(ApiConstants.getAllClasses + `?offset=${offset}&limit=${limit}&searchQuery=${searchQuery.trim()}`, {
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

  // Existing login function
  getAllClassesWithoutPagination: async () => {
    try {
      const response = await axios.get(ApiConstants.getAllClassesWithoutPagination, {
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

  deleteClass: async (id) => {
    try {
      const response = await axios.post(ApiConstants.deleteClass, {
        id: id
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

  updateClassStatus: async (id, status) => {
    try {
      const response = await axios.put(ApiConstants.updateClassStatus, {
        id: id,
        isActive: status
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

  addClass: async ({ class_name, class_end_date }) => {
    try {
      const response = await axios.post(
        ApiConstants.addClass,
        { class_name: class_name.trim(), class_end_date: class_end_date.trim() },
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

  editClass: async ({ id, class_name, class_end_date }) => {
    try {
      const response = await axios.put(
        ApiConstants.updateClass,
        { class_name: class_name.trim(), class_end_date: class_end_date.trim(), id: id },
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

export default ClassService;
