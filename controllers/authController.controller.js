const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config()
const User = require("../models/userModel.model");
const Company = require("../models/companyModel.model")
const { successMessage, errorMessage } = require("../utils/responseHandler.util");
const uniqueCompanyId = require("../utils/uniqueCustomIdCheck.util");
const { uploadFile } = require("../utils/uploadFile.util");



//signing up
//creating a new user in db

const signup = async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password, role,companyCustomId,companyCode,companyName,companyEmail,description,website } = req.body

        // Check user essentials
        if (!firstName || !lastName || !userName || !email || !password) {
        return errorMessage(res, 400, "Missing required user fields");
        }

        const userExists = await User.findOne({ userName });
        if (userExists) {
        return errorMessage(res, 400, "User credentials already exists");
            // return res.status(400).json({
            //     message: "User already exists",
            // });
        }

        const emailExists = await User.findOne({ email });
        if (emailExists) {
        return errorMessage(res, 400, "User credentials already exists");
            // return res.status(400).json({
            //     message: "User already exists",
            // });
        }
        
      

        const hashedpassword = await bcrypt.hash(password, 10);

        let user;
        let company;
        if (role === "recruiter" ){
            console.log("customId=",companyCustomId)
            console.log("companyCode=",companyCode)
            if(companyCustomId && companyCode){
                //Check if company exists
                company = await Company.findOne({companyCustomId});
                console.log("company=",company)
                if(company){
                    if(company.companyCode !== companyCode){
                        return errorMessage(res,400,"Invalid Credentials");
                    }

                    //create recruiter
                    user = await User.create({
                        firstName:firstName.trim(),
                        lastName:lastName.trim(),
                        userName:userName.trim(),
                        email:email.toLowerCase().trim(),
                        password: hashedpassword,
                        role:role.trim(),
                        companyId: company._id,
                        companyName: company.companyName,
                        isVerified: false,
                    });

                    console.log("User=",user._id);
                    console.log("user._id");
                    
                    //add recruiter to company
                    company.recruiters.push(user._id);
                    await company.save();
                }
                else{
                    return errorMessage(res,404,"Organization not found.")
                }
            }
            else{
                // Required for creating new company
                if (!companyName || !companyCode || !companyEmail || !description || !website) {
                return errorMessage(res, 400, "Missing required company fields for recruiter");
                }

                  const companyNameExists =await Company.findOne({companyName});
                if (companyNameExists) return errorMessage(res,400,"Organizational Name exists");
                
                  const companyEmailExists =await Company.findOne({companyEmail});
                if (companyEmailExists) return errorMessage(res,400,"Organizational Mail exists");

                const companyWebsite =await Company.findOne({website});
                if (companyWebsite) return errorMessage(res,400,"Organizational Website exists");
                //creating new company if it doesn't exist

                //checking file existence
                // if(!req.file || !req.file.path){
                // console.log("No valid file found");
                // return errorMessage(res, 400, "File not provided or invalid");
                // }

                // const uploadedFile = await uploadFile(req, req.file.path, "/upskill/companyLogos",res);

                company = await Company.create({
                companyName,
                companyCode,
                companyEmail,
                companyCustomId: await uniqueCompanyId(),
                description,
                // logoUrl: uploadedFile.url,
                // logoPublicId: uploadedFile.public_id,
                website,
                isVerified:false
                });

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
            }
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
                role,
                companyCustomId
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