const Joi = require("joi");

const createTaskSchema = Joi.object({
    taskNumber: Joi.number().min(1).required(),
    title: Joi.string().trim(),
    content: Joi.string().trim().required(),
    resources: Joi.string().trim()
});

module.exports= createTaskSchema