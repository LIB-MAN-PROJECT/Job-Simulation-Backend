const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const taskSubmissionController = require("../contollers/taskSubmissionController");
const authorizeRole = require("../middleware/authorizeRole")

// Submit a task
router.post("/submit/:taskId", authMiddleware, taskSubmissionController.submitTask);

// submiting multiple tasks

router.post('/submit-multiple', authMiddleware, taskSubmissionController.submitMultipleTasks);

// View user's submissions
router.get("/my-submissions", authMiddleware, taskSubmissionController.getUserSubmissions);

router.put(
  "/mark/:submissionId",
  authMiddleware,
  authorizeRole("recruiter", "admin"),
  taskSubmissionController.markTaskSubmission
);


module.exports = router;
