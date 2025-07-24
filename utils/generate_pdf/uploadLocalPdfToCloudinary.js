const cloudinary = require("../../config/cloudinary.config");

const fs = require('fs').promises;

const uploadLocalPdfToCloudinary = async (filePath, filenameBase) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      public_id: `upskill/certificates/${filenameBase}`,
      format: "pdf",
      transformation: [{ flags: "attachment:Certificate" }]
    });

    // 🧹 Delete local file (await-style)
    await fs.unlink(filePath);
    console.log("✅ Local file deleted:", filePath);

    const downloadUrl = result.secure_url.replace("/upload/", "/upload/fl_attachment/");

    return {
      certUrl: result.secure_url,
      downloadUrl,
      certPublicId: result.public_id,
      certIssuedAt: new Date()
    };
  } catch (error) {
    console.error("🚨 Upload or deletion failed:", error);
    throw error;
  }
};


module.exports = uploadLocalPdfToCloudinary;
