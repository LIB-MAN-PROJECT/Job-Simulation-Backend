const express = require("express");
const router = express.Router();
const  certificateContoller  = require("../contollers/certificateContoller");
const authMiddleware = require("../middleware/auth");

router.post("/generate", authMiddleware, certificateContoller.generateCertificate);

module.exports = router;
