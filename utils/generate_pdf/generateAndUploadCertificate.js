const path = require("path");
const generatePdfLocally = require("../generate_pdf/generatePdfLocally");
const uploadLocalPdfToCloudinary = require("../generate_pdf/uploadLocalPdfToCloudinary");
const sendEmail = require("../sendEmail");
const Certificate = require("../../models/certificateModel.model");
const Enroll = require("../../models/enrollmentModel.model");
const { errorMessage } = require("../responseHandler.util");

/**
 * @param {string} enrollmentId - The enrollment to generate a certificate for
 * @returns {object} - Certificate metadata saved in DB
 */
const generateAndDispatchCertificate = async (enrollmentId) => {
  const enrollment = await Enroll.findById(enrollmentId).populate("userId simulationId");
  if (!enrollment) throw new Error("Enrollment not found");
 
  // 💡 Optional check for duplicates
    const existing = await Certificate.findOne({ enrollmentId });
    if (existing) return errorMessage(res, 409, "Certificate already issued");

  if (enrollment.feedbackState !== "Accepted") {
    return errorMessage(res, 400, "Certificate can only be issued for accepted enrollments");
  }

  const userName = `${enrollment.userId.firstName} ${enrollment.userId.lastName}`;
  const simulationName = enrollment.simulationId.title;
  const userEmail = enrollment.userId.email;
  const filenameBase = `cert_${enrollmentId}_${Date.now()}`;
  const outputFolder = path.join(__dirname, "../certificates");

  // Step 1: Generate PDF and save locally
  const localPdfPath = await generatePdfLocally({
    nameOnCertificate: userName,
    simulationName,
    outputFolder
  });

  // Step 2: Upload to Cloudinary
  const certMeta = await uploadLocalPdfToCloudinary(localPdfPath, filenameBase);

  // Step 3: Save certificate record to database
  const certificate = await Certificate.create({
    userId: enrollment.userId._id,
    fullName: userName,
    simulationId: enrollment.simulationId._id,
    enrollmentId,
    certUrl: certMeta.certUrl,
    certPublicId: certMeta.certPublicId,
    downloadUrl: certMeta.downloadUrl,
    issuedAt: certMeta.certIssuedAt
  });

  // Step 4: Send confirmation email
  const emailHTML = `
    <h2>🎓 Certificate of Completion</h2>
    <p>Hi ${userName},</p>
    <p>You’ve successfully completed <strong>${simulationName}</strong>.</p>
    <p>Your certificate is ready: <button><a href="${certMeta.downloadUrl}" target="_blank">Click to Download</a></button></p>
    <br/>
    <p>Congratulations again!<br/>Upskill Team</p>
  `;

  await sendEmail({
    to: userEmail,
    subject: "Your Certificate of Completion",
    html: emailHTML
  });

  return certificate;
};

module.exports = generateAndDispatchCertificate;
