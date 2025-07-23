const Joi = require("joi");

const  internshipPostSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    field: Joi.string().required(),
    companyName: Joi.string().required(),
    location: Joi.string().required(),
    mode: Joi.string().required(),
    deadline: Joi.string().required(),
    reviewStatus: Joi.string().required(),
    
});

const validateInternshipPost = (req,res,next) => {
    const{error} = internshipPostSchema.validate(req.body);
    if (error){
        return res.status(400).json({message: error.details[0].message });
    }
    next();

}

module.exports = {validateInternshipPost};