const Joi = require("joi");

const signupSchema = Joi.object({
    userName: Joi.string().trim().required(),
    firstName:Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("student", "recruiter", "admin").required(),
    companyAction: Joi.string().allow("").trim(),
    companyName: Joi.string().allow("").trim().optional(),
    companyCustomId:Joi.string().allow("").trim().optional(),
    // companyCode: Joi.string().allow("").trim().when('role', {
    // is: 'recruiter',
    // then: Joi.required(),
    // }),
    companyCode:Joi.alternatives().conditional('role',{
        is:'recruiter',
        then: Joi.string().trim().required().not("").messages({
            "any.invalid":"Company Code cannot be empty",
            "string.empty":"Company Code is required"
        }),
        otherwise:Joi.string().trim().allow("").optional()
    }),
    companyEmail: Joi.string().email().allow("").trim().optional(),
    description: Joi.string().allow("").trim().optional(),
    website: Joi.string().uri().allow("").optional(),
});

module.exports= signupSchema