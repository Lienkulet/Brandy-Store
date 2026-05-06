import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "brandy-session";
const SESSION_TOKEN  = "brandy-authenticated";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return NextResponse.json({ authenticated: token === SESSION_TOKEN });
}
