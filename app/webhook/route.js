// app/api/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import Users from "@/utils/Models/Users"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // ⛔ important
  },
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const rawBody = await req.arrayBuffer();
  const body = Buffer.from(rawBody);
  const sig = headers().get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("❌ Stripe webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const data = event.data.object;
  const eventType = event.type;

  try {
    if (eventType === "checkout.session.completed") {
      await Users.findOneAndUpdate(
        { email: data.customer_details.email },
        { $set: { active: true } }
      );
    } else if (eventType === "customer.subscription.deleted") {
      const customer = await stripe.customers.retrieve(data.customer);
      const email = (customer).email;
      await Users.findOneAndUpdate({ email }, { $set: { active: false } });
    }
  } catch (err) {
    console.error("Error handling webhook:", err);
  }

  return NextResponse.json({ received: true });
}
