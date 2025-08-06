const Joi = require("joi");

const signupSchema = Joi.object({
    userName: Joi.string().trim().required(),
    firstName:Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("student", "recruiter", "admin").required(),
    companyName: Joi.string().trim().optional(),
    companyCustomId:Joi.string().trim().optional(),
    companyCode: Joi.string().trim().when('role', {
    is: 'recruiter',
    then: Joi.required(),
    otherwise: Joi.forbidden()
    }),
    companyEmail: Joi.string().email().trim().optional(),
    description: Joi.string().trim().min(1).optional(),
    website: Joi.string().uri().optional(),
});

module.exports= signupSchema