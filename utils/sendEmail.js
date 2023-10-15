import nodemailer from 'nodemailer'
import nodeMailerConfig from './nodeMailerConfig.js';
import ejs from "ejs"

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport(nodeMailerConfig);
  return transporter.sendMail({
    from: '"Emmanuel Academy" generalproject4@gmail.com', // sender address
    to,
    subject,
    html
  });
  } catch (error) {
    console.log("An error occured could not send mail");
  } 
};

