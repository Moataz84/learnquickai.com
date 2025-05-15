import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import Users from "@/utils/Models/Users"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req) {
  const body = await req.text()
  const h = await headers()
  const signature = h.get("stripe-signature")

  let data
  let eventType
  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err.message}`)
    return NextResponse.json({error: err.message}, {status: 400})
  }
  data = event.data
  eventType = event.type

  try {
    if (eventType === "checkout.session.completed") {
      await Users.findOneAndUpdate({email: data.object.customer_details.email}, {$set: {active: true}})
    } else if (eventType === "customer.subscription.deleted") {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
      const customer = await stripe.customers.retrieve(data.object.customer)
      const email = customer.email
      await Users.findOneAndUpdate({email}, {$set: {active: false}})
    } else {}
  } catch (e) {
    console.log(e)
  }

  return NextResponse.json({})
}