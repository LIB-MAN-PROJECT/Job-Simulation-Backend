const {Router} = require("express");
const router = Router();
const {verifyRecruiter,unverifyRecruiter} = require("../controllers/adminController.controller");
const adminController= require("../controllers/adminController.controller");
const { authMiddleware, authorizeRole } = require("../middleware/authMiddleware.middleware");

// router.post('/create-company',createCompany);

router.get('/profile/overview',authMiddleware,authorizeRole("admin"),
// #swagger.security = [{"bearerAuth": [] }]
// #swagger.tags = ['Admins']
// #swagger.summary = 'General Statistical Overview'
adminController.getAppAnalytics);

router.get('/profile/users/students',authMiddleware,authorizeRole("admin"),
// #swagger.security = [{"bearerAuth": []}]
// #swagger.tags = ['Admins']
// #swagger.summary ='Obtain list of students'
adminController.getStudents);

router.get('/profile/users/recruiters',authMiddleware,authorizeRole("admin"),
// #swagger.security = [{"bearerAuth": []}]
// #swagger.tags = ['Admins']
// #swagger.summary ='Obtain list of recruiters'
adminController.getRecruiters);

router.get('/profile/companies',authMiddleware,authorizeRole("admin"),
// #swagger.security = [{"bearerAuth": []}]
// #swagger.tags = ['Admins']
// #swager.summary ='Obtain list of companies (organizations)'
adminController.getCompanies);


router.patch('/profile/verify-recruiter/:id',
// #swagger.security=[{"bearerAuth": [] }]
// #swagger.tags = ['Admins']
// #swagger.summary = 'Verify recruiter'
verifyRecruiter);

router.patch('/profile/unverify-recruiter/:id',
// #swagger.security = [{"bearerAuth": []}]
// #swagger.tags = ['Admins']
// #swagger.summary = 'Revoke recruiter verification status'
unverifyRecruiter);

module.exports=router;