const nodeMailer = require("nodemailer"); // Assuming nodemailer is imported

exports.sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.HOST, // Your SMTP host (e.g., smtp.mailtrap.io, smtp.gmail.com)
    port: 465, // Or 587 (TLS), depends on the email provider
    secure: false, // Use true for port 465, false for port 587
    auth: {
      user: process.env.USER,
      pass: process.env.PASS_EMAIL,
    },
    tls: {
      rejectUnauthorized: false, // Optional: only needed for self-signed certificates
    },
  });

  const optionsEmail = {
    from: '"Tasniem Ahmed" <Tasniem@test.io>', // Adjust your "from" address as needed
    to: options.email,
    sub: options.sub, // Corrected from "sub"
    text: options.text,
  };

  try {
    await transporter.sendMail(optionsEmail);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
