const {Router} = require("express");
const jobSimulationController = require("../controllers/jobSimulationController.controller");
const internshipController=require("../controllers/internshipController.controller");
const companyController= require("../controllers/companyController.controller");
const { authMiddleware,authorizeRole,allowedRoles } = require("../middleware/authMiddleware.middleware");
const {uploadImage,uploadDocument}= require("../config/fileUpload.config")


const router = Router();

//COMPANY ROUTES
router.post('/create-company',uploadImage.single("file"),authMiddleware,
authorizeRole("recruiter"),companyController.createCompany);

router.put('/edit-company/:id',uploadImage.single("file"),authMiddleware,authorizeRole("recruiter"),companyController.editCompany);

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
router.post('/create-job-sim',uploadImage.single("file"),
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
router.put('/edit-job-sim/:id',uploadImage.single("file"),
authMiddleware,authorizeRole("recruiter"),jobSimulationController.editJobSimById);

router.delete('/delete-job-sim/:id',authMiddleware,
authorizeRole("recruiter"),jobSimulationController.deleteJobSimById);

//TASK ROUTES
router.post('/create-task/:id',authMiddleware,
authorizeRole("recruiter"),jobSimulationController.createTask);

router.put('/edit-task/:id',authMiddleware,authorizeRole("recruiter"),jobSimulationController.editTask);

router.delete('/delete-task/:id',authMiddleware,authorizeRole("recruiter"),jobSimulationController.deleteTask);

//INTERNSHIP ROUTES
router.post('/create-internship',authMiddleware,
authorizeRole("recruiter"),internshipController.createInternshipPost);

router.put('/edit-internship/:id',authMiddleware,
authorizeRole("recruiter"),internshipController.editInternshipPost);

router.delete('delete-internship/:id',authMiddleware,
authorizeRole("recruiter"),internshipController.deleteInternshipPost);

module.exports=router;