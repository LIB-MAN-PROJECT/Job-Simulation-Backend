const Joi = require("joi");

const  companySchema = Joi.object({
    companyName: Joi.string().required(),
    description: Joi.string().required(),
    logoUrl: Joi.string().required(),
    website: Joi.string().required(),
});

const validateCompany = (req,res,next) => {
    const{error} = companySchema.validate(req.body);
    if (error){
        return res.status(400).json({message: error.details[0].message });
    }
    next();

}

module.exports = {validateCompany};