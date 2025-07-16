const express = require("express");
const router = express.Router();
const taskController = require("../contollers/taskController");
const authMiddleware = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");
const taskCompletionController = require("../contollers/taskCompletionController");

//  CREATE task (only recruiter or admin)
// router.post(
//   "/",
//   authMiddleware,
//   authorizeRole("recruiter", "admin"),
//   taskController.createTask
// );

//  GET all tasks (admin/recruiter/user can view)
router.get("/", authMiddleware, taskController.getAllTasks);

// GET a single task by ID
router.get("/:id", taskController.getTaskById);

//  GET tasks for a specific simulation
router.get(
  "/simulation/:simulationId",
  authMiddleware,
  taskController.getTasksBySimulation
);

//  UPDATE task (only recruiter/admin)
router.put(
  "/:id",
  authMiddleware,
  authorizeRole("recruiter", "admin"),
  taskController.updateTask
);

//  DELETE task (only recruiter/admin)
router.delete(
  "/:id",
  authMiddleware,
  authorizeRole("recruiter", "admin"),
  taskController.deleteTask
);

// Mark task as complete
router.post(
  "/:taskId/complete",
  authMiddleware,
  authorizeRole("user"),
  taskCompletionController.markAsComplete
);


module.exports = router;
