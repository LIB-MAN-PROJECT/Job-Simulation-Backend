const Company = require("../models/companyModel.model");
const { errorMessage, successMessage } = require("../utils/responseHandler.util");
const { uploadFile, deleteFile } = require("../utils/uploadFile.util");
const codeGenerator = require("../utils/codeGenerator.util");

//Company-related logic
const createCompany = async (req, res) => {
    const { companyName, companyEmail, description, website } = req.body

    try {
        const uploadedFile = await uploadFile(req, req.file.path, "/upskill/companyLogos",res);

        const code = await codeGenerator(10);
        console.log("code = ", code)

        //send message
        const company = await Company.create({
            companyName,
            companyEmail,
            companyCode: code,
            description,
            logoUrl: uploadedFile.url,
            logoPublicId: uploadedFile.public_id,
            website,
        });

        return successMessage(res, 201, "Company registered successfully", company);
    } catch (error) {
        console.error("Company Registration Error", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }
}

const editCompany = async (req, res) => {
    const { companyName, companyEmail, description, website } = req.body
    const { id } = req.params

    try {

        const updates = {};
        if (companyName) updates.companyName = companyName;
        if (companyEmail) updates.companyEmail = companyEmail;
        if (description) updates.description = description;
        if (website) updates.website = website;

        //if file upload exits
        if (req.file?.path) {
            const company = await Company.findById(id);

            if (company.logoPublicId) {
                await deleteFile(company.logoPublicId);
            }

            //uploading new file
            const uploadedFile = await uploadFile(req, req.file.path, "/upskill/companyLogos",res);

            updates.logoUrl = uploadedFile.url;
            updates.logoPublicId = uploadedFile.public_id;
        }

        const updatedCompany = await Company.findByIdAndUpdate(id, { $set: updates }, { new: true });
        if(!updatedCompany){
            return errorMessage(res,404,"Organization not found")
        }
        successMessage(res, 200, "Organization edited successfully", updatedCompany);
    } catch (error) {
        console.error("Edit Organizaton Error:", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }
}

const deleteCompany = async(req,res)=>{
    const {id}=req.params;

    try {
       const company= Company.findByIdAndDelete(id);
       if(!company) return errorMessage(res,404,"Company Not found"); 
    } catch (error) {
         console.error("Company Deletion Error", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }
}

module.exports={createCompany,editCompany,deleteCompany}