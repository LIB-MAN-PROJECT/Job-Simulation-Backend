const {Router} = require("express");
const internshipController = require("../controllers/internshipController.controller");
const jobSimulationController= require("../controllers/jobSimulationController.controller")
const enrollmentController = require("../controllers/enrollmentController.controller");
const { authMiddleware, authorizeRole } = require("../middleware/authMiddleware.middleware");
const taskSubmissionController =require("../controllers/taskSubmissionController.controller");
const reviewController= require("../controllers/reviewController");
const { uploadDocument } = require("../config/fileUpload.config");
const router= Router();

//SIMULATIONS
router.get('/view-all-simulations',jobSimulationController.viewAllJobSims)

router.get('/view-simulations/:simulationId',authMiddleware,jobSimulationController.viewJobSimsById);

router.get('/simulations/search',jobSimulationController.searchSimulations);

//ENROLLMENT
router.post('/simulation/:simulationId/enroll',authMiddleware,authorizeRole("student"),enrollmentController.enrollInJobSim);

//Unenroll
//  router.delete('/simulation/:userid/simulations/:simulationId',enrollmentController.unenrollInJobSim);

//Submitting tasks
router.post('/simulation/:simulationId/task/:taskId/submit-task',authMiddleware,authorizeRole("student"),uploadDocument.single("file"),taskSubmissionController.submitTask);

//Editing Submitted task
router.put('/simulation/:simulationId/task/:taskId/submission/:taskSubmissonId/edit-submission',authMiddleware,authorizeRole("student"),uploadDocument.single("file"),taskSubmissionController.editSubmittedTask);

router.delete('/simulation/:simulationId/task/:taskId/submission/:taskSubmissonId/delete-submission',authMiddleware,authorizeRole("student"),taskSubmissionController.deleteSubmittedTask);

//REVIEWS
router.post('/simulation/:simulationId/create-review',authMiddleware,authorizeRole("student"),reviewController.sendReview);

router.put('/simulation/:simulationId/:reviewId/edit-review',authMiddleware,authorizeRole("student"),reviewController.editReview);


//INTERNSHIP POSTS
router.get('/view-all-internships',internshipController.viewAllInternshipPosts);

router.get('/view-internships/:internshipId',internshipController.viewInternshipPostById);

router.post('/view-internships/:internshipId/apply',authMiddleware,authorizeRole("student"),uploadDocument.single("file"),internshipController.applyForInternship);

router.get('/internships/search',internshipController.searchInternships);

module.exports = router;
