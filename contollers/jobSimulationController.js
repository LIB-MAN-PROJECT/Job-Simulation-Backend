const JobSimulation = require("../models/JobSimulationSchema");
const cloudinary = require("../utils/cloudinary");
const Task = require("../models/TaskSchema");
const fs = require("fs");
const Company =  require("../models/CompanySchema");

// POST: Create new Job Simulation (recruiter)
exports.jobSimulation = async (req, res,next) => {
  try {
    const {
      title,
      description,
      field,
      companyName,
      companyId,
      level,
      duration,
    } = req.body;

    // ✅ Get company info (using companyId from req.body)
const company = await Company.findById(companyId);
if (!company) {
  return res.status(404).json({ message: "Company not found" });
}


    // ✅ Create job simulation first
    const newJobSimulation = new JobSimulation({
      title,
      description,
      field,
      companyName,
      companyId,
      level,
      duration,
      createdBy: req.user.id,
      companyLogo: company.logoUrl
      
    });

    

    await newJobSimulation.save();

    const taskIds = [];

    // ✅ Only handle tasks if any were provided
    let tasks = [];
    if (req.body.tasks) {
      try {
        tasks = JSON.parse(req.body.tasks);
      } catch (error) {
        return res.status(400).json({
          message: "Tasks field is not valid JSON",
          error: error.message,
        });
      }
    }

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      let resourceFileUrl = null;
      let resourceFilePublicId = null;

      // ✅ Check if a file exists for this task
      if (req.files && req.files[`taskFiles[${i}]`]) {
        const file = req.files[`taskFiles[${i}]`][0];

        const uploadResult = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
          folder: "Jobsimulations/tasks",
        });

        // ✅ Delete the local file
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error("Failed to delete local file:", err);
          } else {
            console.log("Local file deleted:", file.path);
          }
        });

        resourceFileUrl = uploadResult.secure_url;
        resourceFilePublicId = uploadResult.public_id;
      }

      // ✅ Only create task if it has either content or file
      if (task.content || resourceFileUrl) {
        const newTask = new Task({
          title: task.title,
          description: task.description,
          content: task.content || null,
          resourceFile: resourceFileUrl,
          resourceFilePublicId,
          simulationId: newJobSimulation._id,
        });

        const savedTask = await newTask.save();
        taskIds.push(savedTask._id);
      }
    }

    // ✅ Save task references if any
    if (taskIds.length > 0) {
      newJobSimulation.tasks = taskIds;
      await newJobSimulation.save();
    }

    res.status(201).json(newJobSimulation);
  } catch (error) {
//     console.error("Error creating job simulation:", error);
//     error.statusCode = 500;
// error.message = "Error creating job simulation";
// next(error);

console.error(" Full error:", error); // Console log full error

  return res.status(500).json({
    success: false,
    message: "Error creating job simulation",
    error: error.message,           // Main message
    stack: error.stack,             // See where it broke
    full: error                     // Raw error for debugging
  });
  }
};

// GET: All jobSimulation (search & filter included)
exports.getJobSimulation = async (req, res,next) => {
  try {
    const { title, description, field } = req.query;
    const filter = {};

    if (title) filter.title = { $regex: title, $options: "i" };
    if (description)
      filter.description = { $regex: description, $options: "i" };
    if (field) filter.field = { $regex: field, $options: "i" };

    const simulation = await JobSimulation.find(filter).populate(
      "createdBy",
      "username email"
    );
    res.status(200).json(simulation);
  } catch (err) {
    err.statusCode = 500;
err.message = "Error fetching job simulation";
next(err);

  }
};

// GET: Single jobSimulation by ID
exports.jobSimulationById = async (req, res,next) => {
  try {
    const simulation = await JobSimulation.findById(req.params.id);
    if (!simulation)
      return res.status(404).json({ message: "job simulation not found" });

    res.status(200).json(simulation);
  } catch (err) {
    
err.statusCode = 500;
err.message = "Error fetching job simulation";
next(err);

  }
};

//GET:job simulation by a specific User ID
exports.getJobSimulationByUserId = async (req, res,next) => {
  console.log("req.user.id", req.user.id);
  try {
    const simulation = await JobSimulation.find({
      createdBy: req.user.id,
    });
    if (!simulation)
      return res.status(404).json({ message: "Job simulation not found" });

    res.status(200).json({ simulation });
  } catch (err) {
    console.error("Error fetching job simulation:", err);
    err.statusCode = 500;
err.message = "Error fecthing job simulations";
next(err);

  }
};

// PUT: Update jobSimulations (recruiter only, must be owner)

exports.updateJobSimulation = async (req, res,next) => {
  const { title, description, field, companyName, tasks, level, duration } =
    req.body;
  try {
    let simulation = await JobSimulation.findById(req.params.id);
    if (!simulation)
      return res.status(404).json({ message: "Job simulation not found" });

    if (simulation.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only update your own job simulation" });
    }
    // Check if a new image file is provided
    if (req.file) {
      // Destroy previous image if exists
      if (simulation.imagePublicId) {
        await cloudinary.uploader.destroy(simulation.imagePublicId);
      }
      // Upload new image
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "Jobsimulations",
      });
      simulation.imageUrl = uploadResult.secure_url;
      simulation.imagePublicId = uploadResult.public_id;
    }
    // Update the fields if provided, else keep the existing values
    simulation.title = title || simulation.title;
    simulation.description = description || simulation.description;
    simulation.field = field || simulation.field;
    simulation.companyName = companyName || simulation.companyName;
    simulation.tasks = tasks || simulation.tasks;
    simulation.level = level || simulation.level;
    simulation.duration = duration || simulation.duration;
    simulation.createdBy = req.user.id;
    simulation.username = req.user.username;

    await simulation.save();
    res.status(201).json({ message: "Updated Successfully", simulation });
  } catch (err) {
    err.statusCode = 500;
err.message = "Error updating job simulation";
next(err);

  }
};

// DELETE: Remove simulation (recruiter only, must be owner)
exports.deleteJobSimulation = async (req, res,next) => {
  try {
    const jobSimulation = await JobSimulation.findById(req.params.id);
    if (!jobSimulation)
      return res.status(404).json({ message: "job simulation not found" });

    // Ensure jobsimulation.recruiter exists before comparing
    if (
      !jobSimulation.createdBy ||
      jobSimulation.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job simulation" });
    }

    // Delete image from Cloudinary if it exists
    if (jobSimulation.imagePublicId) {
      await cloudinary.uploader.destroy(jobSimulation.imagePublicId);
    }

    await JobSimulation.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "job simulation deleted successfully" });
  } catch (error) {
   
    err.statusCode = 500;
err.message = "Error deleting job simulation";
next(err);


  }
};
