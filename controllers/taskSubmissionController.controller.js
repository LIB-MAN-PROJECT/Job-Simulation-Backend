
// check if user is enrolled
//Allow task submission
//Update progress based on completion score

//  On task submission:

// 1.Save the submission

// 2. Pull the completionScore from the related Task

// 3.Store that score in TaskSubmission (completionScoreEarned)

//  After submission:

// 1. Fetch the user's Enrollment for that simulation

// 2. Increment their progress by the submitted score

// 3.If progress hits or exceeds 100, set completedAt

const { errorMessage, successMessage } = require("../utils/responseHandler.util");
const { readData, WriteData } = require("../utils/fileHandler.util");
const { uploadFile, deleteFile } = require("../utils/uploadFile.util");
const Enroll = require("../models/enrollmentModel.model")
const {Task,TaskSubmission}=require("../models/taskModel.model");
const injectCompletionStatus = require("../utils/injectCompletionStatus.util")


const submitTask= async(req,res)=>{
    const{simulationId,taskId}=req.params;
    try {
        //checking user enrollment
        const enrolled= await Enroll.findOne({userId:req.user.id,simulationId});
        console.log("Enrollment Document",enrolled);
        if (!enrolled) return errorMessage(res,400,"You aren't enrolled in this simulation");
         
        //checking for existence of submission
        const submissionExists = await TaskSubmission.findOne({userId:req.user.id,simulationId,taskId});

        if(submissionExists) return errorMessage(res,400,"You have already submitted this task");

        //checking file existence
        if(!req.file || !req.file.path){
        console.log("No valid file found");
        return errorMessage(res, 400, "File not provided or invalid");
        }

        //upload file
        const uploadedFile = await uploadFile(req,req.file.path,"upskill/taskSubmissions",res);
    
        //fetch task
        const task = await Task.findById(taskId);
        if(!task) return errorMessage(res,404,"Task not found"); 
        
        // 1.Save the submission
    
        const taskSubmission= await TaskSubmission.create({
            userId: req.user.id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            taskId,
            simulationId,
            submissionUrl: uploadedFile.url,
            submissionPublicId: uploadedFile.public_id,
            isSubmitted:true,
        });

        //link submissions to enrollment
        if(!Array.isArray(enrolled.taskSubmissions)){
            enrolled.taskSubmissions=[];
        }
        enrolled.taskSubmissions.push(taskSubmission._id);

        //updated
        //Recalculate progress
        const totalTasks=await Task.countDocuments({simulationId}); //Total tasks in simulation
        const submittedTaskcount= await TaskSubmission.countDocuments({
            userId:req.user.id,
            simulationId:simulationId,
            isSubmitted:true
        });// Total number of submitted tasks by specific user

        // fetch task again as plain object to decorate
        const rawTask = await Task.findById(taskId).lean();
        const decoratedTask = injectCompletionStatus(rawTask); // sets isCompleted: true

        //Calculate progress
        const progressPercent = totalTasks > 0 
      ? Math.floor((submittedTaskcount / totalTasks) * 100)
      : 0;

        //update user's enrollment progress
        enrolled.progress=progressPercent;

        console.log("enrolled=",enrolled);
        //Mark completion if all tasks are submitted
        if(progressPercent >= 99 && !enrolled.completedAt){
            enrolled.completedAt=new Date();
            enrolled.isReadyForReview =true;
            enrolled.isReviewed=false;
            enrolled.reviewState="Pending";
        }
        //saving updates
        await enrolled.save()
        if(progressPercent >= 99){
             return successMessage(res,200,"You have completed all the tasks",{
            submission: taskSubmission,
            progress: progressPercent,
            task:decoratedTask
        });
        }

        return successMessage(res,200,"Task submitted successfully",{
            submission: taskSubmission,
            progress: progressPercent,
            task:decoratedTask
        })
    
    } catch (error) {
        console.error("Task submission error:",error);
        return errorMessage(res,500,"Internal Server Error",error);
    }
}

