import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { products as staticProducts } from "@/data/products";
import type { Product } from "@/data/products";

const DB = path.resolve(process.cwd(), "src/data/products-db.json");

async function readDB(): Promise<Product[]> {
  try {
    const raw = await readFile(DB, "utf-8");
    return JSON.parse(raw);
  } catch {
    await writeFile(DB, JSON.stringify(staticProducts, null, 2));
    return structuredClone(staticProducts) as Product[];
  }
}

async function writeDB(data: Product[]) {
  await writeFile(DB, JSON.stringify(data, null, 2));
}

function authed(req: NextRequest) {
  return req.cookies.get("brandy-session")?.value === "brandy-authenticated";
}

export async function GET() {
  const data = await readDB();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const product: Product = await req.json();
  const data = await readDB();
  if (data.find((p) => p.id === product.id)) {
    return NextResponse.json({ error: "ID already exists" }, { status: 400 });
  }
  data.push(product);
  await writeDB(data);
  return NextResponse.json(product, { status: 201 });
}
