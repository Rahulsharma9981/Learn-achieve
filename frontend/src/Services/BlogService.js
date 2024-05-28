import axios from "axios";
import ApiConstants from "../Utils/ApiConstant";
import SessionManager from "../Utils/Session";

const BlogService = {
  getAllCategoryWithoutPagination: async () => {
    try {
      const response = await axios.get(
        ApiConstants.getAllCategoryWithoutPagination,
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

  addBlog: async (
    blog_id,
    category_id,
    author_id,
    date,
    details,
    title,
    briefIntro,
    featuredImage,
    mainImage
  ) => {
    try {
      const formData = new FormData();
      formData.append("blog_id", blog_id || "");
      formData.append("category_id", category_id);
      formData.append("author_id", author_id);
      formData.append("details", details.trim());
      formData.append("date", date);
      formData.append("title", title);
      formData.append("briefIntro", briefIntro);
      formData.append("featuredImage", featuredImage);
      formData.append("mainImage", mainImage);

      const response = await axios.post(ApiConstants.addBlog, formData, {
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
      // Handle API errors here
      throw error;
    }
  },
  getBlog: async (offset, limit, searchQuery) => {
    try {
      const response = await axios.get(
        ApiConstants.getAllBlog +
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
  updateBlogStatus: async (id, status) => {
    try {
      const response = await axios.put(
        ApiConstants.changeStatusBlog,
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

  deleteBlog: async (id) => {
    try {
      const response = await axios.post(
        ApiConstants.deleteBlog,
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

export default BlogService;
