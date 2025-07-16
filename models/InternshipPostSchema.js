const mongoose = require ("mongoose");

const internshipPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  field: { type: String },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  companyName: { type: String },
  location: { type: String },
  mode: { type: String, enum: ['remote', 'hybrid', 'inperson']},
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  deadline: {type: Date},
  reviewStatus: {
  type: String,
  enum: ["pending", "accepted", "rejected"],
  default: "pending",
},
reviewerComment: {
  type: String,
}

}, { timestamps: true });


module.exports =mongoose.models.internshipPost ||  mongoose.model("InternshipPost", internshipPostSchema);
