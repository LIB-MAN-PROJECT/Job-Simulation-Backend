const express = require("express");
const router = express.Router();
const internshipPostController = require("../controllers/internshipPostController");
const authMiddleware = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

// Create internship post (recruiter/admin)
router.post(
  "/",
  authMiddleware,
  authorizeRole("recruiter", "admin"),
  internshipPostController.createInternship
);

// Get all internship posts
router.get("/", internshipPostController.getAllInternships);

// Get single internship by ID
router.get("/:id", internshipPostController.getInternshipById);

// Update internship post
router.put(
  "/:id",
  authMiddleware,
  authorizeRole("recruiter", "admin"),
  internshipPostController.updateInternship
);

// Delete internship post
router.delete(
  "/:id",
  authMiddleware,
  authorizeRole("recruiter", "admin"),
  internshipPostController.deleteInternship
);

// review application
router.put(
  "/review/:internshipId",
  authMiddleware,
  authorizeRole("recruiter", "admin"),
  internshipPostController.reviewInternshipApplication
);

module.exports = router;
