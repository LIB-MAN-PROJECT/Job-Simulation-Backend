const express = require("express");
const router = express.Router();
const controller = require("../contollers/internshipApplicationController");
const authMiddleware = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

// Apply to an internship (student)
router.post("/", authMiddleware, authorizeRole("student"), controller.applyToInternship);

// Get all applications (admin/recruiter)
router.get("/", authMiddleware, authorizeRole("admin", "recruiter"), controller.getAllApplications);

// Get user's own applications
router.get("/my-applications", authMiddleware, authorizeRole("student"), controller.getMyApplications);

// Update application status (recruiter/admin)
router.put("/:id/status", authMiddleware, authorizeRole("recruiter", "admin"), controller.updateApplicationStatus);

module.exports = router;
