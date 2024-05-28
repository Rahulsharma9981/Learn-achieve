import axios from "axios";
import ApiConstants from "../Utils/ApiConstant";
import SessionManager from "../Utils/Session";

const BlogCategoryService = {
  // Existing login function
  getBlogCategoryService: async (offset, limit, searchQuery) => {
    try {
      const response = await axios.get(
        ApiConstants.getBlogCategory +
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

  addCategory: async (id, categoryName) => {
    try {
      const response = await axios.post(
        ApiConstants.addBlogCategory,
        {
          blog_category_id: id,
          categoryName: categoryName.trim(),
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

  updateBlogCategroyStatus: async (id, status) => {
    try {
      const response = await axios.put(
        ApiConstants.changeStatusBlogCategory,
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
  editBlog: async ({ id, categoryName }) => {
    try {
      const response = await axios.post(
        ApiConstants.addBlogCategory,
        { blog_category_id: id, categoryName: categoryName.trim() },
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

  deleteBlogCategory: async (id) => {
    try {
      const response = await axios.post(
        ApiConstants.deleteBlogCategory,
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

export default BlogCategoryService;
