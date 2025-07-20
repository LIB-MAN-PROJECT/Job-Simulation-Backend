const {Router} = require("express");
const internshipController = require("../controllers/internshipController.controller");
const jobSimulationController= require("../controllers/jobSimulationController.controller")
const enrollmentController = require("../controllers/enrollmentController.controller");
const { authMiddleware, authorizeRole } = require("../middleware/authMiddleware.middleware");
const taskSubmissionController =require("../controllers/taskSubmissionController.controller");
const { uploadDocument } = require("../config/fileUpload.config");
const router= Router();

//SIMULATIONS
router.get('/view-all-simulations',jobSimulationController.viewAllJobSims)

router.get('/view-simulations/:id',jobSimulationController.viewJobSimsById);

router.get('/simulations/search',jobSimulationController.searchSimulations);

//ENROLLMENT
router.post('/simulation/:id/enroll',authMiddleware,authorizeRole("student"),enrollmentController.enrollInJobSim);

//Unenroll
//  router.delete('/simulation/:userid/simulations/:simid',enrollmentController.unenrollInJobSim);

//Submitting tasks
router.post('/simulation/:simulationId/task/:taskId/submit-task',authMiddleware,authorizeRole("student"),uploadDocument.single("file"),taskSubmissionController.submitTask);

//Editing Submitted task
router.put('/simulation/:simulationId/task/:taskId/submission/:taskSubmissonId',authMiddleware,authorizeRole("student"),uploadDocument.single("file"),taskSubmissionController.editSubmittedTask);

//INTERNSHIP POSTS
router.get('/view-all-internships',internshipController.viewAllInternshipPosts);

router.get('/view-internships/:id',internshipController.viewInternshipPostById);

router.post('/view-internships/:internshipId/apply',authMiddleware,authorizeRole("student"),uploadDocument.single("file"),internshipController.applyForInternship);

router.get('/internships/search',internshipController.searchInternships);



module.exports = router;
