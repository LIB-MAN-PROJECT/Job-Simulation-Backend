const validateSchema = (schema) =>{
    return (req,res,next)=>{
        const {error,value} =schema.validate(req.body,{abortEarly:false});

        if(error){
            const errorDetails = error.details.map((err) => err.message);

            return res.status(400).json({
                status:"error",
                message:`Validation failed \n ${errorDetails}`,
                errors:errorDetails
            });
        };
        console.log("value",value);
        //passing validated data forward
        req.validatedBody = value;

        next();
    };
};

module.exports= validateSchema;