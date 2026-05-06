import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { Product } from "@/data/products";

function authed(req: NextRequest) {
  return req.cookies.get("brandy-session")?.value === "brandy-authenticated";
}

function toRow(p: Product) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    description: p.description,
    price: p.price,
    image: p.image,
    colors: p.colors,
    sizes: p.sizes,
    details: p.details,
    is_new: p.isNew ?? false,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(r: any): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    brand: r.brand,
    category: r.category,
    description: r.description,
    price: r.price as Product["price"],
    image: r.image,
    colors: r.colors as Product["colors"],
    sizes: r.sizes as Product["sizes"],
    details: r.details as string[],
    isNew: r.is_new,
  };
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(fromRow));
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const product: Product = await req.json();

  let slug = product.slug;
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const row = { ...toRow(product), slug };
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert([row])
      .select()
      .single();
    if (!error) return NextResponse.json(fromRow(data), { status: 201 });
    if (error.code === "23505" && error.message.includes("slug")) {
      attempt++;
      slug = `${product.slug}-${attempt}`;
      continue;
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
