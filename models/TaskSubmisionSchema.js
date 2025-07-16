const mongoose = require("mongoose");

const taskSubmissionSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  taskId:{type:mongoose.Schema.Types.ObjectId, ref:'Task',required:true},
  simulationId:{type:mongoose.Schema.Types.ObjectId,ref:'JobSimulation' ,required:true},
  submissionUrl:{type:String},//URL
  isSubmitted:{type:Boolean,default:false},
  submittedAt:{type:Date},
  reviewStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewerComment: {type: String}

},{timestamps:true});

//preventing suplicate submissions for the same Task
taskSubmissionSchema.index({userId: 1,taskId: 1},{unique:true});

module.exports = mongoose.models.TaskSubmission ||  mongoose.model("TaskSubmission", taskSubmissionSchema);