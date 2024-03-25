import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "~/env";
import { db } from "~/server/db";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type Payload = {
  stripeSessionId: string;
};

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data: Payload = await req.json();
    const session = await stripe.checkout.sessions.retrieve(
      data.stripeSessionId,
      {
        expand: ["line_items"],
      },
    );
    const productId = session.line_items?.data[0]?.price?.id;
    console.log({ productId });
    console.log(session.line_items);
    console.log(session.line_items);
    console.log(session.line_items);
    let dataToUpdate: Partial<User>;
    if (productId === env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_ALL_ACCESS) {
      dataToUpdate = {
        stripeAllAccessProduct: session.id,
        stripeAllAccessProductData: JSON.stringify(session),
      };
    } else if (productId === env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_BASIC) {
      dataToUpdate = {
        stripeBasicProduct: session.id,
        stripeBasicProductData: JSON.stringify(session),
      };
    } else if (
      productId === env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_CHATGPT_TEMPLATE
    ) {
      dataToUpdate = {
        stripeChatgptTemplateProduct: session.id,
        stripeChatgptTemplateProductData: JSON.stringify(session),
      };
    } else if (productId === env.NEXT_PUBLIC_STRIPE_PRODUCT_ID_STORE_TEMPLATE) {
      dataToUpdate = {
        stripeStoreTemplateProduct: session.id,
        stripeStoreTemplateProductData: JSON.stringify(session),
      };
    } else {
      throw "PRODUCT NOT IDENTIFIED";
    }

    console.log({ session });
    console.log({ session });
    console.log({ session });
    console.log({ session });

    // if no email, it'll throw! that's why fallbacked to wtf
    const theUserBeforeUpdate = await db.user.findFirstOrThrow({
      where: { email: session.customer_email! || "wtf@letsthrow.com XD" },
    });

    await db.user.update({
      data: { ...dataToUpdate },
      where: { id: theUserBeforeUpdate.id },
    });

    const theUser = await db.user.findFirstOrThrow({
      where: { email: session.customer_email! },
    });

    return NextResponse.json({ status: 200, data: theUser });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
