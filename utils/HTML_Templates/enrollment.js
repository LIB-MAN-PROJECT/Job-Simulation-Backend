module.exports=(title,companyName)=>{

`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Job Simulation Name</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: "Segoe UI", Arial, sans-serif;
      background-color: #f4f4f4;
    }

    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    .header {
      background: linear-gradient(to right, 
  #f59e0b,  /* Amber */
  #eba61a,
  #e2ad29,
  #d9b438,
  #c4ba4f,
  #a5bf6e,
  #83c38f,
  #60c6b0,
  #38c7c6,
  #14b8a6   /* Teal */);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 26px;
    }

    .content {
      padding: 30px 20px;
      color: #333;
    }

    .content h2 {
      color: #f59e0b;
      margin-top: 0;
      font-size: 22px;
    }

    .content ul {
      padding-left: 20px;
    }

    .role-section {
      margin: 20px 0;
      background-color: #f9f9f9;
      padding: 15px;
      border-left: 4px solid #a5bf6e;
    }

    .role-heading {
      color: #83c38f;
      margin: 0 0 8px;
      font-size: 18px;
    }

    .footer {
      background-color: #f4f4f4;
      text-align: center;
      padding: 20px;
      font-size: 14px;
      color: #888;
    }

    .footer a {
      color: #83c38f;
      text-decoration: none;
    }

    @media (max-width: 600px) {
      .header h1 {
        font-size: 22px;
      }

      .content {
        padding: 20px 15px;
      }

      .content h2 {
        font-size: 18px;
      }

      .role-heading {
        font-size: 16px;
      }
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1> ${companyName}.toUpperCase()</h1>
    </div>

    <div class="content">
      <h2>Hello ${userName},</h2>
      <p>We’re so glad you’ve enrolled for the  <strong>${title}</strong> ${companyName} created this job simulation to allow you to immerse yourself in the type of work employees at ${companyName} do each day.</p>
    <p>
        By completing this job simulation, you will build your experience, grow your confidence & show you're motivated - helping you to become a standout candidate</p>

    

      <p>Here’s what you should do:</p>
      <ul>
        <li>📃View the list of tasks</li>
        <li>💼 Submit your solutions in .docx or .pdf format.</li>
        <li>📊 Wait for a review after submitting all the tasks.</li>
        <li>📜 Download your certificate on your dashboard after your review has been approved.</li>
      </ul>

      <p>Need help? Reach us anytime at <a href="mailto:josephrice1377@gmail.com">support@careerlaunch.com</a>.</p>

      <p style="margin-top: 35px;">Let’s build your future — starting now.</p>
      <p style="font-style: italic;">– The ${companyName} Team</p>
    </div>

    <div class="footer">
      &copy; 2025 Career Launch<br />
      <a href="https://careerlaunch.com">Visit our website</a>
    </div>
  </div>
</body>
</html>
`
}