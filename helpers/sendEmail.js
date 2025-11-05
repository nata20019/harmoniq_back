import sgMail from "@sendgrid/mail";
import "dotenv/config";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (data) => {
  try {
    const email = { ...data, from: process.env.SENDGRID_EMAIL_FROM };
    await sgMail.send(email);
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    throw error;
  }
};

export default sendEmail;
