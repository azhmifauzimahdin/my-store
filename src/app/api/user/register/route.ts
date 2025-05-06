import { signUp } from "@/services/auth/authService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const success = await signUp(body);

  if (success) {
    return NextResponse.json(
      { status: true, statusCode: 200, message: "success" },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { status: false, statusCode: 400, message: "failed" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      status: false,
      statusCode: 405,
      message: "Method not allowed",
    },
    { status: 405 }
  );
}
