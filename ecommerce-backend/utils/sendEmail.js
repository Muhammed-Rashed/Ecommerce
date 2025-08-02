const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Ecommerce App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html,
  });
};

module.exports = sendEmail;
