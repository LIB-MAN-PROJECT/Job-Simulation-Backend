const Joi = require("joi");

const signupSchema = Joi.object({
    username: Joi.string().required(),
    firstName:Joi.string().require(),
    lastName: Joi.string().require(),
    email: Joi.string().email().required(),
    password: Joi.string().email().required(),
    role: Joi.string().valid("student", "recruiter", "admin"),

});

const validateSignup = (req,res,next) =>{
    const{error} = signupSchema.validate(req.body);
    if (error){
        return res.status(400).json({message: error.details[0].message});
    }
    next();
}

module.exports = {validateSignup};