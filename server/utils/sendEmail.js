const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Check if email credentials are provided
  if (
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS ||
    process.env.EMAIL_USER.includes("your_email")
  ) {
    console.log("====================================================");
    console.log("EMAIL SERVICE NOT CONFIGURED - LOGGING EMAIL CONTENT");
    console.log("To:", options.email);
    console.log("Subject:", options.subject);
    console.log("Message:", options.message);
    if (options.verificationUrl) {
      console.log("Verification URL:", options.verificationUrl);
    }
    console.log("====================================================");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
                .header { background: linear-gradient(135deg, #4361ee, #4cc9f0); color: white; padding: 20px; text-align: center; }
                .content { padding: 30px; background-color: #f9f9f9; }
                .button { display: inline-block; padding: 12px 30px; background: linear-gradient(to right, #4361ee, #4cc9f0); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
                .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>${options.subject}</h1>
                </div>
                <div class="content">
                    <p>${options.message.replace(/\n/g, "<br>")}</p>
                    ${
                      options.verificationUrl
                        ? `<a href="${options.verificationUrl}" class="button">Verify Email</a>`
                        : ""
                    }
                    ${
                      options.verificationUrl
                        ? `<p>Or copy and paste this link: ${options.verificationUrl}</p>`
                        : ""
                    }
                </div>
                <div class="footer">
                    <p>Personalized Academic Tracker</p>
                </div>
            </div>
        </body>
        </html>
    `;

  const mailOptions = {
    from: `Academic Tracker <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
