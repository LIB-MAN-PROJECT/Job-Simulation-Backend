const Joi = require("joi");

const loginSchema = Joi.object({
    userName: Joi.string().trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().required(),
});

module.exports=loginSchema;