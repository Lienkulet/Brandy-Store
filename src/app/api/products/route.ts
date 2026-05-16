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

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const pageParam = searchParams.get("page");

  // No page param → shop path, return all products
  if (!pageParam) {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json((data ?? []).map(fromRow));
  }

  // Admin paginated path
  const page   = Math.max(1, parseInt(pageParam));
  const search = searchParams.get("search")?.trim() ?? "";
  const filter = searchParams.get("filter") ?? "all";

  let query = supabaseAdmin
    .from("products")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (search) {
    query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%`);
  }

  if (filter === "new")          query = query.eq("is_new", true);
  if (filter === "in-stock")     query = query.filter("sizes", "cs", '[{"inStock":true}]');
  if (filter === "out-of-stock") query = query.not("sizes", "cs", '[{"inStock":true}]');
  if (filter === "on-sale")      query = query.not("price", "is", null).filter("price->>original", "neq", "price->>current");

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: (data ?? []).map(fromRow), total: count ?? 0, pageSize: PAGE_SIZE });
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const product: Product = await req.json();

  let slug = product.slug;
  let attempt = 0;
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
