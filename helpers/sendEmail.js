const nodemailer = require("nodemailer");
require("dotenv").config();


const sendEmail = async ({ email, verificationToken }) => {
  const config = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
      user: process.env.VERIFI_EMAIL_SENDER,
      pass: process.env.VERIFI_EMAIL_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(config);

  const baseURL = process.env.BASE_URL;

  const emailOptions = {
    to: email,
    from: process.env.VERIFI_EMAIL_SENDER,
    subject: "Confirm registration",
    html: `<a href="${baseURL}/users/verify/${verificationToken}" target="_blank">Please, confirm your registration by press this reference</a>`,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;