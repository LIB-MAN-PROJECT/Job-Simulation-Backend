const Company = require("../models/CompanySchema");
const User = require("../models/UserSchema");
const { sendEmail } = require("../utils/email");




exports.approveCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    company.isApproved = true;
    await company.save();

    await sendEmail(
  company.email,
  "Company Approved",
  `<p>Your company <strong>${company.companyName}</strong> has been approved and is now visible in the platform.</p>`
);

    res.status(200).json({ message: "Company approved" });
  } catch (err) {
    err.statusCode = 500;
    err.message = "Error approving company";
    next(err);
  }
};

exports.approveRecruiter = async (req, res, next) => {
  try {
    const { companyId, recruiterId } = req.body;

    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    // Check if recruiter is in pending list
    if (!company.pendingRecruiters.includes(recruiterId)) {
      return res.status(400).json({ message: "Recruiter not pending approval" });
    }

    // Move recruiter from pending to approved list
    company.recruiters.push(recruiterId);
    company.pendingRecruiters = company.pendingRecruiters.filter(id => id.toString() !== recruiterId);

    await company.save();

    

    res.status(200).json({ message: "Recruiter approved", company });
  } catch (err) {
    err.statusCode = 500;
    err.message = "Error approving recruiter";
    next(err);
  }
};

exports.disapproveRecruiter = async (req, res, next) => {
  try {
    const recruiter = await User.findById(req.params.recruiterId);
    if (!recruiter || recruiter.role !== "recruiter") {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    recruiter.isApproved = false; // Mark as not approved
    await recruiter.save();

    // ✅ Send disapproval email
    await sendEmail(
      recruiter.email,
      "Recruiter Account Disapproved",
      `<p>Hi ${recruiter.firstName || "there"},</p>
       <p>We're sorry, but your recruiter account request has been disapproved by the admin. You can contact support for more details.</p>`
    );

    res.status(200).json({ message: "Recruiter disapproved and notified" });
  } catch (err) {
    err.statusCode = 500;
    err.message = "Failed to disapprove recruiter";
    next(err);
  }
};


// 1. List companies where isApproved = false
exports.getPendingCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ isApproved: false }).populate("recruiters", "name email");
    res.status(200).json(companies);
  } catch (err) {
    err.statusCode = 500;
    err.message = "Error fetching pending companies";
    next(err);
  }
};

// 2. List recruiters where role = recruiter and isApproved = false
exports.getPendingRecruiters = async (req, res, next) => {
  try {
    const recruiters = await User.find({ role: "recruiter", isApproved: false }).select("name email");
    res.status(200).json(recruiters);
  } catch (err) {
    err.statusCode = 500;
    err.message = "Error fetching pending recruiters";
    next(err);
  }
};

// Approve a pending company
exports.approveCompany = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) return res.status(404).json({ message: "Company not found" });
    if (company.isApproved) return res.status(400).json({ message: "Company already approved" });

    company.isApproved = true;
    await company.save();

    res.status(200).json({ message: "Company approved", company });
  } catch (err) {
    err.statusCode = 500;
    err.message = "Error approving company";
    next(err);
  }
};

// Approve a pending recruiter
exports.approveRecruiter = async (req, res, next) => {
  try {
    const recruiterId = req.params.id;
    const recruiter = await User.findById(recruiterId);

    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });
    if (recruiter.role !== "recruiter") return res.status(400).json({ message: "Not a recruiter" });
    if (recruiter.isApproved) return res.status(400).json({ message: "Recruiter already approved" });

    recruiter.isApproved = true;
    await recruiter.save();

    //  Send approval email
    await sendEmail(
      recruiter.email,
      "Recruiter Account Approved",
      `<p>Hi ${recruiter.firstName || "there"},</p>
       <p>Your recruiter account has been approved by the admin. You can now create or join companies and post job simulations.</p>`
    );


    res.status(200).json({ message: "Recruiter approved", recruiter });
  } catch (err) {
    err.statusCode = 500;
    err.message = "Error approving recruiter";
    next(err);
  }
};

