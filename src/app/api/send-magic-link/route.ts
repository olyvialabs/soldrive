import { NextRequest, NextResponse } from "next/server";
import { Client } from "postmark";
import { env } from "~/env";
import sign from "jwt-encode";
import { db } from "~/server/db";

type Payload = {
  email: string;
};
const postmarkClient = new Client(env.POSTMARK_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const data: Payload = await req.json();
    if (!data.email) {
      return NextResponse.json({ error: "Invalid input", status: 400 });
    }
    const foundEmail = await db.user.findFirst({
      where: {
        email: data.email,
      },
    });

    console.log({ foundEmail });
    console.log({ foundEmail });
    console.log({ foundEmail });

    // lazy shit! xD
    const userFoundButNothingBought =
      !foundEmail?.stripeAllAccessProduct &&
      !foundEmail?.stripeAllAccessProductData &&
      !foundEmail?.stripeBasicProduct &&
      !foundEmail?.stripeBasicProductData &&
      !foundEmail?.stripeChatgptTemplateProduct &&
      !foundEmail?.stripeChatgptTemplateProductData &&
      !foundEmail?.stripeStoreTemplateProduct &&
      !foundEmail?.stripeStoreTemplateProductData;

    if (!foundEmail || userFoundButNothingBought) {
      return NextResponse.json({ message: "Email not found", status: 404 });
    }

    const signingData = {
      email: data.email,
      iat: Date.now(),
    };
    const token = sign(signingData, env.JWT_KEY);
    const result = await postmarkClient.sendEmailWithTemplate({
      TemplateId: 35106929, // Magic Link Template ID
      To: data.email,
      From: "b@bixdy.com",
      TemplateModel: {
        token,
      },
      Headers: [
        {
          // Set this to prevent Gmail from threading emails.
          // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
          Name: "X-Entity-Ref-ID",
          Value: new Date().getTime() + "",
        },
      ],
    });

    if (result.ErrorCode) {
      throw "Error sending email";
    }

    console.log(result);
    console.log(result);
    console.log(result);
    return NextResponse.json({ message: "Email sent", status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
