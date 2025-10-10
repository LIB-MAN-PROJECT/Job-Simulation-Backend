const {Router} = require("express");
const internshipController = require("../controllers/internshipController.controller");
const jobSimulationController= require("../controllers/jobSimulationController.controller")
const enrollmentController = require("../controllers/enrollmentController.controller");
const { authMiddleware, authorizeRole } = require("../middleware/authMiddleware.middleware");
const taskSubmissionController =require("../controllers/taskSubmissionController.controller");
const userProfileController = require("../controllers/userProfileController.controller");
const reviewController= require("../controllers/reviewController");
const { uploadDocument } = require("../config/fileUpload.config");

const router= Router();

//SIMULATIONS
router.get('/view-all-simulations',
// #swagger.tags=['Users','Recruiters','Admins']
// #swagger.summary = 'View All Simulations'
jobSimulationController.viewAllJobSims)

  
router.get('/view-simulations/:simulationId',authMiddleware,
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
// #swagger.summary='View specific simulation by its document id'
jobSimulationController.viewJobSimsById);

router.get('/simulations/search',
//#swagger.summary='Search for simulations via different metrics'
jobSimulationController.searchSimulations);

//ENROLLMENT
router.post('/simulation/:simulationId/enroll',authMiddleware,authorizeRole("student"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
// #swagger.summary='Enroll for simulation'
enrollmentController.enrollInJobSim);

//Unenroll

router.delete('/profile/simulation/:userid/simulations/:simulationId', 
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
// #swagger.summary='Uneroll simulation'
enrollmentController.unenrollInJobSim);

//Submitting tasks
router.post('/simulation/:simulationId/task/:taskId/submit-task',authMiddleware,authorizeRole("student"),uploadDocument.single("file"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
// #swagger.summary='Submit tasks'
// #swagger.description='Only documents should be submitted'
taskSubmissionController.submitTask);

//Editing Submitted task
  // #swagger.security = [{ "bearerAuth": [] }]
router.put('/simulation/:simulationId/task/:taskId/submission/:taskSubmissonId/edit-submission',authMiddleware,authorizeRole("student"),uploadDocument.single("file"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
// #swagger.summary='Edit submitted task'
taskSubmissionController.editSubmittedTask);

  //Deleting submitted task
router.delete('/simulation/:simulationId/task/:taskId/submission/:taskSubmissonId/delete-submission',authMiddleware,authorizeRole("student"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
// #swagger.summary='Delete task'
taskSubmissionController.deleteSubmittedTask);

//REVIEWS
  // Create review
router.post('/simulation/:simulationId/create-review',authMiddleware,authorizeRole("student"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
// #swagger.summary = 'Create & send review'
reviewController.sendReview);

  // Edit review
router.put('/simulation/:simulationId/:reviewId/edit-review',authMiddleware,authorizeRole("student"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
// #swagger.summary= 'Edit review'
reviewController.editReview);


//INTERNSHIP POSTS
router.get('/view-all-internships',internshipController.viewAllInternshipPosts);

router.get('/view-internships/:internshipId',internshipController.viewInternshipPostById);

  // #swagger.security = [{ "bearerAuth": [] }]
router.post('/view-internships/:internshipId/apply',authMiddleware,authorizeRole("student"),uploadDocument.single("file"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
// #swagger.summary= 'Internship Application'
internshipController.applyForInternship);

router.get('/internships/search',
// #swagger.security=[{"bearerAuth": [] }]
// #swagger.tags=['Users']
// #swagger.summary='Backend Search & Flitering'
internshipController.searchInternships);


//USER PROFILE

router.get('/profile/stats',authMiddleware,authorizeRole("student"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
// #swagger.summary = 'View User Profile'
userProfileController.getUserStats);

router.get('/profile/account',authMiddleware,authorizeRole("student"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
// #swagger.summary = 'View User Account Details'
userProfileController.getUserProfile);

router.get('/profile/enrollments',authMiddleware,authorizeRole("student"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
// #swagger.summary = 'View Simulations enrolled in'
userProfileController.getEnrolledSimulations);

router.get('/profile/applications',authMiddleware,authorizeRole("student"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
// #swagger.summary = 'View Internships applied for'
userProfileController.getAppliedInternships);

router.get('/profile/certificates',authMiddleware,authorizeRole("student"),
// #swagger.security = [{ "bearerAuth": [] }]
// #swagger.tags=['Users']
// #swagger.summary = 'View User Certificates'
userProfileController.getCertificates);


module.exports = router;
