const Review = require("../models/reviewModel.model");
const { Task } = require("../models/taskModel.model");
const JobSim = require("../models/jobSimulation.model");
const User = require("../models/userModel.model");
const { errorMessage,successMessage } = require("../utils/responseHandler.util");
const Enroll = require("../models/enrollmentModel.model");

const sendReview = async(req,res)=>{
    const {simulationId}=req.params;
    const {message,rating} = req.body;
    try {
        //checking user enrollment
        const enrolled= await Enroll.findOne({userId:req.user.id,simulationId});
        // console.log("Enrollment Document",enrolled);
        if (!enrolled) return errorMessage(res,400,"You aren't enrolled in this simulation");
    
        const review = await Review.create({
            userId:req.user.id,
            firstName:req.user.firstName,
            lastName:req.user.lastName,
            fullName:req.user.firstName +" "+ req.user.lastName,
            simulationId,
            rating,
            message
        });
        
    } catch (error) {
        console.error("Review error:",error);
        return errorMessage(res,500,"Internal Server Error",error);
    }
}

const editReview = async(req,res)=>{
    const {simulationId,reviewId} = req.params;
    const{message,rating}= req.body;

    try {
        const enrolled= await Enroll.findOne({userId:req.user.id,simulationId,reviewId});
        // console.log("Enrollment Document",enrolled);
        if (!enrolled) return errorMessage(res,400,"You aren't enrolled in this simulation");

        const review = await Review.findOne({userId:req.user.id,simulationId});
        if(!review){
            return errorMessage(res,404,"Submitted Task not found");
        }

        //checking if user created the review
        if(review.userId.toString()===req.user.id.toString()){
            return errorMessage(res,403,"Invalid editing: You didn't make this review");
        }

        const updates ={};
        if (message) updates.message=message;
        if(rating) updates.rating=rating;

        const updatedReview= await Review.findByIdAndUpdate(reviewId,{$set:updates},{new:true});

        return successMessage(res,200,"Reveiw edited successfully",updatedReview);

    } catch (error) {
        console.error("Review edit error:",error);
        return errorMessage(res,500,"Internal Server Error",error);
    }
}

module.exports={sendReview,editReview};