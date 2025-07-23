const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config(); // Load your .env

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Sends an email
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Subject line
 * @param {string} options.html - HTML content of the email
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Upskill Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log(` Email sent to ${to}: ${info.messageId}`);
    return info;

  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw error; // Forward the error to be handled by the calling function
  }
};


module.exports = sendEmail;