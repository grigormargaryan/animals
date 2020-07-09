const nodemailer = require("nodemailer");
const fs = require('fs');
const ejs = require('ejs');
require('dotenv').config();

async function sendEmail(toEmail,confirmCode,emailType) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODE_EMAIL,
      pass: process.env.NODE_EMAIL_PASSWORD
    }
  });

  if(emailType === 'confirm') {
    let confirm = await transporter.sendMail({
      from: process.env.NODE_EMAIL,
      to: toEmail,
      subject: 'GOGO Sign Up Mail ✔',
      // text: 'Hello world?', // plain text body
      html: ejs.render( fs.readFileSync('views/email/confirm.ejs', 'utf-8') , {confirmCode: confirmCode})
    });
    return confirm.messageId;
  }

  if(emailType === 'forgot') {
    let forgot = await transporter.sendMail({
      from: process.env.NODE_EMAIL,
      to: toEmail,
      subject: 'GOGO Reset Password Mail ✔',
      // text: 'Hello world?', // plain text body
      html: ejs.render( fs.readFileSync('views/email/forgot.ejs', 'utf-8') , {confirmCode: confirmCode})
    });
    return forgot.messageId;
  }

}

export default sendEmail;