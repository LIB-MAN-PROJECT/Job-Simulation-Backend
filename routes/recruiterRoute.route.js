const {Router} = require("express");
const jobSimulationController = require("../controllers/jobSimulationController.controller");
const internshipController=require("../controllers/internshipController.controller");
const companyController= require("../controllers/companyController.controller");
const { authMiddleware,authorizeRole,allowedRoles } = require("../middleware/authMiddleware.middleware");
const {uploadImage,uploadDocument}= require("../config/fileUpload.config");
const  recruiterProfile= require("../controllers/recruiterProfileController.controller");

const router = Router();

//COMPANY ROUTES
router.post('/create-company',uploadImage.single("file"),authMiddleware,
authorizeRole("recruiter"),companyController.createCompany);

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
router.post('/create-job-simulation',uploadImage.single("file"),
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
router.put('/edit-job-simulation/:simulationId',uploadImage.single("file"),
authMiddleware,authorizeRole("recruiter"),jobSimulationController.editJobSimById);

router.delete('/delete-job-simulation/:simulationId',authMiddleware,
authorizeRole("recruiter"),jobSimulationController.deleteJobSimById);

//TASK ROUTES
router.post('/create-task/:simulationId',authMiddleware,
authorizeRole("recruiter"),jobSimulationController.createTask);

router.put('/edit-task/:taskId',authMiddleware,authorizeRole("recruiter"),jobSimulationController.editTask);

router.delete('/delete-task/:taskId',authMiddleware,authorizeRole("recruiter"),jobSimulationController.deleteTask);

//INTERNSHIP ROUTES
router.post('/create-internship',authMiddleware,
authorizeRole("recruiter"),internshipController.createInternshipPost);

router.put('/edit-internship/:internshipId',authMiddleware,
authorizeRole("recruiter"),internshipController.editInternshipPost);

router.delete('/delete-internship/:internshipId',authMiddleware,
authorizeRole("recruiter"),internshipController.deleteInternshipPost);

//ENROLLMENT
router.get('/enrollments/get-completed',authMiddleware,authorizeRole("recruiter"),recruiterProfile.viewAllCompletedTasks);

router.post('/enrollments/:enrollmentId/review',authMiddleware,authorizeRole("recruiter"),recruiterProfile.reviewEnrollment);

router.post('/certificates/enrollments/:enrollmentId/generate',authMiddleware,authorizeRole("recruiter"),recruiterProfile.generateCertForEnrollment);

module.exports=router;