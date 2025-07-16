const mongoose = require("mongoose");

const InternshipApplicationSchema = new mongoose.Schema({
  userId: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  userName: {type:String}, // denormalized
  internshipId: {type:mongoose.Schema.Types.ObjectId,ref:'InternshipPost',required:true},
  userCv: {type:String}, //URL
  status:{ type:String, enum:['pending','accepted','rejected'],
  default:'pending'},
  appliedAt: {type:Date, default:Date.now}
},{timestamps:true});




module.exports =mongoose.models.InternshipApplication ||  mongoose.model("InternshipApplication", InternshipApplicationSchema);


