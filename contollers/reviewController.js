const Review = require("../models/ReviewSchema");
const JobSimulation = require("../models/JobSimulationSchema");

// ✅ Submit a review (one per user per simulation)
exports.submitReview = async (req, res,next) => {
  try {
    const { simulationId, rating, comment } = req.body;
    const userId = req.user.id;

    // Prevent duplicate review
    const existing = await Review.findOne({ userId, simulation: simulationId });
    if (existing) {
      return res.status(400).json({ message: "You already reviewed this simulation." });
    }

    const simulation = await JobSimulation.findById(simulationId);
    if (!simulation) {
      return res.status(404).json({ message: "Simulation not found" });
    }

    const newReview = new Review({
      userId,
      userName: req.user.username,
      simulation: simulationId,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json({ message: "Review submitted successfully", review: newReview });
  } catch (err) {
    err.statusCode = 500;
err.message = "Error submitting review";
next(err);

  }
};

// ✅ Get all reviews (admin view maybe)
exports.getAllReviews = async (req, res,next) => {
  try {
    const reviews = await Review.find().populate("userId", "username");
    res.status(200).json(reviews);
  } catch (err) {
    err.statusCode = 500;
err.message = "Error getting reviews";
next(err);

  }
};

// ✅ Get reviews for a specific simulation
exports.getReviewsBySimulation = async (req, res,next) => {
  try {
    const simulationId = req.params.simulationId;

    const reviews = await Review.find({ simulation: simulationId }).populate("userId", "username");

    const averageRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.status(200).json({
      totalReviews: reviews.length,
      averageRating: Number(averageRating.toFixed(1)),
      reviews,
    });
  } catch (err) {
   err.statusCode = 500;
err.message = "Error getting reviews";
next(err);

  }
};

// DELETE: Remove a review (user only if it's theirs)
exports.deleteReview = async (req, res,next) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Allow deletion if user owns the review or is an admin
    if (review.userId.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
   
err.statusCode = 500;
err.message = "Error deleting review";
next(err);


  }
};
