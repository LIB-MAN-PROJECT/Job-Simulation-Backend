const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
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

router.post(
  "/request-to-join",
  authMiddleware,
  authorizeRole("recruiter"),
  companyController.requestToJoinCompany
);
router.post(
  "/approve-recruiter",
  authMiddleware,
  authorizeRole("admin", "recruiter"),
  companyController.approveRecruiter
);

module.exports = router;
