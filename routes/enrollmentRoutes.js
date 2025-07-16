const express = require("express");
const router = express.Router();
const enrollmentController = require("../contollers/enrollmentController");
const authMiddleware = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

// Enroll (students only)
router.post("/", authMiddleware, authorizeRole("student"), enrollmentController.enrollInSimulation);

// Get current user's enrollments
router.get("/user-enrollment", authMiddleware, enrollmentController.getMyEnrollments);

// Recruiter/Admin gets list of users enrolled in a simulation
router.get("/:simulationId/enrollments", authMiddleware, authorizeRole("recruiter", "admin"), enrollmentController.getEnrolledUsers);

// Unenroll
router.delete("/:simulationId", authMiddleware, authorizeRole("student"), enrollmentController.unenroll);

module.exports = router;
