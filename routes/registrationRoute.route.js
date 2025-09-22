const {Router} = require("express");
const { signup, login } = require("../controllers/authController.controller");
const { uploadImage } = require("../config/fileUpload.config");
const validateSchema = require("../middleware/validateRequest.middleware");
const signupSchema = require("../validation/signupSchema.schema");
const loginSchema = require("../validation/loginSchema.schema");
const router = Router();


// File: routes/regsitrationRoute.route.js
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
router.post("/signup",uploadImage.single("file"),validateSchema(signupSchema),
// #swagger.tags=['Users','Recruiters', 'Admins']
// #swagger.summary = 'Sign Up'
signup);
router.post("/login",validateSchema(loginSchema),
// #swagger.tags=['Users','Recruiters', 'Admins']
// #swagger.summary = 'Log In'
login);

module.exports= router;
