const User = require("../models/userModel.model");
const Company = require("../models/companyModel.model");
const { errorMessage, successMessage } = require("../utils/responseHandler.util");
const Enroll = require("../models/enrollmentModel.model");
const Certificate = require("../models/certificateModel.model");
const JobSim = require("../models/jobSimulation.model");
const { InternshipPost,InternshipApplication } = require("../models/internshipModel.model");

// System Dashboard	Platform-wide stats: users, recruiters, applications
// Manage Users & Recruiters	Edit, ban, activate, or delete accounts
// All Users
// All recruiters
//All companies
// View All Simulations	Monitor and audit all recruiter-created content
// Role-Based Access Control	Set permissions for recruiters, users, sub-admins
// View & Export Data	Retrieve applications, tasks, progress data
// Moderation Logs	Record admin actions like deletions or approvals
// Admin Profile Settings	Manage account info and notification preferences
// Notification Management	Send platform-wide or role-based alerts

const getAppAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    if (totalUsers === 0) return errorMessage(res, 404, "No users found");

    const totalJobSims = await JobSim.countDocuments();
    if (totalJobSims === 0) return errorMessage(res, 404, "No job simulations found");

    const totalCompanies = await Company.countDocuments();
    if (totalCompanies === 0) return errorMessage(res, 404, "No companies using the service");

    const totalInternships = await InternshipPost.countDocuments();
    if (totalInternships === 0) return errorMessage(res, 404, "No internships posted");

    const totalInternshipApplications = await InternshipApplication.countDocuments();
    if (totalInternshipApplications === 0) return errorMessage(res, 404, "No internship applications found");

    return successMessage(res, 200, "Application analytics retrieved successfully", {
      totalUsers,
      totalJobSims,
      totalCompanies,
      totalInternships,
      totalInternshipApplications
    });
  } catch (error) {
    console.error("Analytics Error", error);
    return errorMessage(res, 500, "Internal Server Error", error);
  }
};


const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).lean();
    if (!students || students.length === 0) {
      return errorMessage(res, 404, "No students found");
    }

    return successMessage(res, 200, "Students retrieved successfully", students);
  } catch (error) {
    console.error("Analytics Error (getStudents):", error);
    return errorMessage(res, 500, "Internal Server Error", error);
  }
};

const getRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({ role: "recruiter" }).lean();
    if (!recruiters || recruiters.length === 0) {
      return errorMessage(res, 404, "No recruiters found");
    }

    return successMessage(res, 200, "Recruiters retrieved successfully", recruiters);
  } catch (error) {
    console.error("Analytics Error (getRecruiters):", error);
    return errorMessage(res, 500, "Internal Server Error", error);
  }
};

const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().lean();
    if (!companies || companies.length === 0) {
      return errorMessage(res, 404, "No companies found");
    }

    return successMessage(res, 200, "Companies retrieved successfully", companies);
  } catch (error) {
    console.error("Analytics Error (getCompanies):", error);
    return errorMessage(res, 500, "Internal Server Error", error);
  }
};


const verifyCompany = async(req,res) =>{
    const{companyId}= req.params

    try{
        const company = await Company.findById(companyId);
         
        if(!company){
             return errorMessage(res, 404, "Organization not found")
        }

        if(company.isVerified){
            return successMessage(res,200,"Recruiter already verified");
        }

        company.isVerified=true;
        await company.save();

        const verifiedCompany={
            id:company._id,
            companyName: company.companyName,
            isVerified: isVerified
        }

        return successMessage(res, 200, "Organization verified", verifiedCompany);
    }
    catch(error){
        console.error("Organization Verification Error", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }
}

const unverifyCompany= async(req,res) => {
     const { companyId } = req.params
    try {
        const company = await Company.findById(companyId);

        if (!company) {
            return errorMessage(res, 404, "Organization not found")
        }

        company.isVerified = false;
        await company.save();

        const unverifiedCompany ={
            id:company._id,
            companyName: company.companyName,
            isVerified
        }
        return successMessage(res, 200, "Organization unverified", unverifiedCompany);

    } catch (error) {
        console.error("Company Unverification Error", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }
} 

const verifyRecruiter = async (req, res) => {
    const { id } = req.params
    try {
        const recruiter = await User.findById(id);

        if (!recruiter) {
            return errorMessage(res, 404, "Recruiter not found")
        }
        // console.log("recruiter=",recruiter);
        // console.log("recruiter.isverified",recruiter.isVerified);

        if(recruiter.isVerified){
            return successMessage(res,200,"Recruiter already verified");
        }
        recruiter.isVerified = true;
        await recruiter.save();

        const verifiedRecruiter ={
            id:recruiter._id,
            userName:recruiter.userName,
            isVerified
        }
        return successMessage(res, 200, "Recruiter verified", verifiedRecruiter);

    } catch (error) {
        console.error("Recruiter Verification Error", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }
}

const unverifyRecruiter = async(req,res)=>{
    const { id } = req.params
    try {
        const recruiter = await User.findById(id);

        if (!recruiter) {
            return errorMessage(res, 404, "Recruiter not found")
        }

        recruiter.isVerified = false;
        await recruiter.save();

        const unverifiedRecruiter ={
            id:recruiter._id,
            userName:recruiter.userName,
            isVerified
        }
        return successMessage(res, 200, "Recruiter unverified", unverifiedRecruiter);

    } catch (error) {
        console.error("Recruiter Unverification Error", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }
}

module.exports = {verifyRecruiter,unverifyRecruiter,verifyCompany,unverifyCompany,getAppAnalytics,getCompanies,getStudents,getRecruiters}