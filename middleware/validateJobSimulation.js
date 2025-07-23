const Joi = require("joi");

const JobSimulationSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    field: Joi.string().valid('IT','Marketing','Law','Software Development','Database Design'),
    imageUrl: Joi.string().required(),
    level: Joi.string().valid("beginner", "intermediate", "advanced"),
    duration: Joi.string().required(),
    isHiring: Joi.boolean().required(),
    isPublished: Joi.boolean().required(),
    
});

const validateJobSimulation = (req,res,next) => {
    const{error} = JobSimulationSchema.validate(req.body);
    if (error){
        return res.status(400).json({message: error.details[0].message });
    }
    next();

}

module.exports = {validateJobSimulation};