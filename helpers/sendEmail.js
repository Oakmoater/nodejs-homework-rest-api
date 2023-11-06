// https://github.com/sendgrid/sendgrid-nodejs

const sgMail = require('@sendgrid/mail')
const dotenv = require('dotenv');

dotenv.config();

const { SENDGRID_API_TOKEN, SENDGRID_NET_MAIL } = process.env;


sgMail.setApiKey(SENDGRID_API_TOKEN)

const msg = {
  to: 'oakmoater@gmail.com',
  from: SENDGRID_NET_MAIL,
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}

sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })