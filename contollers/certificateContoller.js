const PDFDocument = require("pdfkit");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("../utils/cloudinary");
const JobSimulation = require("../models/JobSimulationSchema");
const Certificate = require("../models/CertificateSchema");
const Task = require("../models/TaskSchema");
const TaskSubmission = require("../models/TaskSubmisionSchema");
const fs = require("fs");
const path = require("path");

exports.generateCertificate = async (req, res, next) => {
  try {
    const { simulationId, nameOnCertificate } = req.body;

    if (!simulationId || !nameOnCertificate) {
      return res
        .status(400)
        .json({ message: "Simulation ID and name are required" });
    }

    const userId = req.user.id;
    // 1. Check total tasks in simulation
    const totalTasks = await Task.countDocuments({ simulationId });

    // 2. Check how many tasks the user has submitted AND been approved
    const approvedSubmissions = await TaskSubmission.countDocuments({
      simulationId,
      userId,
      isSubmitted: true,
      reviewStatus: "approved", // Make sure you add this field to TaskSubmisionSchema
    });

    if (approvedSubmissions !== totalTasks) {
      // Fetch unapproved submissions with comments
      const unapproved = await TaskSubmission.find({
        simulationId,
        userId,
        reviewStatus: { $ne: "approved" },
      }).populate("taskId", "title");

      const feedback = unapproved.map((sub) => ({
        taskTitle: sub.taskId?.title || "Untitled Task",
        reviewStatus: sub.reviewStatus,
        reviewerComment: sub.reviewerComment || "No comment provided",
      }));

      return res.status(403).json({
        message:
          "Some tasks have not been approved. Please review the feedback and try again.",
        totalTasks,
        approvedSubmissions,
        feedback,
      });
    }

    // 3. Fetch the simulation for title
    const simulation = await JobSimulation.findById(simulationId);
    if (!simulation) {
      return res.status(404).json({ message: "Simulation not found" });
    }

    const simulationName = simulation.title;
    const certId = uuidv4();
    const certPath = path.join(__dirname, `../certs/${certId}.pdf`);

    // 4. Generate PDF
    const doc = new PDFDocument({ size: "A4", layout: "landscape" });
    doc.pipe(fs.createWriteStream(certPath));
    doc
      .fillColor("#6A0DAD")
      .font("Helvetica-Bold")
      .text("Certificate of Completion", { align: "center" });
    doc.moveDown(2);
    doc
      .fillColor("#000000")
      .fontSize(24)
      .font("Helvetica")
      .text(`Presented to: ${nameOnCertificate}`, { align: "center" });
    doc.moveDown(1.5);
    doc
      .fontSize(18)
      .text("For successfully completing the simulation:", { align: "center" });
    doc.moveDown(1);
    doc
      .fillColor("#6A0DAD")
      .fontSize(26)
      .font("Helvetica-Bold")
      .text(simulationName, { align: "center" });
    doc.moveDown(2);
    doc
      .fillColor("#333333")
      .fontSize(14)
      .font("Helvetica")
      .text(`Issued on: ${new Date().toDateString()}`, { align: "center" });
    doc
      .lineWidth(4)
      .strokeColor("#6A0DAD")
      .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .stroke();
    doc.end();

    // 5. Upload to Cloudinary
    const uploaded = await cloudinary.uploader.upload(certPath, {
      resource_type: "raw",
      folder: "certificates",
      public_id: certId,
    });

    // 6. Save to database
    const certificate = new Certificate({
      userId,
      simulationId,
      simulationName,
      certUrl: uploaded.secure_url,
      certId,
    });

    await certificate.save();
    fs.unlinkSync(certPath); // clean up local file

    res.status(201).json({
      message: "Certificate generated successfully",
      certificate,
    });
  } catch (err) {
    err.statusCode = 500;
    err.message = "Error generating certificate";
    next(err);
  }
};
