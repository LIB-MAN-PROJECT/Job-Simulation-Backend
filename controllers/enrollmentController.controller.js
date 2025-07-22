const { errorMessage,successMessage } = require("../utils/responseHandler.util");
const JobSim= require("../models/jobSimulation.model")
const Enroll = require("../models/enrollmentModel.model");
const User = require("../models/userModel.model");

const enrollInJobSim = async(req,res) => {
    const {simulationId}=req.params
    
    try {
         const jobSim= await JobSim.findById(simulationId);
        // if(!jobSim) return errorMessage(res,404,"Job Simulation not found");
        // //checking if user has enrolled already
       
        // if(jobSim.participants.includes(req.user.id)) return errorMessage(res,400,"You're already enrolled in this simulation");

        //checking if user has enrolled already
        const alreadyEnrolled= await Enroll.findOne({userId:req.user.id,simulationId});
        if (alreadyEnrolled) return errorMessage(res,400,"You're already enrolled in this simulation");

        const user = await User.findById(req.user.id);
        
        const enroll = await Enroll.create({
            userId: req.user.id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            simulationId,
            progress: 0,
            completedAt: null
        });

        if (!jobSim.participants.includes(req.user.id)){
            jobSim.participants.push(req.user.id);
            await jobSim.save();
        }

        user.enrolledSimulations.push(simulationId);
        await user.save();

        return successMessage(res,200,`Successfully enrolled in the ${jobSim.title} simulation`,enroll);
    } catch (error) {
        console.error("Enrolling in Sim error:",error);
        return errorMessage(res,500,"Internal Server Error",error);
    }
}

const unenrollInJobSim = async(req,res) =>{
    const {simulationId} = req.params;

    try {
        const jobSim= await JobSim.findById(simulationId);
        if(!jobSim) return errorMessage(res,404,"Job Simulation not found");
    
        // if(!jobSim.participants.includes(req.user.id)) return errorMessage(res,400,"You aren't enrolled in this simulation");

        //checking if user has enrolled already
        const alreadyEnrolled= await Enroll.findOne({userId:req.user.id,simulationId});
        if (!alreadyEnrolled) return errorMessage(res,400,"You aren't enrolled in this simulation");

        await Enroll.findOneAndDelete({userId:req.user.id,simulationId});
        //Remove user from participants' list
         jobSim.participants.pull(req.user.id);
        await jobSim.save();

        return successMessage(res,200,"Unenrolled successfully",jobSim)
    } catch (error) {
        console.error("Unenrolling error",error);
        return errorMessage(res,500,"Internal Server Error",error);
    }
}

module.exports={enrollInJobSim,unenrollInJobSim};
