const {Router} = require("express");
const { signup, login,newSignUp } = require("../controllers/authController.controller");
const { uploadImage } = require("../config/fileUpload.config");
const validateSchema = require("../middleware/validateRequest.middleware");
const signupSchema = require("../validation/signupSchema.schema");
const loginSchema = require("../validation/loginSchema.schema");
const router = Router();


router.post("/signup",uploadImage.single("file"),validateSchema(signupSchema),
// #swagger.tags=['Users','Recruiters', 'Admins']
// #swagger.summary = 'Sign Up'
// #swagger.consumes = ['multipart/form-data']
/* #swagger.parameters['file'] = {
     in: 'formData',
     type: 'file',
     required: false,
     description: 'Profile image (JPEG/PNG, max 5MB)'
} */
signup);

router.post("/newsignup",validateSchema(signupSchema),
// #swagger.tags = ['Users','Recruiters','Admins']
// #swagger.summary = 'New Sign Up (Untested)'
newSignUp);

router.post("/login",validateSchema(loginSchema),
// #swagger.tags=['Users','Recruiters', 'Admins']
// #swagger.summary = 'Log In'
login);

module.exports= router;
