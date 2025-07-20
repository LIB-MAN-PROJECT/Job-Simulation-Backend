const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config()
const User = require("../models/userModel.model");
const Company = require("../models/companyModel.model")
const { successMessage, errorMessage } = require("../utils/responseHandler.util");



//signing up
//cretaing a new user in db

const signup = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password, role, companyName,companyCode,description,website } = req.body

        const userExists = await User.findOne({ userName });
        if (userExists) {
            // return errorMessage(res, 400, "User already exits");
            return res.status(400).json({
                message: "User already exists",
            });
        }
        
        const hashedpassword = await bcrypt.hash(password, 10);

        let user;
        if (role === "recruiter" ){
            if(website && description){
                //Check if company exists
                let company = await Company.findOne({companyName});
                if(company){
                    if(company.companyCode !== companyCode){
                        return errorMessage(res,400,"Invalid Credentials");
                    }
                    //add recruiter to company
                     company.recruiters.push(user._id);
                    await company.save();
                }

            }
            else{
                //creating new company if it doesn't exist

                //checking file existence
                if(!req.file || !req.file.path){
                console.log("No valid file found");
                return errorMessage(res, 400, "File not provided or invalid");
                }

                const uploadedFile = await uploadFile(req, req.file.path, "/upskill/companyLogos",res);

                company = await Company.create({
                companyName,
                companyCode,
                description,
                logoUrl: uploadedFile.url,
                logoPublicId: uploadedFile.public_id,
                website,
                isVerified:false
                });
            }

            //create recruiter
            user = await User.create({
                firstName,
                lastName,
                userName,
                email,
                password: hashedpassword,
                role,
                companyId: company._id,
                companyName,
                isVerified: false,
            });

           
        }else{
            // create user or admin
            user = await User.create({
                firstName,
                lastName,
                userName,
                email,
                password: hashedpassword,
                role,
            });
        }

        let registeredUser;
        if(role === "recruiter"){
                registeredUser = {
                firstName,
                lastName,
                userName,
                email,
                companyName,
                role
            }
        }else{
            registeredUser = {
                firstName,
                lastName,
                userName,
                email,
                role
            }  
        }

        return successMessage(res, 201, "User registered successfully",registeredUser);
    } catch (error) {
        console.log("Signup error", error)
        return errorMessage(res, 500, "Internal Server Error", error);
    }
}

const login = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        const user = await User.findOne({userName});
        console.log("user=", user);

        //username and password validation
        if (!user) {
            return errorMessage(res, 401, "Invalid credentials"); 
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return errorMessage(res, 401, "Invalid credentials");
        }
        
        let token=null;

        if(user.role==="recruiter"){
            token = jwt.sign({
                id: user._id,
                firstName: user.firstName,
                lastName:user.lastName,
                userName: user.userName,
                email: user.email,
                role: user.role,
                companyId: user.companyId,
                companyName: user.companyName
            }, process.env.JWT_SECRET);
        }
        else{
            token = jwt.sign({
                id: user._id,
                firstName: user.firstName,
                lastName:user.lastName,
                userName: user.userName,
                role: user.role,
            }, process.env.JWT_SECRET);
        }


        res.status(201).json({
            token: token,
            message: "Login successful",
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                userName: user.userName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log("Login Error", error);
        res.status(500).json({
            message: error.message
        });
    }
}


module.exports = {
    signup,
    login
}