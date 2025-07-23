const JobSim = require("../models/jobSimulation.model");
const { errorMessage, successMessage } = require("../utils/responseHandler.util");
const { readData, WriteData } = require("../utils/fileHandler.util");
const { uploadFile, deleteFile } = require("../utils/uploadFile.util");
const User=require("../models/userModel.model");
const {Task,TaskSubmission}=require("../models/taskModel.model");
const Enroll = require("../models/enrollmentModel.model");
const Certificate = require("../models/certificateModel.model");
const generateCertificate = require("../utils/generateCertificate.util");
//Permissions
//View created sims and internsip posts 
//request new codes and custom IDs


// Dashboard Overview	Quick stats on simulations, applicants, tasks
// Create & Manage Simulations	Post new job simulations and edit existing ones
// Manage Tasks	Add/edit/delete tasks for each simulation
// Review Task Submissions	View submitted tasks per user, add feedback
// Applicant Tracker	View applicants per simulation + application status
// Message Users	Send direct messages or notifications to candidates
// Recruiter Profile Settings	Update name, company info, logo, contact details
// Notification Center	Alerts for new applications or task submissions

//ADDDDDDD ANALYTICSSSSSS
const viewAllCompletedTasks = async(req,res)=>{
    try {
        const enrollments=await Enroll.find({isReadyForReview:true,reviewState:'Pending'})
        .select('userId simulationId taskSubmissions progress completedAt')
        .populate('userId', 'firstName lastName email')
        .populate('simulationId', 'title')
        .populate({
            path: 'taskSubmissions',
            match: { isSubmitted: true }, // Only include submitted tasks
            populate: {
            path: 'taskId',
            select: 'title completionScore'
            }
        })
        .sort({completedAt:1});//oldest first

        return successMessage(res, 200, 'Completed tasks retrieved successfully', enrollments);
    } catch (error) {
        console.error('Error fetching completed tasks:', error);
        return errorMessage(res, 500, 'Internal Server Error', error);
    }
}

const reviewEnrollment = async(req,res)=>{
    const {enrollmentId} = req.params;
    const {feedbackState,feedback}=req.body
    
    try {
        const enrollment = await Enroll.findById(enrollmentId);
        if(!enrollment) return errorMessage(res,404,"Enrollment not found");

        enrollment.isReviewed=true;
        enrollment.feedbackState=feedbackState;
        enrollment.reviewedAt=new Date();
        enrollment.feedback = feedback|| '';

        //generate certificate if reviewState is accepted
        await enrollment.save()
        return successMessage(res,200,`Tasks marks as "${feedbackState}"`,enrollment);
    } catch (error) {
        console.error('Enrollment review error:', error);
        return errorMessage(res, 500, 'Internal Server Error',error);
    }
}


// controllers/certificateController.js

/**
 * Generates certificate after accepted review
 */
const generateCertForEnrollment = async (req, res) => {
  const { enrollmentId } = req.params;

  try {
    const enrollment = await Enroll.findById(enrollmentId).populate('userId simulationId');
    if (!enrollment) return errorMessage(res, 404, 'Enrollment not found');
    if (enrollment.feedbackState !== 'Accepted') {
      return errorMessage(res, 400, 'Certificate can only be issued for accepted enrollments');
    }

    // 💡 Check if already issued
    const existing = await Certificate.findOne({ enrollmentId });
    if (existing) return errorMessage(res, 409, 'Certificate already issued for this enrollment');

    // 🛠️ Generate and send certificate
    const certMeta = await generateCertificate({
      nameOnCertificate: `${enrollment.userId.firstName} ${enrollment.userId.lastName}`,
      simulationName: enrollment.simulationId.title,
      userEmail: enrollment.userId.email,
      filenameBase: `cert_${enrollmentId}`
    });

    // 🗃️ Save metadata to certificate schema
    const certificate = await Certificate.create({
      enrollmentId,
      userId: enrollment.userId._id,
      simulationId: enrollment.simulationId._id,
      ...certMeta
    });

    return successMessage(res, 201, 'Certificate issued successfully', certificate);
  } catch (error) {
    console.error('Certificate generation error:', error);
    return errorMessage(res, 500, 'Internal Server Error');
  }
};

module.exports={viewAllCompletedTasks,reviewEnrollment,generateCertForEnrollment}
