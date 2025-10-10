const {Router} = require("express");
const jobSimulationController = require("../controllers/jobSimulationController.controller");
const internshipController=require("../controllers/internshipController.controller");
const companyController= require("../controllers/companyController.controller");
const { authMiddleware,authorizeRole,allowedRoles } = require("../middleware/authMiddleware.middleware");
const {uploadImage,uploadDocument}= require("../config/fileUpload.config");
const  recruiterProfile= require("../controllers/recruiterProfileController.controller");
const validateSchema = require("../middleware/validateRequest.middleware");
const createSimulationSchema = require("../validation/createsimulation.schema");
const createTaskSchema = require("../validation/createTask.schema");
const createInternshipPostSchema = require("../validation/createInternship.schema");

const router = Router();

//COMPANY ROUTES
router.post('/create-company',uploadImage.single("file"),authMiddleware,
authorizeRole("recruiter"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags = ['Recruiters']
// #swagger.summary = 'Create New Company(Organization)'
companyController.createCompany);

router.put('/edit-company/:companyId',uploadImage.single("file"),authMiddleware,authorizeRole("recruiter"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags = ['Recruiters']
// #swagger.summary = 'Edit Organizational Data'
companyController.editCompany);

//JOB SIM ROUTES

// File: routes/recruiterRoute.route.js

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
router.post('/create-job-simulation',uploadImage.single("file"),validateSchema(createSimulationSchema),
authMiddleware,authorizeRole("recruiter"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags = ['Recruiters']
// #swagger.summary='Create Job simulation'
jobSimulationController.createJobSim);

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */

router.put('/edit-job-simulation/:simulationId',uploadImage.single("file"),
authMiddleware,authorizeRole("recruiter"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Recruiters']
// #swagger.summary = 'Edit Job Simulations'
jobSimulationController.editJobSimById);
  
router.delete('/delete-job-simulation/:simulationId',authMiddleware,
  authorizeRole("recruiter"),
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.tags = ['Recruiters']
  // #swagger.summary = 'Delete Job Simulation'
jobSimulationController.deleteJobSimById);

//TASK ROUTES
router.post('/create-task/:simulationId',authMiddleware,
  authorizeRole("recruiter"),validateSchema(createTaskSchema),
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swager.tags = ['Recruiters']
  // #swagger.summary = 'Create Task'
jobSimulationController.createTask);

router.put('/edit-task/:taskId',authMiddleware,authorizeRole("recruiter"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags = ['Recruiters']
// #swagger.summary = 'Edit Task'
jobSimulationController.editTask);

router.delete('/delete-task/:taskId',authMiddleware,authorizeRole("recruiter"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags = ['Recruiters']
// #swagger.summary = 'Delete Task'
jobSimulationController.deleteTask);

//INTERNSHIP ROUTES
router.post('/create-internship',authMiddleware,
  authorizeRole("recruiter"),validateSchema(createInternshipPostSchema),
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.tags = ['Recruiters']
  // #swager.summary = 'Create Internship Post'
internshipController.createInternshipPost);

router.put('/edit-internship/:internshipId',authMiddleware,
  authorizeRole("recruiter"),
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.tags = ['Recruiters']
  // #swagger.summary = 'Edit Internship Post'
internshipController.editInternshipPost);

router.delete('/delete-internship/:internshipId',authMiddleware,
  authorizeRole("recruiter"),
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.tags = ['Recruiters']
  // #swagger.summary = 'Delete Internship Post'
internshipController.deleteInternshipPost);

//ENROLLMENT
router.get('/enrollments/get-completed',authMiddleware,authorizeRole("recruiter"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags = ['Recruiters']
// #swagger.summary = 'Get list of completed enrollments'
recruiterProfile.viewAllTasks);

router.post('/enrollments/:enrollmentId/review',authMiddleware,authorizeRole("recruiter"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags = ['Recruiters']
// #swagger.summary = 'Review Enrollment'
recruiterProfile.reviewEnrollment);

// router.post('/certificates/enrollments/:enrollmentId/generate',authMiddleware,authorizeRole("recruiter"),recruiterProfile.generateCertForEnrollment);

router.post('/certificates/enrollments/:enrollmentId/generate',authMiddleware,authorizeRole("recruiter"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags = ['Recruiters']
// #swagger.summary = 'Generate Certficate'
recruiterProfile.generateAndUploadCertificate)

//PROFILE
router.get('/profile/overview',authMiddleware,authorizeRole("recruiter"),
// #swagger.security = [{ "bearerAuth": []}]
// #swagger.tags = ['Recruiters']
// #swagger.summary = 'General Overview'
recruiterProfile.getRecruiterAnalytics);

router.get('/profile/overview/simulations',authMiddleware,authorizeRole("recruiter"),
// #swagger.security = [{ "bearerAuth": []}]
// #swagger.tags = ['Recruiters']
// #swagger.summary = 'Simulation Stats By A Specific Company'
recruiterProfile.getAllSimulationsByCompany);

router.get('/profile/overview/simulations/:simulationId',authMiddleware,authorizeRole("recruiter"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags = ['Recruiters']
// #swagger.summary = 'View Specific Simulation '
recruiterProfile.getSingleCompanySimulationWithTasks);
no
router.get('/profile/overview/simulations/participants',authMiddleware,authorizeRole("recruiter"),
// #swagger.security = [{"bearerAuth": [] }]
// #swagger.tags = ['Recruiters']
// #swagger.summary = 'Participant Stats For A Specific Company'
recruiterProfile.getAllParticipantsByCompanyId);

router.get('/profile/overview/internships',authMiddleware,authorizeRole("recruiter"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags = ['Recruiters']
// #swagger.summary = 'List of Internships by A Specific Company'
recruiterProfile.getAllInternshipsByCompanyId);

router.get('/profile/overview/internships/:internshipId',authMiddleware,authorizeRole("recruiter"),
// #swagger.security= [{ "bearerAuth": [] }]
// #swagger.tags = ['Recruiters']
// #swagger.summary = 'Details of A single internship'
recruiterProfile.getSingleCompanyInternshipById);

router.get('/profile/overview/internships/:internshipId/applicants',authMiddleware,authorizeRole("recruiter"),
// #swagger.security = [{"bearerAuth": [] }]
// #swagger.tags = ['Recruiters']
// #swagger.summary = 'Get List of Specific Internship Applicants'
recruiterProfile.getAllInternshipsApplicants);




module.exports=router;