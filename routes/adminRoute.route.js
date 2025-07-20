const {Router} = require("express");
const router = Router();
const {verifyRecruiter,unverifyRecruiter} = require("../controllers/adminController.controller");


// router.post('/create-company',createCompany);

router.patch('/verify-recruiter/:id',verifyRecruiter);
router.patch('/unverify-recruiter/:id',unverifyRecruiter);

module.exports=router;