const InternshipApplication = require("../models/InternshipApplicationSchema");
const InternshipPost = require("../models/InternshipPostSchema"); 
const User = require("../models/UserSchema");

// POST: Apply to an internship
exports.applyToInternship = async (req, res,next) => {
  try {
    const { internshipId, userCv } = req.body;
    const userId = req.user.id;

    // Check if already applied
    const existingApp = await InternshipApplication.findOne({
      userId,
      internshipId,
    });
    if (existingApp) {
      return res.status(400).json({ message: "You already applied to this internship" });
    }

    

    // Get user info (for name)
    const user = await User.findById(userId);

    const application = new InternshipApplication({
      userId,
      userName: user.firstName + " " + user.lastName,
      internshipId,
      userCv,
    });

    const saved = await application.save();
    res.status(201).json({ message: "Application submitted", application: saved });
  } catch (err) {
    err.statusCode = 500;
err.message = "failed to apply";
next(err);

  }
};

// GET: All applications (admin/recruiter)
exports.getAllApplications = async (req, res,next) => {
  try {
    const applications = await InternshipApplication.find()
      .populate("userId", "email")
      .populate("internshipId", "title");

    res.status(200).json(applications);
  } catch (err) {
    err.statusCode = 500;
err.message = "Error fetching applicants";
next(err);

  }
};

// GET: Applications by user
exports.getMyApplications = async (req, res,next) => {
  try {
    const myApps = await InternshipApplication.find({ userId: req.user.id })
      .populate("internshipId", "title");

    res.status(200).json(myApps);
  } catch (err) {
    err.statusCode = 500;
err.message = "Error fetching applicants";
next(err);

  }
};

// PUT: Update application status (recruiter only)
exports.updateApplicationStatus = async (req, res,next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await InternshipApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Application not found" });

    res.status(200).json({ message: "Application status updated", updated });
  } catch (err) {
    
    err.statusCode = 500;
err.message = "Error updating internship application ";
next(err);

  }
};
