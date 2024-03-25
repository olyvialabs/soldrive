import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "~/env";
import { db } from "~/server/db";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type Payload = {
  product: string;
  email: string;
};

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data: Payload = await req.json();
    const user = await db.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      await db.user.create({
        data: {
          email: data.email,
        },
      });
    }

    console.log({ user: user, data });
    console.log({ user: user, data });
    console.log({ user: user });

    const session = await stripe.checkout.sessions.create({
      customer_email: data.email,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: data.product,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cart`,
    });

    console.log({ session });
    console.log({ session });
    console.log({ session });

    return NextResponse.json({ status: 200, data: session });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
