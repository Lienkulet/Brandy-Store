import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Product } from "@/data/products";

const DB = path.resolve(process.cwd(), "src/data/products-db.json");

async function readDB(): Promise<Product[]> {
  const raw = await readFile(DB, "utf-8");
  return JSON.parse(raw);
}

async function writeDB(data: Product[]) {
  await writeFile(DB, JSON.stringify(data, null, 2));
}

function authed(req: NextRequest) {
  return req.cookies.get("brandy-session")?.value === "brandy-authenticated";
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const updated: Product = await req.json();
  const data = await readDB();
  const idx = data.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  data[idx] = updated;
  await writeDB(data);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!authed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const data = await readDB();
  const filtered = data.filter((p) => p.id !== id);
  if (filtered.length === data.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await writeDB(filtered);
  return NextResponse.json({ ok: true });
}
