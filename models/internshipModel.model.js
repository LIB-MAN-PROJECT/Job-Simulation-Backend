const mongoose = require("mongoose");

const internshipPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    field: { type: String },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    companyName: { type: String },
    location: { type: String },
    mode: { type: String, enum: ['remote', 'hybrid', 'in-person','Remote', 'Hybrid', 'In-person'] },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    deadline: { type: Date }
}, { timestamps: true });

const internshipApplicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firstName: { type: String }, // denormalized
    lastName: {type:String}, //denormalized
    internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'InternshipPost', required: true },
    userCv: { type: String }, //URL
    userCvPublicId:{type:String},
    applicationStatus: {
        type: String, enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = {
    InternshipPost: mongoose.model("InternshipPost", internshipPostSchema),
    InternshipApplication: mongoose.model("InternshipApplication", internshipApplicationSchema)
}