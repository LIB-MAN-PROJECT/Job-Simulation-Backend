const mongoose = require("mongoose");
const JobSim = require("../models/jobSimulation.model");
const { intershipPost, internshipApplication } = require("../models/internshipModel.model");
const { errorMessage, successMessage } = require("../utils/responseHandler.util");
const InternshipPost = intershipPost;
const InternshipApplication = internshipApplication;

//user permissions view,enroll into job simulations, apply for internships

//Simulations


module.exports = {}