const successMessage = (res,status = 200, message="Success", data=null)=> {
    return res.status(status).json({
        success: true,
        message: typeof message === "string" ? message:"Success",
        data
    });
};

const errorMessage = (res, status = 500, message ="Something went wrong", error=null) => {
    //safely extract error message if error is an object 
    let errorDetails=null;
    if (error && typeof error === "object"){
        errorDetails = error.message || JSON.stringify(error);
    }
    else if (typeof error === "string"){
        errorDetails=error;
    }

    return res.status(status).json({
        success: false,
        message: typeof message ==="string" ? message: "Error",
        error: errorDetails
    });
};

module.exports ={
    successMessage,
    errorMessage
}