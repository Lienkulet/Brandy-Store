import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { buildTelegramOrderMessage, sendTelegramMessage } from "@/lib/telegram";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("brandy-session");
  if (cookie?.value !== "brandy-authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const page   = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const search = searchParams.get("search")?.trim() ?? "";
  const status = searchParams.get("status") ?? "all";

  let query = supabaseAdmin
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    const num = parseInt(search);
    const orFilter = !isNaN(num)
      ? `customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%,order_number.eq.${num}`
      : `customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%`;
    query = query.or(orFilter);
  }

  const { data, count, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, total: count ?? 0, pageSize: PAGE_SIZE });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customer_name, customer_phone, customer_address, delivery, items, subtotal } = body;

  if (!customer_name || !customer_phone || !delivery || !items?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert([{ customer_name, customer_phone, customer_address, delivery, items, subtotal, status: "pending" }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  try {
    const envBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
    const baseUrl = envBaseUrl
      ? (envBaseUrl.startsWith("http") ? envBaseUrl : `https://${envBaseUrl}`)
      : req.nextUrl.origin;

    await sendTelegramMessage(buildTelegramOrderMessage(data, baseUrl));
  } catch (notificationError) {
    console.error(notificationError);
  }

  return NextResponse.json(data, { status: 201 });
}
