"use server"
import { createTransport } from "nodemailer"

export default async function sendEmail(recipent, subject, body) {
  const transporter = createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  })
  const mailOptions = {
    from: '"LearnQuickAI" <support@learnquickai.com',
    to: recipent,
    subject,
    text: body
  }
  try {
    await transporter.sendMail(mailOptions)
  } catch (e) {
    console.log(e)
  }
}