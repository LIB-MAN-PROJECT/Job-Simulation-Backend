const PDFDocument = require('pdfkit');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary.config')
const sendEmail = require('../utils/sendEmail');


const generateCertificate = async ({ nameOnCertificate, simulationName, userEmail, filenameBase }) => {
  try {
    // 🎯 Create PDF document in memory
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));

    // 🧾 Add content to the PDF
    doc
      .fillColor('#6A0DAD')                    // Header color
      .font('Helvetica-Bold')
      .fontSize(28)
      .text('Certificate of Completion', { align: 'center' });

    doc.moveDown(2);

    doc
      .fillColor('#000000')                    // Name section
      .font('Helvetica')
      .fontSize(24)
      .text(`Presented to: ${nameOnCertificate}`, { align: 'center' });

    doc.moveDown(1.5);

    doc
      .fontSize(18)
      .text('For successfully completing the simulation:', { align: 'center' });

    doc.moveDown(1);

    doc
      .fillColor('#6A0DAD')
      .fontSize(26)
      .font('Helvetica-Bold')
      .text(`"${simulationName}"`, { align: 'center' });

    doc.moveDown(2);

    doc
      .fillColor('#444')
      .fontSize(14)
      .font('Helvetica')
      .text(`Issued on: ${new Date().toDateString()}`, { align: 'center' });

    // 🖼️ Optional decorative border
    doc
      .lineWidth(4)
      .strokeColor('#6A0DAD')
      .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .stroke();

    doc.end();

    // 📦 Create full buffer after writing
    await new Promise(resolve => doc.on('end', resolve));
    const pdfBuffer = Buffer.concat(buffers);

    // ☁️ Upload buffer to Cloudinary
    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'upskill/certificates',
            public_id: filenameBase,
            resource_type: 'raw',
            format: 'pdf',
            transformation:[{flags: 'attachment'}]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(pdfBuffer).pipe(stream);
      });

    const uploaded = await streamUpload();

    // 💌 Send certificate email
    const emailHTML = `
      <h2>🎓 Certificate of Completion</h2>
      <p>Hi ${nameOnCertificate},</p>
      <p>You've successfully completed <strong>${simulationName}</strong>.</p>
      <p>Your certificate is ready: <a href="${uploaded.secure_url}" target="_blank">Download</a></p>
      <br/>
      <p>Congratulations again!<br/>Upskill Team</p>
    `;

    await sendEmail({
      to: userEmail,
      subject: 'Your Certificate of Completion',
      html: emailHTML
    });

    // ✅ Return metadata for storage
    return {
      certUrl: uploaded.secure_url,
      certPublicId: uploaded.public_id,
      certIssuedAt: new Date()
    };

  } catch (error) {
    console.error('🚨 Certificate generation failed:', error);
    throw error;
  }
};

module.exports = generateCertificate;
