const express = require("express");
const router = express.Router();
const recruiterController = require("../controllers/recruiterController");
const authMiddleware = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

// Recruiter requesting to join a company
router.post(
  "/request-join",
  authMiddleware,
  authorizeRole("recruiter"),
  recruiterController.requestJoinCompany
);

module.exports = router;
