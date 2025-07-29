const Joi = require("joi");

const signupSchema = Joi.object({
    userName: Joi.string().trim().required(),
    firstName:Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("student", "recruiter", "admin"),
    companyName: Joi.string().trim(),
    companyCustomId:Joi.string().trim(),
    companyCode: Joi.string().trim().when('role', {
    is: Joi.string().valid('recruiter'),
    then: Joi.required(),
    otherwise: Joi.optional()
    }),
    companyEmail: Joi.string().email().trim(),
    description: Joi.string().trim().min(1),
    website: Joi.string().uri(),
});

module.exports= signupSchema