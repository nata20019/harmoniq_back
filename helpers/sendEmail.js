  // import sgMail from "@sendgrid/mail";
  // import "dotenv/config";

  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // const sendEmail = async (data) => {
  //   const email = { ...data, from: process.env.SENDGRID_EMAIL_FROM };
  //   try {
  //     await sgMail.send(email);
  //     console.log("Email sent successfully");
  //     return true;
  //   } catch (error) {
  //     // Це допоможе побачити деталі помилки від SendGrid
  //     console.error("Email Error:", error.response?.body || error.message);

  //     // Створюємо зрозумілу помилку для нашого контролера
  //     const newError = new Error(error.message);
  //     newError.status = error.code || 401;
  //     throw newError;
  //   }
  // };

  // export default sendEmail;

import nodemailer from "nodemailer";
import "dotenv/config";

const { MAILTRAP_HOST, MAILTRAP_PORT, MAILTRAP_USER, MAILTRAP_PASS } = process.env;

const nodemailerConfig = {
  host: MAILTRAP_HOST,
  port: MAILTRAP_PORT,
  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASS,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: "test@example.com" }; // Будь-яка пошта для тесту
  await transport.sendMail(email);
  return true;
};

export default sendEmail;