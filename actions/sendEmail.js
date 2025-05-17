"use server"
import FormData from "form-data"
import Mailgun from "mailgun.js"

export default async function sendEmail(recipent, subject, body) {
  const mailgun = new Mailgun(FormData)
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_KEY,
  })
  try {
    const data = await mg.messages.create("learnquickai.com", {
      from: "QuickLearn AI <support@learnquickai.com>",
      to: [recipent],
      subject: subject,
      text: body
    })
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}

export async function sendHTMLEmail(recipent, subject, html) {
  const mailgun = new Mailgun(FormData)
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_KEY,
  })
  try {
    const data = await mg.messages.create("learnquickai.com", {
      from: "QuickLearn AI <support@learnquickai.com>",
      to: [recipent],
      subject: subject,
      html
    })
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}