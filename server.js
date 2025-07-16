const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorhandler");




// Route files
const authRoutes = require("./routes/authRoutes");
const jobSimulationRoutes = require("./routes/jobSimulationRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const taskRoutes = require("./routes/taskRoutes");
const taskCompletionRoutes = require("./routes/taskCompletionRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const internshipAppRoutes = require("./routes/internshipApplicationRoutes");
const internshipPostRoutes = require("./routes/internshipPostRoutes");
const taskSubmissionRoutes = require("./routes/taskSubmissionRoutes");
const companyRoutes = require("./routes/companyRoutes");


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/auth", authRoutes);
app.use("/job-simulations", jobSimulationRoutes);
app.use("/certificate", certificateRoutes);
app.use("/tasks", taskRoutes);
app.use("/task-completions", taskCompletionRoutes);
app.use("/reviews", reviewRoutes);
app.use("/enrollments", enrollmentRoutes);
app.use("/internship-applications", internshipAppRoutes);
app.use("/internship-post", internshipPostRoutes);
app.use("/task-submissions", taskSubmissionRoutes);
app.use("/companies", companyRoutes);


app.use(errorHandler);





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT} \n`);
});