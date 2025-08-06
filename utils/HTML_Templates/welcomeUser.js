module.exports = (userName, role) => {
  let roleMessage = "";

  if (role === "student") {
    roleMessage = `
      <div class="role-section">
        <h3 class="role-heading">👩‍🎓 Your journey starts here!</h3>
        <p>You're now part of a platform designed to help you gain hands-on experience through real-world job simulations and internships.</p>
        <p>Explore different industries, earn certificates, and build the skills employers look for — all from one place.</p>
      </div>
    `;
  } else if (role === "recruiter") {
    roleMessage = `
      <div class="role-section">
        <h3 class="role-heading">🏢 Start hiring smarter</h3>
        <p>As a recruiter on Career Launch, you can create skill-based job simulations and internships to discover standout candidates early.</p>
        <p>Track engagement, review submissions, and connect directly with future talent.</p>
      </div>
    `;
  } else if (role === "admin") {
    roleMessage = `
      <div class="role-section">
        <h3 class="role-heading">🛠️ Powering the platform</h3>
        <p>You're joining Career Launch as an administrator — overseeing activities, guiding users, and helping shape the ecosystem that bridges education and employment.</p>
      </div>
    `;
  }
  else {
    roleMessage = `
      <div class="role-section">
        <h3 class="role-heading">👩‍🎓 Your journey starts here!</h3>
        <p>You're now part of a platform designed to help you gain hands-on experience through real-world job simulations and internships.</p>
        <p>Explore different industries, earn certificates, and build the skills employers look for — all from one place.</p>
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Career Launch</title>
<style>
    body {
      margin: 0;
      padding: 0;
      font-family: "Segoe UI", Arial, sans-serif;
      background-color: #a1a1a1ff;
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
      <h1>Welcome to Career Launch</h1>
    </div>

    <div class="content">
      <h2>Hello ${userName},</h2>
      <p>We’re so glad you’ve joined <strong>Career Launch</strong> — the platform that helps bridge the gap between learning and career readiness.</p>

      ${roleMessage}

      <p>Here’s what you can expect:</p>
      <ul>
        <li>🚀 Immersive job simulations built by top employers</li>
        <li>💼 Internship listings tailored to your skillset</li>
        <li>📜 Certificates to highlight your growth</li>
        <li>📊 Dashboards to track progress and opportunities</li>
      </ul>

      <p>Need help? Reach us anytime at <a href="mailto:support@careerlaunch.com">support@careerlaunch.com</a>.</p>

      <p style="margin-top: 35px;">Let’s build your future — starting now.</p>
      <p style="font-style: italic;">– The Career Launch Team</p>
    </div>

    <div class="footer">
      &copy; 2025 Career Launch<br />
      <a href="https://careerlaunch.com">Visit our website</a>
    </div>
  </div>
</body>
</html>
`;
};
