const {Router} = require("express");
const internshipController = require("../controllers/internshipController.controller");
const jobSimulationController= require("../controllers/jobSimulationController.controller")
const enrollmentController = require("../controllers/enrollmentController.controller");
const { authMiddleware, authorizeRole } = require("../middleware/authMiddleware.middleware");
const taskSubmissionController =require("../controllers/taskSubmissionController.controller");
const userProfileController = require("../controllers/userProfileController.controller");
const reviewController= require("../controllers/reviewController");
const { uploadDocument } = require("../config/fileUpload.config");
const recruiterProfile = require("../controllers/recruiterProfileController.controller");

const router= Router();

//SIMULATIONS
router.get('/view-all-simulations',jobSimulationController.viewAllJobSims)

  // #swagger.security = [{ "bearerAuth": [] }]
router.get('/view-simulations/:simulationId',authMiddleware,jobSimulationController.viewJobSimsById);

router.get('/simulations/search',jobSimulationController.searchSimulations);

//ENROLLMENT
  // #swagger.security = [{ "bearerAuth": [] }]
router.post('/simulation/:simulationId/enroll',authMiddleware,authorizeRole("student"),enrollmentController.enrollInJobSim);

//Unenroll

router.delete('/profile/simulation/:userid/simulations/:simulationId',enrollmentController.unenrollInJobSim);

//Submitting tasks
  // #swagger.security = [{ "bearerAuth": [] }]
router.post('/simulation/:simulationId/task/:taskId/submit-task',authMiddleware,authorizeRole("student"),uploadDocument.single("file"),taskSubmissionController.submitTask);

//Editing Submitted task
  // #swagger.security = [{ "bearerAuth": [] }]
router.put('/simulation/:simulationId/task/:taskId/submission/:taskSubmissonId/edit-submission',authMiddleware,authorizeRole("student"),uploadDocument.single("file"),taskSubmissionController.editSubmittedTask);

  // #swagger.security = [{ "bearerAuth": [] }]
router.delete('/simulation/:simulationId/task/:taskId/submission/:taskSubmissonId/delete-submission',authMiddleware,authorizeRole("student"),taskSubmissionController.deleteSubmittedTask);

//REVIEWS
  // #swagger.security = [{ "bearerAuth": [] }]
router.post('/simulation/:simulationId/create-review',authMiddleware,authorizeRole("student"),reviewController.sendReview);

  // #swagger.security = [{ "bearerAuth": [] }]
router.put('/simulation/:simulationId/:reviewId/edit-review',authMiddleware,authorizeRole("student"),reviewController.editReview);


//INTERNSHIP POSTS
router.get('/view-all-internships',internshipController.viewAllInternshipPosts);

router.get('/view-internships/:internshipId',internshipController.viewInternshipPostById);

  // #swagger.security = [{ "bearerAuth": [] }]
router.post('/view-internships/:internshipId/apply',authMiddleware,authorizeRole("student"),uploadDocument.single("file"),internshipController.applyForInternship);

router.get('/internships/search',internshipController.searchInternships);


//USER PROFILE

  // #swagger.security = [{ "bearerAuth": [] }]
router.get('/profile/stats',authMiddleware,authorizeRole("student"),userProfileController.getUserStats);

  // #swagger.security = [{ "bearerAuth": [] }]
router.get('/profile/account',authMiddleware,authorizeRole("student"),userProfileController.getUserProfile);

  // #swagger.security = [{ "bearerAuth": [] }]
router.get('/profile/enrollments',authMiddleware,authorizeRole("student"),userProfileController.getEnrolledSimulations);

  // #swagger.security = [{ "bearerAuth": [] }]
router.get('/profile/applications',authMiddleware,authorizeRole("student"),userProfileController.getAppliedInternships);

  // #swagger.security = [{ "bearerAuth": [] }]
router.get('/profile/certificates',authMiddleware,authorizeRole("student"),userProfileController.getCertificates);

router.post('/profile/certificates/enrollments/:enrollmentId/generate',authMiddleware,authorizeRole("student"),recruiterProfile.generateAndUploadCertificate);

module.exports = router;
