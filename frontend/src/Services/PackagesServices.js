import axios from "axios";
import ApiConstants from "../Utils/ApiConstant";
import SessionManager from "../Utils/Session";

const PackagesService = {
  // Existing login function
  getAllPackages: async (offset, limit, searchQuery) => {
    try {
      const response = await axios.get(
        ApiConstants.listAllPackages +
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

  deletePackage: async (id) => {
    try {
      const response = await axios.post(
        ApiConstants.deletePackage,
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

  updatePackageStatus: async (id, status) => {
    try {
      const response = await axios.put(
        ApiConstants.updatePackageStatus,
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

  addPackage: async (
    package_id,
    mockTests,
    packageName,
    featureImage,
    mainImage,
    validity,
    actualPrice,
    discountedPrice,
    briefIntro,
    details
  ) => {
    try {
      
      // Create a new FormData object
    const formData = new FormData();

    // Append data to the FormData object
    formData.append("package_id", package_id);
    
    // Append each mock test object to the FormData
    mockTests.forEach((mockTest, index) => {
      formData.append(`mockTests[${index}][mockTest_id]`, mockTest.mockTest_id);
      formData.append(`mockTests[${index}][numberOfAttempts]`, mockTest.numberOfAttempts);
    });
    
    formData.append("packageName", packageName);
    formData.append("featuredImage", featureImage);
    formData.append("mainImage", mainImage);
    formData.append("validityInDays", validity || "");
    formData.append("actualPrice", actualPrice || "");
    formData.append("discountedPrice", discountedPrice || "");
    formData.append("briefIntro", briefIntro || "");
    formData.append("details", details || "");

    const response = await axios.post(
      ApiConstants.addPackage,
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

  updatePackage: async ({ id, class_id, subject_name }) => {
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

export default PackagesService;
