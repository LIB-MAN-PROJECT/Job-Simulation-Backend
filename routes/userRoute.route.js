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
router.get('/view-all-simulations',
// #swagger.tags=['Users']
jobSimulationController.viewAllJobSims)

  
router.get('/view-simulations/:simulationId',authMiddleware,
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
jobSimulationController.viewJobSimsById);

router.get('/simulations/search',jobSimulationController.searchSimulations);

//ENROLLMENT
router.post('/simulation/:simulationId/enroll',authMiddleware,authorizeRole("student"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
enrollmentController.enrollInJobSim);

//Unenroll

router.delete('/profile/simulation/:userid/simulations/:simulationId', // #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
enrollmentController.unenrollInJobSim);

//Submitting tasks
router.post('/simulation/:simulationId/task/:taskId/submit-task',authMiddleware,authorizeRole("student"),uploadDocument.single("file"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
taskSubmissionController.submitTask);

//Editing Submitted task
  // #swagger.security = [{ "bearerAuth": [] }]
router.put('/simulation/:simulationId/task/:taskId/submission/:taskSubmissonId/edit-submission',authMiddleware,authorizeRole("student"),uploadDocument.single("file"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
taskSubmissionController.editSubmittedTask);

  //Deleting submitted task
router.delete('/simulation/:simulationId/task/:taskId/submission/:taskSubmissonId/delete-submission',authMiddleware,authorizeRole("student"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
taskSubmissionController.deleteSubmittedTask);

//REVIEWS
  // Create review
router.post('/simulation/:simulationId/create-review',authMiddleware,authorizeRole("student"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
reviewController.sendReview);

  // Edit review
router.put('/simulation/:simulationId/:reviewId/edit-review',authMiddleware,authorizeRole("student"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
reviewController.editReview);


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


module.exports = router;
