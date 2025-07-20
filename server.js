const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config/db.config");
const errorHandler = require("./middleware/errorHandler.middleware");
const registrationRoutes = require("./routes/registrationRoute.route");
const userRoutes = require("./routes/userRoute.route");
const recruiterRoutes =require("./routes/recruiterRoute.route");
const adminRoutes = require("./routes/adminRoute.route")

const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//routes
//TODO: Remove Middleware Logging statements
//TODO: Logout controller
app.get("/",async(req,res) => {
    res.send(`Welcome`);
});
app.use('/api/auth',registrationRoutes);
app.use('/api/user',userRoutes);
app.use('/api/recruiter',recruiterRoutes);
app.use('/api/admin',adminRoutes);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT,() => console.log(`Server is running on http://localhost:${PORT}`))
    } catch (error) {
        console.log("Failed to connect to MongoDB",error.message);
        process.exit(1);
    }
}

app.use((req,res,next)=>{
    const error = new Error("Sorry,we couldn't find what you're looking for");
    error.status = 404;
    next(error);
});

app.use(errorHandler);
startServer();

