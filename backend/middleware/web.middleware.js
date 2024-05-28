// File: middleware/admin.middleware.js

const express = require("express");
const userAuthRoutes = require("../routes/webRoutes/user.routes");
const packageRoutes = require("../routes/webRoutes/package.routes");
const contactUsRoutes = require("../routes/webRoutes/contactUs.route");
const router = express.Router();

// User authentication routes
router.use("/user", userAuthRoutes);

// Package routes
router.use("/package", packageRoutes);

// Package routes
router.use("/contactUs", contactUsRoutes);

module.exports = router;
