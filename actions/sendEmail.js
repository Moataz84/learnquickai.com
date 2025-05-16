"use server"
import { createTransport } from "nodemailer"

const transporter = createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
})

export default async function sendEmail(recipent, subject, body) {
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

export async function sendHTMLEmail(recipent, subject, html) {
  const mailOptions = {
    from: '"LearnQuickAI" <support@learnquickai.com',
    to: recipent,
    subject,
    html
  }
  try {
    await transporter.sendMail(mailOptions)
  } catch (e) {
    console.log(e)
  }
}