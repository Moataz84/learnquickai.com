import { NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import Users from "@/utils/Models/Users"
import { sendHTMLEmail } from "@/actions/sendEmail"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const config = {
  api: {
    bodyParser: false
  },
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req) {
  const rawBody = await req.arrayBuffer()
  const body = Buffer.from(rawBody)
  const h = await headers()
  const sig = h.get("stripe-signature")

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error("❌ Stripe webhook signature verification failed:", err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  const data = event.data.object
  const eventType = event.type

  try {
    if (eventType === "checkout.session.completed") {
      await Users.findOneAndUpdate({ email: data.customer_email }, { $set: { active: true } })
    } else if (eventType === "customer.subscription.deleted") {
      const customer = await stripe.customers.retrieve(data.customer);
      const email = customer.email
      const name = customer.name
      await Users.findOneAndUpdate({ email }, { $set: { active: false } })
      const message = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; color: #333; padding: 20px; }
    .container { max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 8px; }
    h1 { color: #4CAF50; }
    .footer { font-size: 12px; color: #888; margin-top: 20px; }
  </style>
</head>
<body>
<div class="container">
  <div class="container">
    <h1>😔 Sorry to See You Go</h1>
    <p>Hi ${name},</p>
    <p>We're sorry to hear that you've canceled your subscription to <strong>LearnQuick AI Pro</strong>.</p>

    <p>We truly appreciate you being a part of our journey and hope you found value in the tools and resources we offered.</p>

    <p>If there's anything we could've done better or if you have feedback, feel free to reply to this email. We'd love to hear from you.</p>

    <p>We hope to see you again in the future!</p>

    <p>- The LearnQuick AI Team</p>

    <div class="footer">
      This is an automated message from LearnQuick AI.
    </div>
  </div>
</body>
</html>
`
      await sendHTMLEmail(email, "Sorry to See You Go", message)
    } else if (eventType === 'invoice.payment_succeeded') {
      const name = data.customer_name
      const email = data.customer_email
      const invoiceUrl = data.hosted_invoice_url
      const message = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; color: #333; padding: 20px; }
    .container { max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 8px; }
    h1 { color: #4CAF50; }
    .footer { font-size: 12px; color: #888; margin-top: 20px; }
  </style>
</head>
<body>
<div class="container">
  <h1>🎉 Thank You for Your Purchase!</h1>
  <p>Hi ${name},</p>
  <p>We're excited to let you know that your checkout is complete. Welcome aboard!</p>

  <p><strong>Order Summary:</strong></p>
  <ul>
    <li>Plan: <strong>LearnQuick AI Pro</strong></li>
  </ul>

  <p>You can access your account and benefits at any time by logging in.</p>

  <p>You can view or download your invoice here:  
    <a href="${invoiceUrl}" target="_blank" style="color: #4f46e5; text-decoration: underline;">
      View Invoice
    </a>
  </p>

  <p>If you have any questions, reply to this email. We're here to help!</p>

  <p>- The LearnQuick AI Team</p>

  <div class="footer" style="margin-top: 30px; font-size: 12px; color: #666;">
    This is an automated message from LearnQuick AI.
  </div>
</div>
</body>
</html>
`
      await sendHTMLEmail(email, "Thank You for Your Purchase", message)
    }
  } catch (err) {
    console.error("Error handling webhook:", err)
  }

  return NextResponse.json({ received: true })
}
