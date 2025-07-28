const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");


const generatePdfLocally = async ({ nameOnCertificate, simulationName, outputFolder }) => {
  const filename = `certificate_${Date.now()}.pdf`;
  const filePath = path.join(outputFolder, filename);

  // Ensure folder exists
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margins: { top: 50, bottom: 50, left: 50, right: 50 } // equal margins
  });

  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Create linear gradient border background
  const gradient = doc.linearGradient(50, 50, doc.page.width - 50, 50);
  gradient.stop(0, "#f59e0b").stop(1, "#14b8a6");

  // Draw border rectangle with gradient stroke
  doc.save();
  doc.lineWidth(6)
    .stroke(gradient)
    .rect(50, 50, doc.page.width - 100, doc.page.height - 100)
    .stroke();
  doc.restore();

  // Certificate content
  doc.fillColor("#00B7A3").font("Helvetica-Bold").fontSize(28)
    .text("Certificate of Completion", { align: "center" });

  doc.moveDown(2).fillColor("#000").font("Helvetica").fontSize(24)
    .text(`Presented to: ${nameOnCertificate}`, { align: "center" });

  doc.moveDown(1.5).fontSize(18)
    .text("For successfully completing the simulation:", { align: "center" });

  doc.moveDown(1).fillColor("#009588").fontSize(26).font("Helvetica-Bold")
    .text(`"${simulationName}"`, { align: "center" });

  doc.moveDown(2).fillColor("#444").fontSize(14).font("Helvetica")
    .text(`Issued on: ${new Date().toDateString()}`, { align: "center" });

  doc.end();


  // Wait for stream to finish writing
  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => {
      // Optional: Validate file
      if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
        reject(new Error("PDF file is empty or missing"));
      } else {
        resolve(filePath);
      }
    });

    writeStream.on("error", reject);
  });
};


module.exports = generatePdfLocally;
