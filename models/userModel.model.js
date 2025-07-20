const { ref } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName:{type:String,required:true},
  lastName:{type:String,required:true},
  userName:{type:String, required:true, unique:true},
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'recruiter', 'admin'],
    default: 'student'
  },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }, // only for recruiters
  companyName: {type:String}, //denormalized
  isVerified:{type:Boolean,default:false},//not needed in the frontend
  internshipApplications:[{type:mongoose.Schema.Types.ObjectId,ref:'internshipApplication'}],
  enrolledSimulations:[{type:mongoose.Schema.Types.ObjectId,ref:"Enrollment"}],
}, { timestamps: true });

// userSchema.pre('save',function (next){
// this.fullName= `${this.firstName} ${this.lastName}`;
// next();
// });

module.exports= mongoose.model("user",userSchema);