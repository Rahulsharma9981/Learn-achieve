import axios from "axios";
import ApiConstants from "../Utils/ApiConstant";
import { OtpVerificationType } from "../Utils/Enums";
import SessionManager from "../Utils/Session";

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(ApiConstants.login, {
        email: email.trim(),
        password: password.trim(),
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

  verifyOTP: async (email, otp, type) => {
    try {
      const response = await axios.post(ApiConstants.verifyOtp, { email: email.trim(), otp: otp.trim(), type: type.trim() });

      if (response.status === 200) {
        const token = response.data.token;
        type == OtpVerificationType.forgotPassword ?
          SessionManager.shared.setForgotPasswordToken(token) :
          SessionManager.shared.setSessionToken(token);
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await axios.post(ApiConstants.forgotPassword, {
        email: email.trim(),
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

  resetPassword: async (newPassword) => {
    try {
      const response = await axios.post(
        ApiConstants.resetPassword,
        { newPassword: newPassword.trim() },
        {
          headers: {
            Authorization: `Bearer ${SessionManager.shared.getForgotPasswordToken()}`,
          },
        }
      );
      if (response.status ===  200) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      throw error;
    }
  },

  getDetails: async () => {
    try {
      const response = await axios.get(ApiConstants.getAdminDetails, {
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
      throw error
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await axios.put(ApiConstants.changePassword, { currentPassword: currentPassword.trim(), newPassword: newPassword.trim() }, {
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

  updateProfileDetails: async (name, email, mobileNumber) => {
    try {
      const response = await axios.put(ApiConstants.updateProfileDetails, { name: name.trim(), email: email.trim(), mobileNumber: mobileNumber.trim() }, {
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

  updateProfilePic: async (file) => {
    const formData = new FormData();
    formData.append("profile_pic", file)
    try {
      const response = await axios.put(ApiConstants.updateProfileDetails, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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
  }
};

export default AuthService;
