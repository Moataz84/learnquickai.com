"use server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function createCheckout(email, priceId) {
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: email,
    line_items: [{price: priceId, quantity: 1}],
    success_url: "https://learnquickai.com/dashboard",
    cancel_url: "https://learnquickai.com/pricing"
  })
  return checkoutSession.url
}
