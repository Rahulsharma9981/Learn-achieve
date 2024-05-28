import axios from "axios";
import ApiConstants from "../Utils/ApiConstant";
import SessionManager from "../Utils/Session";

const AuthorService = {
  // Existing login function

  addAuthors: async (
    author_id,
    name,
    briefIntro,
    instagramLink,
    linkedInLink,
    youtubeLink,
    facebookLink,
    twitterLink,
    image
  ) => {
    try {
      const formData = new FormData();
      formData.append("author_id", author_id || "");
      formData.append("image", image);
      formData.append("name", name);
      formData.append("instagramLink", instagramLink);
      formData.append("twitterLink", twitterLink);
      formData.append("youtubeLink", youtubeLink);
      formData.append("briefIntro", briefIntro);
      formData.append("facebookLink", facebookLink);
      formData.append("linkedInLink", linkedInLink);

      const response = await axios.post(ApiConstants.addAuthor, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
  getAllAuthors: async (offset, limit, searchQuery) => {
    try {
      const response = await axios.get(
        ApiConstants.getAllAuthors +
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

  getAllAuthorsWithoutPagination: async () => {
    try {
      const response = await axios.get(
        ApiConstants.getAllAuthorsWithoutPagination,
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
  updateAuthorStatus: async (id, status) => {
    try {
      const response = await axios.put(
        ApiConstants.changeAuthorStatus,
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
      console.log("errror", error);
      throw error;
    }
  },
  deleteAuthor: async (id)=> {
    try {
      const response = await axios.post(
        ApiConstants.deleteAuthor,
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
};

export default AuthorService;