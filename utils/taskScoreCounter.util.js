const { errorMessage } = require("./responseHandler.util");

 const updateTaskScores = async (simulationId) =>{
    const Task=require("../models/taskModel.model");
    try {
        const taskCount= await Task.task.find({simulationId});
        const totalTasks = taskCount.length
        
        if (totalTasks === 0) return;
    
        const newScore = Math.floor(100/totalTasks);
    
        await Task.task.updateMany({simulationId},{$set:{completionScore: newScore}});

        console.log(`Completion score updated to ${newScore} for ${totalTasks} tasks`);

        return newScore;
    } catch (error) {
        console.error("Error updating completion scores:", error.message);
        return errorMessage(res,500,"Internal Server Error",error);
    }
 }

 module.exports= updateTaskScores;