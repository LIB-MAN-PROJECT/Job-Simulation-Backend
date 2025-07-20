const { errorMessage } = require("./responseHandler.util");
const cloudinary = require("../config/cloudinary.config");
const fs=require("fs/promises");

const uploadFile = async(req,filePath,folderName,res) =>{
    let fileData = null;
    try {
        
        if(!req.file || !req.file.path){
            console.log("No valid file found");
            return errorMessage(res, 400, "File not provided or invalid");
        }
        
        const file = await cloudinary.uploader.upload(req.file.path,{resource_type: "auto",folder: folderName});
        const fileData ={
            public_id:file.public_id,
            url: file.secure_url,
            filename: file.original_filename
        }

        if (!file?.url) {
        return errorMessage(res, 500, "File upload failed");
        }

        return fileData;
        
    } catch (error) {
        console.error("Upload File Util Error",error);
        return errorMessage(res,500,"Internal Server Error",error)
    }

    finally{
        console.log("filepath=",filePath)
        if(filePath){
            try {
                await fs.unlink(filePath);
                console.log("file cleared");
            } catch (err) {
                console.warn("Local file cleanup failed:", err);
            }
        }
    }
}

const deleteFile = async (publicId) => {
    
    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.error("Cloudinary Delete Error")
        return errorMessage(res,500,"Internal Server Error");
    }
}

module.exports= {uploadFile,deleteFile}