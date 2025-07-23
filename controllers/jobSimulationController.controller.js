const JobSim = require("../models/jobSimulation.model");
const { errorMessage, successMessage } = require("../utils/responseHandler.util");
const { readData, WriteData } = require("../utils/fileHandler.util");
const { uploadFile, deleteFile } = require("../utils/uploadFile.util");
const {Task,TaskSubmission}=require("../models/taskModel.model");
const updateTaskScores = require("../utils/taskScoreCounter.util");


//Job simulation-related logic
const createJobSim = async (req, res) => {
    const { title, description, field, level, duration, isHiring, isPublished } = req.body;
    console.log("req.user", req.user);
    console.log("req.file", req.file);
    try {
        // const localJobSim = await readData("simulations.json");

        //checking file existence
        if(!req.file || !req.file.path){
        console.log("No valid file found");
        return errorMessage(res, 400, "File not provided or invalid");
        }

        const uploadedFile = await uploadFile(req, req.file.path, "/upskill/jobSims",res)

        const jobSim = await JobSim.create({
            title,
            description,
            imageUrl: uploadedFile.url,
            imagePublicId: uploadedFile.public_id,
            field,
            companyId: req.user.companyId,
            companyName: req.user.companyName,
            level,
            duration,
            isHiring,
            isPublished
        });

        // try {
        //     localJobSim.push(jobSim);
        //     await WriteData("simulations.json", localJobSim);
            
        // } catch (error) {
        //     console.log("Local JSON write failed:", error.message);
        // }
        return successMessage(res, 201, "Simulation created successfully", jobSim);

    } catch (error) {
        console.error("Creating Sim", error);
        return errorMessage(res, 500, "File Upload Failed", error.message);
    }
}

