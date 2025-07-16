const Company = require("../models/CompanySchema");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

// Create a new company (with logo upload)
exports.createCompany = async (req, res,next) => {
  try {
    const { companyName, description, website } = req.body;
    let logoUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
        folder: "company_logos"
      });

// Delete the local file
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error("Failed to delete local file:", err);
          } else {
            console.log("Local file deleted:", file.path);
          }
        });

      logoUrl = result.secure_url;
      logoPublicId = result.public_id;
    }

    const company = new Company({
      companyName,
      description,
      website,
      logoUrl,
       logoPublicId,
      recruiters: [req.user.id]
    });

    const savedCompany = await company.save();

        // Update the recruiter's companyId
    await User.findByIdAndUpdate(req.user.id, {
      companyId: savedCompany._id,
    });

    res.status(201).json(savedCompany);
  } catch (err) {
   err.statusCode = 500;
err.message = "Error creating company";
next(err);

  }
};

// Update company logo or info
exports.updateCompany = async (req, res,next) => {
  try {
    const { companyName, description, website } = req.body;

    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    if (!company.recruiters.includes(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized" });
    }

    // Upload new logo if file exists
    if (req.file) {
        if (company.logoPublicId) {
    await cloudinary.uploader.destroy(company.logoPublicId);
  }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "company_logos"
      });


      company.logoUrl = result.secure_url;
        company.logoPublicId = result.public_id; 
    }

    company.companyName = companyName || company.companyName;
    company.description = description || company.description;
    company.website = website || company.website;

    const updated = await company.save();
    res.status(200).json({ message: "Company updated", company: updated });
  } catch (err) {
   err.statusCode = 500;
err.message = "Error updating company";
next(err);

  }
};

// Get all companies
exports.getAllCompanies = async (req, res,next) => {
  try {
    const companies = await Company.find().populate("recruiters", "name email");
    res.status(200).json(companies);
  } catch (err) {
err.statusCode = 500;
err.message = "Error getting company";
next(err);

  }
};

// Get a single company
exports.getCompanyById = async (req, res,next) => {
  try {
    const company = await Company.findById(req.params.id).populate("recruiters", "name email");
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json(company);
  } catch (err) {
    err.statusCode = 500;
err.message = "Error getting company";
next(err);

  }
};

// Delete a company
exports.deleteCompany = async (req, res,next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    if (company.logoPublicId) {
      await cloudinary.uploader.destroy(company.logoPublicId);
    }

    await company.deleteOne();
    res.status(200).json({ message: "Company deleted" });
  } catch (err) {
    err.statusCode = 500;
err.message = "Error deleting company";
next(err);

  }
};

