const httpStatus = require("http-status");
const Admin = require("../models/admin/Admin.model");
const User = require("../models/webModel/User.model");
const Utils = require("../utility/utils");
const MessageConstants = require("../utility/MessageConstants");

function getUnauthorizedError(res) {
  return res
    .status(httpStatus.UNAUTHORIZED)
    .send(
      Utils.errorResponse(
        MessageConstants.UNAUTHORIZED,
        httpStatus.UNAUTHORIZED
      )
    );
}

const adminTokenVerification = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return getUnauthorizedError(res);
    }

    // Extract token from Authorization header
    const token = authHeader.replace("Bearer ", "");

    // Decode token
    const decoded = Utils.jwtDecode(token);
    if (!decoded || !decoded.admin_id) {
      return getUnauthorizedError(res);
    }

    // Find admin by admin_id from token
    const admin = await Admin.findOne({ _id: decoded.admin_id });
    if (!admin) {
      return getUnauthorizedError(res);
    }

    // Attach authenticated admin to request object
    req.authenticatedUser = admin;
    next();
  } catch (error) {
    console.error("Error in adminTokenVerification middleware:", error);
    return getUnauthorizedError(res);
  }
};

const tempTokenVerification = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return getUnauthorizedError(res);
    }

    // Extract token from Authorization header
    const token = authHeader.replace("Bearer ", "");

    // Decode token
    const decoded = Utils.jwtDecode(token);
    if (!decoded || !decoded.temp_id) {
      return getUnauthorizedError(res);
    }

    // Find admin by admin_id from token
    const admin = await Admin.findOne({ _id: decoded.temp_id });
    if (!admin) {
      return getUnauthorizedError(res);
    }

    // Attach authenticated admin to request object
    req.authenticatedUser = admin;
    next();
  } catch (error) {
    console.error("Error in adminTokenVerification middleware:", error);
    return getUnauthorizedError(res);
  }
};

const userTokenVerification = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return getUnauthorizedError(res);
    }

    // Extract token from Authorization header
    const token = authHeader.replace("Bearer ", "");

    // Decode token
    const decoded = Utils.jwtDecode(token);
    if (!decoded || !decoded.user_id) {
      return getUnauthorizedError(res);
    }

    // Find admin by user_id from token
    const user = await User.findOne({ _id: decoded.user_id });
    if (!user) {
      return getUnauthorizedError(res);
    }

    // Attach authenticated user to request object
    req.authenticatedUser = user;
    next();
  } catch (error) {
    return getUnauthorizedError(res);
  }
};

const userTempTokenVerification = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return getUnauthorizedError(res);
    }

    // Extract token from Authorization header
    const token = authHeader.replace("Bearer ", "");

    // Decode token
    const decoded = Utils.jwtDecode(token);
    if (!decoded || !decoded.temp_id) {
      return getUnauthorizedError(res);
    }

    // Find admin by admin_id from token
    const user = await User.findOne({ _id: decoded.temp_id });
    if (!user) {
      return getUnauthorizedError(res);
    }

    // Attach authenticated user to request object
    req.authenticatedUser = user;
    next();
  } catch (error) {
    return getUnauthorizedError(res);
  }
};

module.exports = { adminTokenVerification, tempTokenVerification, userTokenVerification, userTempTokenVerification };
