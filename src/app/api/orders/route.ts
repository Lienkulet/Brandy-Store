import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { buildTelegramOrderMessage, sendTelegramMessage } from "@/lib/telegram";
import type { OrderItem } from "@/lib/order-utils";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("brandy-session");
  if (cookie?.value !== "brandy-authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
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
    const productIds = Array.from(new Set((items as OrderItem[])
      .map((item) => item.productId)
      .filter(Boolean)));

    const { data: products } = productIds.length
      ? await supabaseAdmin.from("products").select("id, slug").in("id", productIds)
      : { data: [] };

    const envBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
    const baseUrl = envBaseUrl
      ? (envBaseUrl.startsWith("http") ? envBaseUrl : `https://${envBaseUrl}`)
      : req.nextUrl.origin;

    await sendTelegramMessage(buildTelegramOrderMessage(data, products ?? [], baseUrl));
  } catch (notificationError) {
    console.error(notificationError);
  }

  return NextResponse.json(data, { status: 201 });
}
