import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { db } from "~/server/db";

type Payload = {
  token: string;
};

export async function POST(req: NextRequest) {
  try {
    const data: Payload = await req.json();
    if (!data.token) {
      return NextResponse.json({ error: "Invalid input", status: 400 });
    }

    const decodedData = jwtDecode(data.token);

    console.log(decodedData);
    console.log(decodedData);
    console.log(decodedData);
    const foundUser = await db.user.findFirst({
      where: {
        email: decodedData.email,
      },
    });

    return NextResponse.json({ status: 200, data: foundUser });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
