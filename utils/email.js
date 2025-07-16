const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const getMessage= require("./welcomeEmailtemplate")
dotenv.config(); // Load your .env

// transporter setup (using Gmail or Mailtrap, see below)
const transporter = nodemailer.createTransport({
  service: "gmail", // or use 'smtp.mailtrap.io' if you're testing
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (toEmail, username) => {
  const mailOptions = {
    from: `"Lumini App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Welcome to Lumini App ",
    html: getMessage(username)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(" Welcome email sent to", toEmail);
    return true;
  } catch (err) {
    console.error(" Email send failed:", err.message);
    return false;
  }
};

module.exports = { sendWelcomeEmail };