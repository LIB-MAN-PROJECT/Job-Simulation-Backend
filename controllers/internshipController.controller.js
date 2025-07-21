const { InternshipPost,InternshipApplication } = require("../models/internshipModel.model");
const { errorMessage, successMessage } = require("../utils/responseHandler.util");
const { readData, WriteData } = require("../utils/fileHandler.util");
const { uploadFile, deleteFile } = require("../utils/uploadFile.util");




//Internship Post logic
const createInternshipPost = async (req, res) => {
    const { title, description, field, location, mode, deadline } = req.body

    try {
        const internshipPost = await InternshipPost.create({
            title,
            description,
            field,
            companyId: req.user.companyId,
            companyName: req.user.companyName,
            location,
            mode,
            deadline
        });

        return successMessage(res, 201, "Internship created successfully", internshipPost);
    } catch (error) {
        console.error("Creating Internship Error", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }
}

const editInternshipPost = async (req, res) => {
    const { title, description, field, location, mode, deadline } = req.body;
    const { internshipId } = req.params;

    try {
        const updates = {}
        if (title) updates.title = title;
        if (description) updates.description = description;
        if (field) updates.field = field;
        if (location) updates.location = location;
        if (mode) updates.mode = mode;
        if (deadline) updates.deadline = deadline;

        const updatedInternshipPost = await InternshipPost.findByIdAndUpdate(internshipId, { $set: updates }, { new: true });

        if (!updatedInternshipPost) {
            return errorMessage(res, 404, "Post not found");
        }
        return successMessage(res, 200, "Post edited successfully", updatedInternshipPost);
    } catch (error) {
        console.error("Edit Internship Error", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }
}

const deleteInternshipPost = async (req, res) => {
    const { internshipId } = req.params;
    try {
        const internshipPost = await InternshipPost.findByIdAndDelete(internshipId);
        if (!internshipPost) {
            return errorMessage(res, 404, "No Internship post")
        }
        return successMessage(res, 200, "Internship post Deleted");
    } catch (error) {
        console.error("Edit Internship Error", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }
}

//Viewing Internship Posts
const viewAllInternshipPosts = async (req, res) => {
    try {
        const internshipPosts = await InternshipPost.find();
        return successMessage(res, 200, "All post retrieved successfully", internshipPosts);
    } catch (error) {
        console.log("Getting All Sims error", error);
        console.error("Getting All Sims error", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }
}

const viewInternshipPostById = async (req, res) => {
    const { internshipId } = req.params;
    try {
        const internshipPosts = await InternshipPost.findById(internshipId);

        if (!internshipPosts) {
            return errorMessage(res, 404, "Post not found");
        }
        return successMessage(res, 200, "Job Simulation retrieved successfully", internshipPosts);
    } catch (error) {
        console.log("Getting Sims By Id error", error);
        console.error("Getting Sims By Id error", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }
}

//Internship Application
const applyForInternship = async (req, res) => {
    const { internshipId } = req.params;
    try {
        const internshipPost = await InternshipPost.findById(internshipId);
        if (!internshipPost) return errorMessage(res, 404, "Internship Post not found");

        console.log("Internship ID=:",internshipId);
         //checking file existence
        if(!req.file || !req.file.path){
        console.log("No valid file found");
        return errorMessage(res, 400, "File not provided or invalid");
        }

        //upload file
        const uploadedFile = await uploadFile(req,req.file.path,"upskill/internships/userCVs",res);

        //create application
        const internshipApplication= await InternshipApplication.create({
            userId: req.user.id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            internshipId:internshipId,
            userCv: uploadedFile.url,
            userCvPublicId:uploadedFile.public_id,
            applicationStatus:"Pending",
            appliedAt:Date.now(),
        });

        internshipPost.applicants.push(req.user.id);
        await internshipPost.save();

        return successMessage(res,200,"Applied successfully",internshipApplication);

    } catch (error) {
        console.error("Internship Application Error:", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }
}

//Search & filter
const searchInternships = async(req,res)=>{
    const { title,field, location, mode, deadline,companyName } = req.query;

    try {
        const filter={}

        if(title) filter.title = {$regex:title, $options:"i"};

        if(field) filter.field = {$regex:field, $options:"i"};

        if(location) filter.location = {$regex:location, $options:"i"};
        
        if(mode) filter.mode = {$regex:mode, $options:"i"};
        
        if(deadline) filter.deadline = {$regex:deadline, $options:"i"};
        
        if(companyName) filter.
        companyName = {$regex:companyName, $options:"i"};

        const internships = await InternshipPost.find(filter).sort({deadline:1});

        return successMessage(res,200,"Internships found",internships);

    } catch (error) {
        console.error("Internship search error:", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }
}

module.exports = { createInternshipPost, editInternshipPost, deleteInternshipPost, viewAllInternshipPosts, viewInternshipPostById,applyForInternship, searchInternships};