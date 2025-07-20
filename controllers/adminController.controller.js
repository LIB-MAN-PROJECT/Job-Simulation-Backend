
const User = require("../models/userModel.model");
const Company = require("../models/companyModel.model");
const { errorMessage, successMessage } = require("../utils/responseHandler.util");

const verifyCompany = async(req,res) =>{

}

const verifyRecruiter = async (req, res) => {
    const { id } = req.params
    try {
        const recruiter = await User.findById(id);

        if (!recruiter) {
            return errorMessage(res, 404, "Recruiter not found")
        }
        console.log("recruiter=",recruiter);
        console.log("recruiter.isverified",recruiter.isVerified);

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

        const verifiedRecruiter ={
            id:recruiter._id,
            userName:recruiter.userName,
            isVerified
        }
        return successMessage(res, 200, "Recruiter unverified", verifiedRecruiter);

    } catch (error) {
        console.error("Recruiter Unverification Error", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }
}

module.exports = {verifyRecruiter,unverifyRecruiter}