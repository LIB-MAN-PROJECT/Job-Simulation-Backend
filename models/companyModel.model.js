const mongoose = require("mongoose");

//only for recruiters
const companySchema = new mongoose.Schema({
  companyCustomId:{type:String},
  companyName: { type: String, required: true },
  companyCode: {type:String},
  companyEmail:{type:String,unique:true},
  description: { type: String },
  logoUrl: { type: String },
  logoPublicId:{ type: String},
  website: { type: String },
  recruiters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isVerified: {type:Boolean, default:false} //not needed in the frontend
}, { timestamps: true }); 

module.exports = mongoose.model("Company",companySchema);