const editSubmittedTask=async(req,res)=>{
    const {simulationId,taskId,taskSubmissionId}=req.params;

    try {
        //checking user enrollment
        const enrolled= await Enroll.findOne({userId:req.user.id,simulationId});
        if (!enrolled) return errorMessage(res,400,"You aren't enrolled in this simulation");

        //validating submitted task
        const submittedTask= await TaskSubmission.findOne({_id:taskSubmissionId,userId:req.user.id,simulationId,taskId});
        if(!submittedTask){
        return errorMessage(res,404,"Submitted Task not found");
        }
        
        //Ensuring submission belongs to user
        if (submittedTask.userId.toString() !== req.user.id.toString()) return errorMessage(res,403,"You didn't make this submission");

        //Ensuring the simulations match
        if(submittedTask.simulationId.toString()!== simulationId) return errorMessage(res,400,"Submission doesn't belong to thus simulation");

        //checking file existence
        // if(!req.file?.path){
        // console.log("No valid file found");
        // return errorMessage(res, 400, "File not provided or invalid");
        // }
        
        const updates={}
        updates.submittedAt = Date.now();
        
        if (req.file?.path){
        if(submittedTask.submissionPublicId){
            await deleteFile(submittedTask.submissionPublicId);
        }

        //upload new file
        const uploadedFile = await uploadFile(req,req.file.path,"upskill/taskSubmissions",res);

        updates.submissionUrl=uploadedFile.url;
        updates.submissionPublicId=uploadedFile.public_id;
        }

        const updatedSubmittedTask = await TaskSubmission.findByIdAndUpdate(taskSubmissionId,{$set:updates},{new:true});

        return successMessage(res,200,"task updated successfully",updatedSubmittedTask);
    } catch (error) {
        console.error("Task submission edit error:",error);
        return errorMessage(res,500,"Internal Server Error",error);
    }
}

const deleteSubmittedTask = async(req,res)=>{
    const {simulationId,taskId,taskSubmissionId} =req.params;

    try {
        //checking user enrollment
        const enrolled= await Enroll.findOne({userId:req.user.id,simulationId});
        console.log("Enrollment Document",enrolled);
        if (!enrolled) return errorMessage(res,400,"You aren't enrolled in this simulation");

        //validating submitted task
        const submittedTask= await TaskSubmission.findOne({_id:taskSubmissionId,userId:req.user.id,simulationId,taskId});
        if(!submittedTask){
        return errorMessage(res,404,"Submitted Task not found");
        }
        
        //Ensuring submission belongs to user
        if (submittedTask.userId.toString() !== req.user.id.toString()) return errorMessage(res,403,"You didn't make this submission");

        //deleting file
        if(submittedTask.submissionPublicId){
            await deleteFile(submittedTask.submissionPublicId);
        }
        
        // remove document
        const deletedtask = await TaskSubmission.findOneAndDelete({taskSubmissionId});

        //removing taskSubmissionId from enrollment.
        enrolled.taskSubmissions = enrolled.taskSubmissions.filter(id => id.toString() !== taskSubmissionId);


        //Recalculating progress Score
        const totalTasks= await Task.countDocuments({simulationId}); //counting total tasks in the simulation document
        const submittedTaskcount = enrolled.taskSubmissions.length //total number of submitted tasks

        //Progress
        const progressPercent = totalTasks > 0 
      ? Math.floor((submittedTaskcount / totalTasks) * 100)
      : 0;

                //update user's enrollment progress
        enrolled.progress=progressPercent;

        //Mark completion if all tasks are submitted
        if(progressPercent < 96){
            enrolled.completedAt=null;
            enrolled.isReadyForReview =false;
            enrolled.isReviewed=false;
            enrolled.reviewState="Pending";
        }
        //saving updates
        await enrolled.save()

        return successMessage(res,200,"Submission deleted successfully",deletedtask);

    } catch (error) {
        console.error("Task submission deletion error:",error);
        return errorMessage(res,500,"Internal Server Error",error);
    }
}

module.exports={submitTask,editSubmittedTask,deleteSubmittedTask}