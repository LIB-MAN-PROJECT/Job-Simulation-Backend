// middleware/upload.js
const multer = require("multer");
const path = require("path");

// Use disk storage temporarily before uploading to Cloudinary
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Accept only image and document file types
const fileFilter = (req, file, cb) => {
  const allowedExt = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type. Allowed: JPG, PNG, PDF, DOC, DOCX."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Max 10MB
  },
});

module.exports = upload;
