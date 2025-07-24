const JobSim = require("../models/jobSimulation.model");
const { errorMessage, successMessage } = require("../utils/responseHandler.util");
const { readData, WriteData } = require("../utils/fileHandler.util");
const { uploadFile, deleteFile } = require("../utils/uploadFile.util");
const User = require("../models/userModel.model");
const { Task, TaskSubmission } = require("../models/taskModel.model");
const Enroll = require("../models/enrollmentModel.model");
const Certificate = require("../models/certificateModel.model");
const generateCertificate = require("../utils/generateCertificate.util");
const { InternshipPost, InternshipApplication } = require("../models/internshipModel.model");


// Dashboard Overview	Quick stats on simulations, applicants, tasks
// Create & Manage Simulations	Post new job simulations and edit existing ones
// Manage Tasks	Add/edit/delete tasks for each simulation
// Review Task Submissions	View submitted tasks per user, add feedback
// Applicant Tracker	View applicants per simulation + application status
// Message Users	Send direct messages or notifications to candidates
// Recruiter Profile Settings	Update name, company info, logo, contact details
// Notification Center	Alerts for new applications or task submissions

//ADDDDDDD ANALYTICSSSSSS
const getRecruiterAnalytics = async (req, res) => {
  const companyId = req.user.companyId
  try {
    // Count simulations
    const totalSimulations = await JobSim.countDocuments({ companyId });

    // Get simulation IDs for other lookups
    const simulationIds = await JobSim.find({ companyId }).distinct("_id");

    // Count users enrolled in simulations
    const enrolledUsersCount = await Enroll.countDocuments({ simulationId: { $in: simulationIds } });

    // Count internships
    const totalInternships = await InternshipPost.countDocuments({ companyId });

    // Get internship IDs to count applicants
    const internshipIds = await InternshipApplication.find({ companyId }).distinct("_id");

    // Count internship applicants
    const internshipApplicantsCount = await InternshipApplication.countDocuments({
      internshipId: { $in: internshipIds }
    });

    // Count certificates issued
    const totalCertificates = await Certificate.countDocuments({ simulationId: { $in: simulationIds } });

    return successMessage(res, 200, "Company stats retrieved successfully", {
      totalSimulations,
      enrolledUsersCount,
      totalInternships,
      internshipApplicantsCount,
      totalCertificates
    });
  } catch (error) {
    console.error("Error fetching company stats:", error);
    return errorMessage(res, 500, "Internal Server Error", error);
  }
};

//All simulations made by Company
const getAllSimulationsByCompany = async (req, res) => {
  const companyId = req.user.companyId;

  try {
    const simulations = await JobSim.find({ companyId }).lean();

    if (!simulations || simulations.length === 0) {
      return errorMessage(res, 404, "No simulations found for your company");
    }

    return successMessage(res, 200, "All company simulations retrieved", simulations);
  } catch (error) {
    console.error("Error retrieving simulations for recruiter:", error);
    return errorMessage(res, 500, "Internal Server Error", error);
  }
};

//Find single Simulation
const getSingleCompanySimulationWithTasks = async (req, res) => {
  const { simulationId } = req.params;
  const companyId = req.user.companyId;

  try {
    const simulation = await JobSim.findOne({ _id: simulationId, companyId })
      .populate("tasks")
      .lean();

    if (!simulation) {
      return errorMessage(res, 404, "Simulation not found or access unauthorized");
    }

    return successMessage(res, 200, "Simulation retrieved successfully", simulation);
  } catch (error) {
    console.error("Error fetching simulation:", error);
    return errorMessage(res, 500, "Internal Server Error", error);
  }
};

//Get List of all simulation participants
const getAllParticipantsByCompanyId = async (req, res) => {
  const companyId = req.user.companyId;

  try {
    const simulations = await JobSim.find({ companyId }).select("participants").lean();
    if (!simulations || simulations.length === 0) {
      return errorMessage(res, 404, "No simulations found for this company");
    }

    const participantIds = simulations.flatMap(sim => sim.participants || []);
    const uniqueUserIds = [...new Set(participantIds.map(id => id.toString()))];

    if (uniqueUserIds.length === 0) {
      return errorMessage(res, 404, "No participants found across company simulations");
    }

    const participants = await User.find({ _id: { $in: uniqueUserIds } })
      .select("firstName lastName email role")
      .lean();

    return successMessage(res, 200, "Company simulation participants retrieved", {
      totalParticipants: participants.length,
      participants
    });
  } catch (error) {
    console.error("Error fetching participants by company:", error);
    return errorMessage(res, 500, "Internal Server Error", error);
  }
};

