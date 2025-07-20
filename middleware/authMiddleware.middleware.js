const jwt = require("jsonwebtoken");
const { errorMessage } = require("../utils/responseHandler.util");
const User= require("../models/userModel.model");
const mongoose = require("mongoose");
require("dotenv").config();


const authMiddleware= (req,res,next) =>{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({
            message: "You need to login!"
        });
    }
    console.log("AuthHeader",authHeader)

    const token = authHeader.split(" ")[1];

    console.log("token",token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

const allowedRoles = ["student","recruiter","admin"];

function authorizeRole(...allowedRoles){
    return async (req,res,next) =>{
        if(!allowedRoles.includes(req.user.role)){
            return errorMessage(res,403,"Access Forbidden")
        }
        const user= await User.findById(req.user.id);
        if (user.role ==="recruiter"){
            if(!user.isVerified){
               return errorMessage(res,403,"You must be verified to proceed");
            }
        }
        next();
    }
}

module.exports={ 
    authorizeRole,
    authMiddleware,
    allowedRoles
}