const editJobSimById = async (req, res) => {
    const { title, description, field, level, duration, isHiring, isPublished } = req.body;
    console.log("req.user", req.user);
    const { simulationId } = req.params;

    try {
        const jobSim = await JobSim.findById(simulationId);

        if (!jobSim) {
            return errorMessage(res, 404, "Job Simulation not found");
        }

        //checking for existence of file
        // if(!req.file){
        //     return errorMessage(res,400,"No file Uploaded");
        // }

        const updates = {};
        if (title) updates.title = title;
        if (description) updates.description = description;
        if (field) updates.field = field;
        if (level) updates.level = level;
        if (duration) updates.duration = duration;
        if (typeof isHiring !== "undefined") updates.isHiring = isHiring;
        if (typeof isPublished !== "undefined") updates.isPublished = isPublished;


        if (req.file?.path) {

            //deleting Image file from cloudinary
            if (jobSim.imagePublicId) {
                await deleteFile(jobSim.imagePublicId);
            }

            //uploading new file
            const uploadedFile = await uploadFile(req, req.file.path, "/upskill/jobSims",res);

            updates.imageUrl = uploadedFile.url;
            updates.imagePublicId = uploadedFile.public_id;
        }

        const updatedJobSim = await JobSim.findByIdAndUpdate(id, { $set: updates }, { new: true });


        //updating jobSim fields with new info
        //  await JobSim.findByIdAndUpdate(id,{$set:{title,description,imageUrl: uploadedFile.url,
        //     imagePublicId: uploadedFile.public_id,field,level,duration,isHiring,isPublished}},{new:true});
        //method is faster
        // jobSim.title=title;
        // jobSim.description=description;
        // jobSim.imageUrl= uploadedFile.url;
        // jobSim.imagePublicId= uploadedFile.public_id;
        // jobSim.field=field;
        // jobSim.level= level;
        // jobSim.duration=duration;
        // jobSim.isHiring=isHiring;
        // jobSim.isPublished=isPublished;

        // await jobSim.save();
        return successMessage(res, 200, "Job simulation edited successfully", updatedJobSim)
    } catch (error) {
        console.error("Edit Job Sim Error", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }

}

const deleteJobSimById = async (req, res) => {
    const { simulationId } = req.params;

    try {
        const jobSim = await JobSim.findByIdAndDelete(simulationId);
        if (!jobSim){
             return errorMessage(res, 404, "Job Simulation not found");
        }
        return successMessage(res,200,"Job simulation deleted successfully",jobSim);
    } catch (error) {
        console.error("Del Job Sim Error", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }
}

//task-related logic
const createTask = async(req,res)=>{
    const {simulationId}= req.params;
    const {taskNumber,title,content,resources}=req.body
    try {
        const jobSim = await JobSim.findById(simulationId);

        if(!jobSim){
            return errorMessage(res,404,"Job simulation not found")
        }
        const completionScore = await updateTaskScores(simulationId);
        //create task
        const task = await Task.create({
            taskNumber,
            simulationId,
            title,
            content,
            resources,
            completionScore
        });

        //add task to simulation document
        jobSim.tasks.push(task._id);
        await jobSim.save()

        return successMessage(res,201,"Task created successfully",task);
    } catch (error) {
        console.error("Creating Task Error", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }
}

const editTask= async(req,res)=>{
    const{taskId}=req.params;
    const{title,content,resources}=req.body
    
    try {
        const updates = {};
        if(title) updates.title = title;
        if(content) updates.content = content;
        if(resources) updates.resources= resources;

        const updatedTask = await Task.findByIdAndUpdate(taskId,{$set:updates},{new:true});

        if(!updatedTask){
            errorMessage(res,404,"Task not found");
        }
        return successMessage(res,200,"Task updated successfully",updatedTask);
    } catch (error) {
        console.error("Creating Task Error", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    }
}

const deleteTask = async(req,res)=>{
    const {taskId}=req.params;
//TODO: prevent deletion if task is attempted by user
    try {
        const task=Task.findByIdAndDelete(taskId);
        await updateTaskScores(taskId)
        if (!task){
           return errorMessage(res,404,"Task not found");
        }
        return successMessage(res,200,"Task deleted successfully");

    } catch (error) {
        console.error("Creating Task Error", error);
        return errorMessage(res, 500, "Internal Server Error", error);
    };
};

const viewAllJobSims = async(req,res)=>{
    try {
        const jobSims = await JobSim.find();
 
        return successMessage(res,200,"Simulations retrieved successfully",jobSims);
    } catch (error) {
        console.log("Getting All Sims error",error);
        console.error("Getting All Sims error",error);
        return errorMessage(res,500,"Internal Server Error",error);
    }
};

const injectCompletionMap =require("../utils/dynamicStatusInjectionMultiple");

const viewJobSimsById = async (req, res) => {
  const { simulationId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return errorMessage(res, 401, "Unauthorized: Missing user context");
  }

  try {
    const jobSims = await JobSim.findById(simulationId).populate("tasks").lean();
    if (!jobSims) {
      return errorMessage(res, 404, "Job Simulation not found");
    }

    const submissions = await TaskSubmission.find({
      userId,
      simulationId,
      isSubmitted: true
    }).select("taskId").lean();

    const completedTaskIds = new Set(submissions.map(sub => sub.taskId.toString()));

    jobSims.tasks = injectCompletionMap(jobSims.tasks, completedTaskIds);

    return successMessage(res, 200, "Job Simulation retrieved successfully", jobSims);
  } catch (error) {
    console.error("Getting Job Simulation error:", error);
    return errorMessage(res, 500, "Internal Server Error", error);
  }
};

//TODO: search and filter sims based on specific metrics
//search & filter
const searchSimulations = async(req,res)=>{
    const { title, field, level, duration, isHiring, isPublished,companyName } = req.query;

    const filter={};
    try {
        if(title) filter.title= {$regex:title,$options:"i"};
        
        if(field) filter.field= {$regex:field,$options:"i"};
        
        if(level) filter.level= {$regex:level,$options:"i"};
      
        if(duration) filter.duration= {$regex:duration,$options:"i"};
        
        if(isHiring) filter.isHiring= {$regex:isHiring,$options:"i"};
        
        if(isPublished) filter.isPublished= {$regex:isPublished,$options:"i"};

        if(companyName) filter.companyName= {$regex:companyName,$options:"i"};

        const simulations = await JobSim.find(filter).sort({ createdAt: -1 });

        return successMessage(res, 200, "Simulations found", simulations);

    } catch (error) {
    console.error("Simulation search error:", error);
    return errorMessage(res, 500, "Internal Server Error", error);
    }
    
}

module.exports={createJobSim,editJobSimById,deleteJobSimById,viewAllJobSims,viewJobSimsById,createTask,editTask,deleteTask,searchSimulations};