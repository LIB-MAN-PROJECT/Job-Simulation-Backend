const Enroll = require("../models/enrollmentModel.model")
const {Task,TaskSubmission}=require("../models/taskModel.model");
const { errorMessage, successMessage } = require("./responseHandler.util");

const updateTaskCompletionStatus = async(req,res)=>{
    const {simulationId,taskId}=req.params;
    const {userId}=req.user;

    try {
        let isCompleted=false
        const updates={};
        updates.isCompleted = true

        const task= await Task.findOneAndUpdate(userId,{simulationId,taskId},{$set:updates},{new:true});
        if(!task) return errorMessage(res,404,"Task Not found");

        return successMessage(res,200,"Task Completion Status updated",updates);

    } catch (error) {
        console.error("Updating Task Completion Error:",error);
        return errorMessage(res,500,"Internal server error",error);
    }
}