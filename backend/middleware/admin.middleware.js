// File: middleware/admin.middleware.js

const express = require("express");
const adminAuthRoutes = require("../routes/admin/auth.routes");
const classRoutes = require("../routes/classMaster/class.routes");
const subjectRoutes = require("../routes/subject/subject.routes");
const studyMaterialRoutes = require("../routes/studyMaterialRoute/studyMaterial.routes");
const questionBank = require("../routes/questionBank/question.routes");
const ckFinderRoutes = require("../routes/ckFinder/ckFinder.routes");
const bannerRoutes = require("../routes/banner/banner.routes");
const mockTestRoutes = require("../routes/mockTest/mockTest.route");
const blogCategoryRoutes = require("../routes/blog/blogCategory.route");
const blogRoutes = require("../routes/blog/blog.route");
const authoRoutes = require("../routes/author/author.routes");
const testimonialRoutes = require("../routes/testimonial/testimonial.route");
const faqCategoryRoutes = require("../routes/faq/faqCategory.route");
const faqRoutes = require("../routes/faq/faq.route");
const packageRoutes = require("../routes/package/package.route");
const privacyPolicyRoutes = require("../routes/policyAndConditions/privacyPolicy.route");
const termsConditionsRoutes = require("../routes/policyAndConditions/termsConditions.route");
const cancellationPolicyRoutes = require("../routes/policyAndConditions/cancellationPolicy.route");
const userRoutes = require("../routes/user/user.route");

const router = express.Router();

// Admin authentication routes
router.use("/admin", adminAuthRoutes);

router.use("/ckFinder", ckFinderRoutes);

// Class routes
router.use("/class", classRoutes);

// Subject routes
router.use("/subject", subjectRoutes);

// Study Material routes
router.use("/studyMaterial", studyMaterialRoutes);

// Question Bank routes
router.use("/questionBank", questionBank);

// Banner routes
router.use("/banner", bannerRoutes);

// Mock Test routes
router.use("/mockTest", mockTestRoutes);

// Blog Category routes
router.use("/blogCategory", blogCategoryRoutes);

// Blog  routes
router.use("/blog", blogRoutes);

// Author routes
router.use("/author", authoRoutes);

// Testimonial routes
router.use("/testimonial", testimonialRoutes);

// Faq Category routes
router.use("/faqCategory", faqCategoryRoutes);

// Faq  routes
router.use("/faq", faqRoutes);

// Package routes
router.use("/package", packageRoutes);

// privacy Policy routes
router.use("/privacyPolicy", privacyPolicyRoutes);

// terms Conditions routes
router.use("/termsConditions", termsConditionsRoutes);

// cancellation Policy routes
router.use("/cancellationPolicy", cancellationPolicyRoutes);

// User routes
router.use("/user", userRoutes);

module.exports = router;
