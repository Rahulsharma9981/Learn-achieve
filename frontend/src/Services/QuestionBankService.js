import axios from "axios";
import ApiConstants from "../Utils/ApiConstant";
import SessionManager from "../Utils/Session";

const QuestionBankService = {
  // Existing login function
  getAllQuestions: async (offset, limit, searchQuery) => {
    try {
      const response = await axios.get(
        ApiConstants.getAllQuestions +
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

  getBulkUploadHistory: async (offset, limit, searchQuery) => {
    try {
      const response = await axios.get(
        ApiConstants.getBulkUploadHistory +
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

  bulkUploadQuestions: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        ApiConstants.bulkUploadQuestions,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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

  deleteQuestion: async (id) => {
    try {
      const response = await axios.post(
        ApiConstants.deleteQuestion,
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

  updateQuestionStatus: async (id, status) => {
    try {
      const response = await axios.put(
        ApiConstants.updateQuestionStatus,
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

  addQuestion: async (
    id,
    class_id,
    medium,
    subject_id,
    question_type,
    type_of_question,
    question,
    solution,
    correctOption,
    optionOne,
    optionTwo,
    optionThree,
    optionFour,
    module_id,
    topic_id
  ) => {
    try {
      const response = await axios.post(
        ApiConstants.addQuestion,
        {
          question_id: id,
          class_id: class_id,
          medium: medium.trim(),
          subject_id: subject_id,
          type_of_question: type_of_question.trim(),
          question_type: question_type.trim(),
          question: question?.trim(),
          solution: solution?.trim(),
          correctOption: correctOption,
          optionOne: optionOne?.trim(),
          optionTwo: optionTwo?.trim(),
          optionThree: optionThree?.trim(),
          optionFour: optionFour?.trim(),
          module_id: module_id,
          topic_id: topic_id,
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

  updateQuestion: async (id, subjectId, classId, medium) => {
    try {
      const response = await axios.post(
        ApiConstants.updateQuestion,
        {
          study_material_id: id,
          subjectId: subjectId,
          classId: classId,
          medium: medium.trim(),
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
  getAllSubQuestions: async (question_id) => {
    try {
      const response = await axios.get(
        ApiConstants.getAllSubQuestions + `?question_id=${question_id}`,
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
  addSubQuestion: async (
    id,
    question,
    solution,
    correctOption,
    optionOne,
    optionTwo,
    optionThree,
    optionFour,
    sub_question_id
  ) => {
    try {
      const response = await axios.post(
        ApiConstants.addSubQuestion,
        {
          question_id: id,
          question: question?.trimRight(),
          solution: solution?.trimRight(),
          correctOption: correctOption,
          optionOne: optionOne?.trimRight(),
          optionTwo: optionTwo?.trimRight(),
          optionThree: optionThree?.trimRight(),
          optionFour: optionFour?.trimRight(),
          sub_question_id:sub_question_id
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
  deleteSubQuestion: async (id) => {
    try {
      const response = await axios.post(
        ApiConstants.deleteSubQuestion,
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
};

export default QuestionBankService;
