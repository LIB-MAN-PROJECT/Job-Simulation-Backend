const errorHandler = async (err,req,res,next) =>{
    const status = err.status || 500;
    const message = err.message || `Internal Server Error`;
    const errorDetails = err.details || err.stack;

    console.log(`[${status}] ${message}`,errorDetails);

    const response = res.status(status).json({
        status,
        message,
        errorDetails,
    });

    return response;
}

module.exports = errorHandler