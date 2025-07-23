const User = require("../models/userModel.model");
const Company = require("../models/companyModel.model");
const { errorMessage, successMessage } = require("../utils/responseHandler.util");


// System Dashboard	Platform-wide stats: users, recruiters, applications
// Manage Users & Recruiters	Edit, ban, activate, or delete accounts
// View All Simulations	Monitor and audit all recruiter-created content
// Role-Based Access Control	Set permissions for recruiters, users, sub-admins
// View & Export Data	Retrieve applications, tasks, progress data
// Moderation Logs	Record admin actions like deletions or approvals
// Admin Profile Settings	Manage account info and notification preferences
// Notification Management	Send platform-wide or role-based alerts

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

module.exports = {verifyRecruiter,unverifyRecruiter,verifyCompany,unverifyCompany}