const express = require("express");
const router = express.Router();
const jobSimulationController = require("../contollers/jobSimulationController");
const authMiddleware = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole")
const upload = require("../middleware/upload"); 


// POST: Create a new job simulation (Recruiter only)
router.post(
  "/",
  authMiddleware,
  authorizeRole("recruiter","admin"),
  upload.any("tasks"), 
  jobSimulationController.jobSimulation
);

// GET: All job simulations with filters
router.get("/", jobSimulationController.getJobSimulation);


// GET: Job simulations created by the logged-in user
router.get("/my-simulations", authMiddleware, jobSimulationController.getJobSimulationByUserId);

// GET: Single job simulation by ID
router.get("/:id", jobSimulationController.jobSimulationById);


// PUT: Update a job simulation (Recruiter only, must be owner)
router.put(
  "/:id",
  authMiddleware,
  authorizeRole("recruiter", "admin"),
  upload.single("file"), 
  jobSimulationController.updateJobSimulation
);

// DELETE: Delete a job simulation (Recruiter only, must be owner)
router.delete(
  "/:id",
  authMiddleware,
  authorizeRole("recruiter", "admin"),
  jobSimulationController.deleteJobSimulation
);

module.exports = router;