//get list of all internships
const getAllInternshipsByCompanyId = async (req, res) => {
  const companyId = req.user.id

  try {
    const internships = await InternshipPost.find({ companyId }).lean();
    if (!internships || internships.length === 0) {
      return errorMessage(res, 404, "No internships found for this company");
    }

    return successMessage(res, 200, "Internships retrieved successfully", internships);
  } catch (error) {
    console.error("Error retrieving internships by companyId:", error);
    return errorMessage(res, 500, "Internal Server Error", error);
  }
};

//get details of single internship
const getSingleCompanyInternshipById = async (req, res) => {
  const { internshipId } = req.params;
  const companyId = req.user.companyId;

  try {
    const internship = await InternshipPost.findOne({ _id: internshipId, companyId }).populate("applicants", "firstName lastName email")
      .lean();

    if (!internship) {
      return errorMessage(res, 404, "Internship not found for your company");
    }

    return successMessage(res, 200, "Internship retrieved successfully", internship);
  } catch (error) {
    console.error("Error retrieving internship by company ID and internship ID:", error);
    return errorMessage(res, 500, "Internal Server Error", error);
  }
};

//Get list of all Internship Applicanst
const getAllInternshipsApplicants = async (req, res) => {
  const { internshipId } = req.params;

  try {
    const applicants = await InternshipApplication.find({ internshipId })
      .populate("userId", "firstName lastName email")
      .lean();

    if (!applicants || applicants.length === 0) {
      return errorMessage(res, 404, "No applicants found for this internship");
    }

    return successMessage(res, 200, "Applicants retrieved successfully", applicants);
  } catch (error) {
    console.error("Error retrieving internship applicants:", error);
    return errorMessage(res, 500, "Internal Server Error", error);
  }
};

//Permissions
//View created sims and internsip posts 
//request new codes and custom IDs
const viewAllTasks = async (req, res) => {
  try {
    const enrollments = await Enroll.find()
      .select('taskSubmissions progress completedAt feedbackState')
      .populate('userId', 'firstName lastName email')
      .populate('simulationId', 'title')
      .populate({
        path: 'taskSubmissions',
        match: { isSubmitted: true },
        populate: {
          path: 'taskId',
          select: 'title completionScore'
        }
      })
      .sort({ completedAt: 1 });//oldest first
    console.log("Enrollments=", enrollments);
    return successMessage(res, 200, 'Completed tasks retrieved successfully', enrollments);
  } catch (error) {
    console.error('Error fetching completed tasks:', error);
    return errorMessage(res, 500, 'Internal Server Error', error);
  }
}

const reviewEnrollment = async (req, res) => {
  const { enrollmentId } = req.params;
  const { feedbackState, feedback } = req.body

  try {
    const enrollment = await Enroll.findById(enrollmentId);
    if (!enrollment) return errorMessage(res, 404, "Enrollment not found");

    enrollment.isReviewed = true;
    enrollment.feedbackState = feedbackState;
    enrollment.reviewedAt = new Date();
    enrollment.feedback = feedback || '';

    //generate certificate if reviewState is accepted
    await enrollment.save()
    return successMessage(res, 200, `Tasks marks as "${feedbackState}"`, enrollment);
  } catch (error) {
    console.error('Enrollment review error:', error);
    return errorMessage(res, 500, 'Internal Server Error', error);
  }
}


// controllers/certificateController.js

/**
 * Generates certificate after accepted review
 */
const sendEmail = require("../utils/sendEmail")
// const generateCertForEnrollment = async (req, res) => {
//   const { enrollmentId } = req.params;

//   try {
//     const enrollment = await Enroll.findById(enrollmentId).populate('userId simulationId');
//     if (!enrollment) return errorMessage(res, 404, 'Enrollment not found');
//     if (enrollment.feedbackState !== 'Accepted') {
//       return errorMessage(res, 400, 'Certificate can only be issued for accepted enrollments');
//     }

