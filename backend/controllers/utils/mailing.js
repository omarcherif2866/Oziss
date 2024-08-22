// mailing.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'smtp.gmail.com',
  port: 587,
  secure: true, 
  auth: {
    user: "comar2866@gmail.com", 
    pass: "hwrw erot pjlz uhzu"  
  }
});

const sendEmail = ( subject, text, from) => {
  console.log('Sending email with:', { from,  subject, text });

  const mailOptions = {
    from: from, 
    to: 'comar2866@gmail.com',
    subject: subject,
    text: text,
  };

  return transporter.sendMail(mailOptions);
};

export { sendEmail };
