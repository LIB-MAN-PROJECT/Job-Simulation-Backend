const Joi=require("joi");

const createSimulationSchema=Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    field: Joi.string().trim().required().valid('IT','Marketing','Law','Software Development','Database Design','Accounting','Development Studies','Education','Statistics','Business Administration'),
    level: Joi.string().required().valid('Beginner', 'Intermediate', 'Advanced'),
    duration: Joi.number().min(1),
    isHiring: Joi.boolean(),
    isPublished: Joi.boolean()
});

module.exports = createSimulationSchema;
