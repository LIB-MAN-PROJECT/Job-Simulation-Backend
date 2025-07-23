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

const getAdminEmails = () => {
  const emails = process.env.ADMIN_EMAILS;
  return emails ? emails.split(",").map(email => email.trim()) : [];
};


// General reusable email sender
const sendEmail = async (toEmail, subject, htmlContent) => {
  const mailOptions = {
    from: `"Lumini App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to", toEmail);
    return true;
  } catch (err) {
    console.error("Email failed:", err.message);
    return false;
  }
};


const sendWelcomeEmail = async (to, username) => {
  const subject = "Welcome to CareerLaunch App!";
  const html = `<p>Hello ${username},</p><p>Welcome to our platform!</p>`;
  await exports.sendEmail({ to, subject, html });
};


const notifyCompanyOfRecruiterJoinRequest = async (recruiterName, recruiterEmail, companyEmail, companyName) => {
  const subject = `Recruiter Join Request - ${recruiterName}`;
  const html = `
    <p>Hello ${companyName},</p>
    <p>The recruiter <strong>${recruiterName}</strong> (${recruiterEmail}) has requested to join your company.</p>
    <p>Please login and review this request.</p>
  `;
  await exports.sendEmail({ to: companyEmail, subject, html });
};

const notifyAdminsOfNewCompany = async (companyName, recruiterName, recruiterEmail) => {
  const subject = `New Company Created: ${companyName}`;
  const html = `
    <p>A new company <strong>${companyName}</strong> was created by recruiter <strong>${recruiterName}</strong> (${recruiterEmail}).</p>
    <p>Please review and approve the company in the admin dashboard.</p>
  `;

  const adminEmails = getAdminEmails();
  
  for (const email of adminEmails) {
    await exports.sendEmail({ to: email, subject, html });
  }
};




module.exports = { sendWelcomeEmail, sendEmail, notifyCompanyOfRecruiterJoinRequest ,notifyAdminsOfNewCompany  };