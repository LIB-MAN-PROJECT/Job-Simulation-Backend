const InternshipPost = require("../models/InternshipPostSchema");
const InternshipApplication = require("../models/InternshipApplicationSchema");

// POST: Create internship post (recruiter/admin only)
exports.createInternship = async (req, res, next) => {
  try {
    const { title, description, field, location, mode, deadline, companyName } =
      req.body;

    const internship = new InternshipPost({
      title,
      description,
      field,
      location,
      mode,
      deadline,
      companyId: req.user.companyId, // recruiter’s company
      companyName,
    });
    const saved = await internship.save();
    res.status(201).json({ message: "Internship created", internship: saved });
  } catch (error) {
    //     err.statusCode = 500;
    // err.message = "Error creating internship";
    // next(err);
    //  }

    console.error(" Full error:", error);

    return res.status(500).json({
      success: false,
      message: "Error sumiting task simulation",
      error: error.message,
      stack: error.stack,
      full: error,
    });
  }
};

// GET: All internship posts (students/public)
exports.getAllInternships = async (req, res, next) => {
  try {
    //  Extract filters and pagination params from query
    const { field, mode, location, companyName } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filter = {};

    //  Optional filters
    if (field) filter.field = { $regex: field, $options: "i" };
    if (mode) filter.mode = mode;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (companyName)
      filter.companyName = { $regex: companyName, $options: "i" };

    const skip = (page - 1) * limit;

    const internships = await InternshipPost.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // newest first

    const total = await InternshipPost.countDocuments(filter);

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      internships,
    });
  } catch (err) {
    err.statusCode = 500;
    err.message = "Error getting internships";
    next(err);
  }
};

// GET: Single internship by ID
exports.getInternshipById = async (req, res, next) => {
  try {
    const internship = await InternshipPost.findById(req.params.id);
    if (!internship)
      return res.status(404).json({ message: "Internship not found" });

    res.status(200).json(internship);
  } catch (err) {
    err.statusCode = 500;
    err.message = "Error getting imternship";
    next(err);
  }
};

// PUT: Update internship (recruiter only)
exports.updateInternship = async (req, res, next) => {
  try {
    const internship = await InternshipPost.findById(req.params.id);
    if (!internship)
      return res.status(404).json({ message: "Internship not found" });

    if (internship.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: "Not authorized to update" });
    }

    const updated = await InternshipPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({ message: "Internship updated", updated });
  } catch (err) {
    err.statusCode = 500;
    err.message = "Error updating internship";
    next(err);
  }
};

// DELETE: Delete internship (recruiter/admin only)
exports.deleteInternship = async (req, res, next) => {
  try {
    const internship = await InternshipPost.findById(req.params.id);
    if (!internship)
      return res.status(404).json({ message: "Internship not found" });

    if (
      req.user.role !== "admin" &&
      internship.companyId.toString() !== req.user.companyId.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }

    await InternshipPost.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Internship deleted" });
  } catch (err) {
    err.statusCode = 500;
    err.message = "Error deleting internship";
    next(err);
  }
};

exports.reviewInternshipApplication = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const { reviewStatus, reviewerComment } = req.body;

    if (!["accepted", "rejected"].includes(reviewStatus)) {
      return res.status(400).json({ message: "Invalid review status" });
    }

    const application = await InternshipApplication.findById(
      internshipId
    ).populate("internshipId");

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    //  check if recruiter belongs to the company

    application.reviewStatus = reviewStatus;
    application.reviewerComment = reviewerComment || "";

    await application.save();

    res
      .status(200)
      .json({ message: "Internship Application reviewed", application });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Failed to review Internship Application",
        error: err.message,
      });
  }
};