//     // 💡 Check if already issued
//     // const existing = await Certificate.findOne({ enrollmentId });
//     // if (existing) return errorMessage(res, 409, 'Certificate already issued for this enrollment');

//     // 🛠️ Generate and send certificate
//     const certMeta = await generateCertificate({
//       nameOnCertificate: `${enrollment.userId.firstName} ${enrollment.userId.lastName}`,
//       simulationName: enrollment.simulationId.title,
//       userEmail: enrollment.userId.email,
//       filenameBase: `cert_${enrollmentId}`
//     });

//     // 🗃️ Save metadata to certificate schema
//     const certificate = await Certificate.create({
//       enrollmentId,
//       userId: enrollment.userId._id,
//       simulationId: enrollment.simulationId._id,
//       ...certMeta
//     });

//     return successMessage(res, 201, 'Certificate issued successfully', certificate);
//   } catch (error) {
//     console.error('Certificate generation error:', error);
//     return errorMessage(res, 500, 'Internal Server Error');
//   }
// };

const generatePdfLocally = require("../utils/generate_pdf/generatePdfLocally");
const uploadLocalPdfToCloudinary = require("../utils/generate_pdf/uploadLocalPdfToCloudinary");
const path = require("path");

const generateAndUploadCertificate = async (req, res) => {
  const { enrollmentId } = req.params;

  try {
    const enrollment = await Enroll.findById(enrollmentId).populate("userId simulationId");
    if (!enrollment) return errorMessage(res, 404, "Enrollment not found");
    if (enrollment.feedbackState !== "Accepted") {
      return errorMessage(res, 400, "Certificate can only be issued for accepted enrollments");
    }

    // 💡 Optional check for duplicates
    // const existing = await Certificate.findOne({ enrollmentId });
    // if (existing) return errorMessage(res, 409, "Certificate already issued");

    const userName = `${enrollment.userId.firstName} ${enrollment.userId.lastName}`;
    console.log("username=", userName)
    const simulationName = enrollment.simulationId.title;
    console.log("simulationName=", simulationName)
    const userEmail = enrollment.userId.email;
    const filenameBase = `cert_${enrollmentId}_${Date.now()}`;
    console.log("fileNameBase=", filenameBase);
    const outputFolder = path.join(__dirname, "../certificates");
    console.log("outputFolder")
    console.log("outputFolder", outputFolder);

    // 📝 Step 1: Generate PDF and save locally
    const localPdfPath = await generatePdfLocally({
      nameOnCertificate: userName,
      simulationName,
      outputFolder
    });
    console.log("localPdfPath", localPdfPath);

    // ☁️ Step 2: Upload local file to Cloudinary
    const certMeta = await uploadLocalPdfToCloudinary(localPdfPath, filenameBase);

    // 🗂️ Step 3: Save to database
    const certificate = await Certificate.create({
      userId: enrollment.userId._id,
      fullName: userName,
      simulationId: enrollment.simulationId._id,
      enrollmentId,
      certUrl: certMeta.certUrl,
      certPublicId: certMeta.certPublicId,
      downloadUrl: certMeta.downloadUrl,
      issuedAt: certMeta.certIssuedAt
    });

    const emailHTML = `
      <h2>🎓 Certificate of Completion</h2>
      <p>Hi ${userName},</p>
      <p>You’ve successfully completed <strong>${simulationName}</strong>.</p>
      <p>Your certificate is ready: <a href="${certMeta.downloadUrl}" target="_blank">Click to Download</a></p>
      <br/>
      <p>Congratulations again!<br/>Upskill Team</p>
    `;

    await sendEmail({
      to: userEmail,
      subject: "Your Certificate of Completion",
      html: emailHTML
    });

    return successMessage(res, 201, "Certificate issued successfully", certificate);

  } catch (error) {
    console.error("🚨 Certificate generation error:", error);
    return errorMessage(res, 500, "Internal Server Error", error);
  }
};



module.exports = { viewAllTasks, reviewEnrollment, getRecruiterAnalytics, getAllSimulationsByCompany, getSingleCompanySimulationWithTasks, getAllParticipantsByCompanyId, getAllInternshipsByCompanyId, getSingleCompanyInternshipById, getAllInternshipsApplicants, generateAndUploadCertificate }
