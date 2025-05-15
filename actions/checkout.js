"use server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function createCheckout(email, priceId) {
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: email,
    line_items: [{price: priceId, quantity: 1}],
    success_url: "http://localhost:3000/dashboard",
    cancel_url: "http://localhost:3000/pricing"
  })
  return checkoutSession.url
}
