const { errorMessage } = require("./responseHandler.util");
const cloudinary = require("../config/cloudinary.config");
const fs=require("fs/promises");

const uploadFile = async(req,filePath,folderName,res) =>{
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

/**
 * Uploads a certificate buffer to Cloudinary
 * @param {Buffer} buffer - The PDF file buffer
 * @param {string} folder - Cloudinary folder path
 * @param {string} filename - Desired public filename (without extension)
 * @returns {Object} - Upload response with public_id, secure_url, etc.
 */
const uploadCertificate = async (buffer, folder, filename) => {
  try {
    const uploadResult = await cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        resource_type: 'raw', // raw = for PDFs or any file type
        format: 'pdf'
      },
      (error, result) => {
        if (error) throw error;
        return result;
      }
    );

    // Pipe the buffer manually into the upload stream
    const stream = require('stream');
    const readableStream = new stream.PassThrough();
    readableStream.end(buffer);
    readableStream.pipe(uploadResult);

    return new Promise((resolve, reject) => {
      uploadResult.on('finish', resolve);
      uploadResult.on('error', reject);
    });

  } catch (err) {
    console.error('📁 Cloudinary upload failed:', err);
    throw err;
  }
};



module.exports= {uploadFile,deleteFile,uploadCertificate}