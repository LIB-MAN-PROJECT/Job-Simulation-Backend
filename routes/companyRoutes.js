const express = require("express");
const router = express.Router();
const companyController = require("../contollers/companyController");
const authMiddleware = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");
const upload = require("../middleware/upload");


// Create a company (recruiter only)
router.post(
  "/",
  authMiddleware,
  authorizeRole("recruiter", "admin"),
  upload.single("logoUrl"),
  companyController.createCompany
);

// Get all companies
router.get("/", companyController.getAllCompanies);

// Get a single company
router.get("/:id", companyController.getCompanyById);

// Update a company (only recruiter of the company or admin)
router.put(
  "/:id",
  authMiddleware,
  authorizeRole("recruiter", "admin"),
  upload.single("logo"),
  companyController.updateCompany
);

// Delete company (admin only)
router.delete(
  "/:id",
  authMiddleware,
  authorizeRole("admin"),
  companyController.deleteCompany
);

module.exports = router;
