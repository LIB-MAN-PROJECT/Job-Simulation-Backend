const { IntershipPost, InternshipApplication } = require("../models/internshipModel.model");
const { errorMessage, successMessage } = require("../utils/responseHandler.util");
const JobSim= require("../models/jobSimulation.model")
const Enroll = require("../models/enrollmentModel.model");

//user permissions view,enroll into job simulations, apply for internships
//view enrolled sims,internships applied,certificates gained, unenroll from sim
//edit user details,send messages to recruiters 

// View Profile Info	Display name, email, role, and profile picture

// controllers/user.controller.js
const User = require("../models/userModel.model");
const Certificate = require("../models/certificateModel.model");

const getUserStats = async (req, res) => {
  const userId = req.user.id;

  try {
    // Count total simulations enrolled
    const totalSimulationsEnrolled = await Enroll.countDocuments({ userId });

    // Count total internship applications
    const totalInternshipsApplied = await InternshipApplication.countDocuments({ userId });

    return successMessage(res, 200, "User stats retrieved successfully", {
      totalSimulationsEnrolled,
      totalInternshipsApplied
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return errorMessage(res, 500, "Internal Server Error", error);
  }
};

/**
 * GET Req
 * View logged-in user's profile data
 */
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Only fetch selected safe fields
    const user = await User.findById(userId).select(
      "firstName lastName email phone password role createdAt"
    );

    if (!user) {
      return errorMessage(res, 404, "User not found");
    }

    return successMessage(res, 200, "User profile retrieved", user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return errorMessage(res, 500, "Internal Server Error", error);
  }
};

// Edit Profile	details
// Simulation Enrollment Tracker	List of enrolled simulations with progress status
const getEnrolledSimulations = async (req, res) => {
  const userId = req.user.id;

  try {
    const enrolledSims = await Enroll.find({ userId })
      .select("simulationId progress") // Ensure progress is included
      .populate("simulationId")        // Optional: add simulation details
      .lean();

    if (!enrolledSims || enrolledSims.length === 0) {
      return errorMessage(res, 404, "You have not enrolled in any simulations");
    }

    return successMessage(res, 200, "Enrolled simulations retrieved", enrolledSims);
  } catch (error) {
    console.error("Error fetching enrolled simulations:", error);
    return errorMessage(res, 500, "Internal Server Error", error);
  }
};

const getEnrolledSimulationsById = async (req, res) => {
  const userId = req.user.id;
  const { enrollmentId } = req.params;

  try {
    const enrolledSim = await Enroll.findOne({ _id: enrollmentId, userId }).lean();

    if (!enrolledSim) {
      return errorMessage(res, 404, "Enrollment not found or access denied");
    }
    return successMessage(res, 200, "Enrolled simulation retrieved successfully", enrolledSim);
  } catch (error) {
    console.error("Error fetching enrolled simulation:", error);
    return errorMessage(res, 500, "Internal Server Error", error);
  }
};


// Task Submission History	View submitted tasks per simulation
// Notifications Center	Alerts for reviews, recruiter messages, updates
// Upload CV / Resume	For internship and simulation applications
// Application History	Track internships or jobs applied to
const getAppliedInternships = async (req, res) => {
  const userId = req.user.id;
  try {
    const applications = await InternshipApplication.find({ userId });

    if (!applications || applications.length === 0) {
      return errorMessage(res, 404, "You have not applied to any internships");
    }

    return successMessage(res, 200, "Applications retrieved successfully", applications);
  } catch (error) {
    console.error("Error fetching internship applications:", error);
    return errorMessage(res, 500, "Internal Server Error", error);
  }
};

// certificates 
const getCertificates = async(req,res)=>{
    const userId = req.user.id

    try {
        const certificates = await Certificate.find({userId});

        if(!certificates || certificates.length===0) return errorMessage(res,404,"No certificates issued");

        return successMessage(res,200,"Certificates retrieved successfully",certificates);
    } catch (error) {
    console.error("Error fetching certificates:", error);
    return errorMessage(res, 500, "Internal Server Error", error);
    }
}
// Review Feedback	View recruiter responses on tasks or simulations

module.exports = {getUserProfile,getAppliedInternships,getCertificates,getEnrolledSimulations,getUserStats,getEnrolledSimulationsById};