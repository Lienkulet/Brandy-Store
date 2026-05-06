import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "brandy-session";
const SESSION_TOKEN  = "brandy-authenticated";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const validEmail    = process.env.ADMIN_EMAIL    ?? "";
  const validPassword = process.env.ADMIN_PASSWORD ?? "";

  if (email !== validEmail || password !== validPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, SESSION_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    path:     "/",
    maxAge:   60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
