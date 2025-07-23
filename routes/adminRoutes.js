const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/auth");
const authorizeRole = require("../middleware/authorizeRole");

// Admin-only routes
router.put(
  "/approve-company/:id",
  authMiddleware,
  authorizeRole("admin"),
  adminController.approveCompany
);

router.put(
  "/approve-recruiter",
  authMiddleware,
  authorizeRole("admin"),
  adminController.approveRecruiter
);

router.get("/pending-companies",authMiddleware,
  authorizeRole("admin"), adminController.getPendingCompanies);

router.get("/pending-recruiters",authMiddleware,
  authorizeRole("admin"),  adminController.getPendingRecruiters);

router.patch("/approve-company/:id",authMiddleware,
  authorizeRole("admin"), adminController.approveCompany);

router.patch("/approve-recruiter/:id",authMiddleware,
  authorizeRole("admin"), adminController.approveRecruiter);

  router.put("/recruiters/:recruiterId/approve", adminController.approveRecruiter);
router.put("/recruiters/:recruiterId/disapprove", adminController.disapproveRecruiter);



module.exports = router;
