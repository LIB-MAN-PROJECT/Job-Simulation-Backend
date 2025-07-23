const Joi = require("joi");

const TaskSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    resources: Joi.string().required(),
    
    
});

const validateTaskPost = (req,res,next) => {
    const{error} = TaskSchema.validate(req.body);
    if (error){
        return res.status(400).json({message: error.details[0].message });
    }
    next();

}

module.exports = {validateTaskPost};