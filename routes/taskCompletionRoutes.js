const express = require("express");
const router = express.Router();
const taskCompletionController = require("../contollers/taskCompletionController");
const authMiddleware = require("../middleware/auth");

// POST: Mark a task as completed by the user
router.post(
  "/:taskId/complete",
  authMiddleware,
  taskCompletionController.markAsComplete
);

module.exports = router;