const {Router} = require("express");
const router = Router();
const {verifyRecruiter,unverifyRecruiter} = require("../controllers/adminController.controller");
const adminController= require("../controllers/adminController.controller");
const { authMiddleware, authorizeRole } = require("../middleware/authMiddleware.middleware");

// router.post('/create-company',createCompany);

router.get('/profile/overview',authMiddleware,authorizeRole("admin"),adminController.getAppAnalytics);
router.get('/profile/users/students',authMiddleware,authorizeRole("admin"),adminController.getStudents);
router.get('/profile/users/recruiters',authMiddleware,authorizeRole("admin"),adminController.getRecruiters);
router.get('/profile/companies',authMiddleware,authorizeRole("admin"),adminController.getCompanies);


router.patch('/profile/verify-recruiter/:id',verifyRecruiter);
router.patch('/profile/unverify-recruiter/:id',unverifyRecruiter);

module.exports=router;