const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    description: { type: String },
    logoUrl: { type: String },
    logoPublicId: { type: String },
    website: { type: String },
    recruiters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    companyCode: { type: String },
    isApproved: { type: Boolean, default: false },
    pendingRecruiters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    email: { type: String, required: true,} 
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Company || mongoose.model("Company", CompanySchema);
