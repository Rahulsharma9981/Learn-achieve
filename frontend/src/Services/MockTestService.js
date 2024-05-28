import axios from "axios";
import ApiConstants from "../Utils/ApiConstant";
import SessionManager from "../Utils/Session";

const MockTestService = {
  // Existing login function
  getAllMockTest: async (offset, limit, searchQuery) => {
    try {
      const response = await axios.get(
        ApiConstants.getAllMockTest +
          `?offset=${offset}&limit=${limit}&searchQuery=${searchQuery.trim()}`,
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
  getAllMockTestWithoutPagination: async (offset, limit, searchQuery) => {
    try {
      const response = await axios.get(
        ApiConstants.getAllMockTestWithoutPagination ,
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

  deleteMockTest: async (id) => {
    try {
      const response = await axios.post(
        ApiConstants.deleteMockTest,
        {
          id: id,
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

  updateMockTestStatus: async (id, status) => {
    try {
      const response = await axios.put(
        ApiConstants.updateMockTestStatus,
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

  addMockTest: async (
    isEdit,
    testName,
    class_id,
    medium,
    subjects,
    noOfQuestion,
    duration
  ) => {
    try {
      const response = await axios.post(
        ApiConstants.addMockTest,
        {
          mock_test_id:isEdit || "",
          mockTestName: testName,
          class_id: class_id,
          medium:medium,
          subject_ids: subjects,
          totalQuestions: noOfQuestion,
          durationInMinutes: duration,
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

export default MockTestService;
