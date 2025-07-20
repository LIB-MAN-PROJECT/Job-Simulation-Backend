const {Router} = require("express");
const { signup, login } = require("../controllers/authController.controller");
const { uploadImage } = require("../config/fileUpload.config");
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
router.post("/signup",uploadImage.single("file"),signup);
router.post("/login",login);

module.exports= router;
