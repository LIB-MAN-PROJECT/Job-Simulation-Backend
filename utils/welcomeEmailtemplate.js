module.exports =(username) =>
`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to lumini app</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
      }

      .container {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
      }

      .header {
        background: linear-gradient(90deg,rgb(13, 7, 17),rgb(52, 26, 61),rgb(100, 39, 105),rgb(124, 37, 146),rgb(204, 82, 198));
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
        color: #8613D6;
        margin-top: 0;
      }

      .content ul {
        padding-left: 20px;
      }

      .footer {
        background-color: #f4f4f4;
        text-align: center;
        padding: 20px;
        font-size: 14px;
        color: #888;
      }

      .footer a {
        color: #8613D6;
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
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to lumini app</h1>
      </div>

      <div class="content">
        <h2>Hello ${username},</h2>
        <p>We're thrilled to welcome you to <strong>Lumini App</strong> — your new home for job simulation offers</p>

        <p>As a member, you can:</p>
        <ul>
          <li>Work on job simulation tasks</li>
          <li>Apply for internships</li>
        </ul>

        <p style="margin-top: 25px;">Need help? Just reply to this email or contact us at
          <a href="mailto:josephrice1377@gmail.com">support@codefeast.com</a>.
        </p>

        <p style="margin-top: 35px;">Happy posting and bon appétit!</p>
        <p style="font-style: italic;">– The Code Feast Team</p>
      </div>

      <div class="footer">
        &copy; 2025 lumini app<br />
        <a href="https://code-feast.netlify.app/">Visit our website</a>
      </div>
    </div>
  </body>
</html>
`