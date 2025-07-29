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
  // #swagger.security = [{ "bearerAuth": [] }]
router.post('/create-company',uploadImage.single("file"),authMiddleware,
authorizeRole("recruiter"),companyController.createCompany);

  // #swagger.security = [{ "bearerAuth": [] }]
router.put('/edit-company/:companyId',uploadImage.single("file"),authMiddleware,authorizeRole("recruiter"),companyController.editCompany);

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
  // #swagger.security = [{ "bearerAuth": [] }]
router.post('/create-job-simulation',uploadImage.single("file"),validateSchema(createSimulationSchema),
authMiddleware,authorizeRole("recruiter"),jobSimulationController.createJobSim);

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

  // #swagger.security = [{ "bearerAuth": [] }]
router.put('/edit-job-simulation/:simulationId',uploadImage.single("file"),
authMiddleware,authorizeRole("recruiter"),jobSimulationController.editJobSimById);
  // #swagger.security = [{ "bearerAuth": [] }]
router.delete('/delete-job-simulation/:simulationId',authMiddleware,
authorizeRole("recruiter"),jobSimulationController.deleteJobSimById);

//TASK ROUTES
  // #swagger.security = [{ "bearerAuth": [] }]
router.post('/create-task/:simulationId',authMiddleware,
authorizeRole("recruiter"),validateSchema(createTaskSchema),jobSimulationController.createTask);

  // #swagger.security = [{ "bearerAuth": [] }]
router.put('/edit-task/:taskId',authMiddleware,authorizeRole("recruiter"),jobSimulationController.editTask);

  // #swagger.security = [{ "bearerAuth": [] }]
router.delete('/delete-task/:taskId',authMiddleware,authorizeRole("recruiter"),jobSimulationController.deleteTask);

//INTERNSHIP ROUTES
  // #swagger.security = [{ "bearerAuth": [] }]
router.post('/create-internship',authMiddleware,
authorizeRole("recruiter"),validateSchema(createInternshipPostSchema),internshipController.createInternshipPost);

  // #swagger.security = [{ "bearerAuth": [] }]
router.put('/edit-internship/:internshipId',authMiddleware,
authorizeRole("recruiter"),internshipController.editInternshipPost);
  // #swagger.security = [{ "bearerAuth": [] }]
router.delete('/delete-internship/:internshipId',authMiddleware,
authorizeRole("recruiter"),internshipController.deleteInternshipPost);

//ENROLLMENT
router.get('/enrollments/get-completed',authMiddleware,authorizeRole("recruiter"),recruiterProfile.viewAllTasks);

router.post('/enrollments/:enrollmentId/review',authMiddleware,authorizeRole("recruiter"),recruiterProfile.reviewEnrollment);

// router.post('/certificates/enrollments/:enrollmentId/generate',authMiddleware,authorizeRole("recruiter"),recruiterProfile.generateCertForEnrollment);

router.post('/certificates/enrollments/:enrollmentId/generate',authMiddleware,authorizeRole("recruiter"),recruiterProfile.generateAndUploadCertificate)

//PROFILE
router.get('/profile/overview',authMiddleware,authorizeRole("recruiter"),recruiterProfile.getRecruiterAnalytics);

router.get('/profile/overview/simulations',authMiddleware,authorizeRole("recruiter"),recruiterProfile.getAllSimulationsByCompany);

router.get('/profile/overview/simulations/:simulationId',authMiddleware,authorizeRole("recruiter"),recruiterProfile.getSingleCompanySimulationWithTasks);

router.get('/profile/overview/simulations/participants',authMiddleware,authorizeRole("recruiter"),recruiterProfile.getAllParticipantsByCompanyId);

router.get('/profile/overview/internships',authMiddleware,authorizeRole("recruiter"),recruiterProfile.getAllInternshipsByCompanyId);

router.get('/profile/overview/internships/:internshipId',authMiddleware,authorizeRole("recruiter"),recruiterProfile.getSingleCompanyInternshipById);

router.get('/profile/overview/internships/:internshipId/applicants',authMiddleware,authorizeRole("recruiter"),recruiterProfile.getAllInternshipsApplicants);




module.exports=router;