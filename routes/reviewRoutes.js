const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const reviewController = require("../contollers/reviewController");
const authorizeRole = require("../middleware/authorizeRole")

router.post("/", auth, reviewController.submitReview); // POST review
router.get("/",authorizeRole("admin") ,reviewController.getAllReviews); // Admin or public
router.get("/simulation/:simulationId", reviewController.getReviewsBySimulation);
router.delete("/:id", auth, reviewController.deleteReview);

module.exports = router;