import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "../../../../lib/supabase";
import { categories, type Product } from "../../../../data/products";
import { ProductDetail } from "../../../../components/shop/ProductDetail";

type Props = {
  params: Promise<{ slug: string }>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(r: any): Product {
  return {
    id: r.id, slug: r.slug, name: r.name, brand: r.brand,
    category: r.category, description: r.description,
    price: r.price, image: r.image, colors: r.colors,
    sizes: r.sizes, details: r.details, isNew: r.is_new,
  };
}

export async function generateStaticParams() {
  const { data } = await supabaseAdmin.from("products").select("slug");
  return (data ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabaseAdmin.from("products").select("*").eq("slug", slug).single();
  if (!data) return { title: "Product Not Found — Brandy Store" };
  const product = fromRow(data);
  const categoryLabel = categories.find((c) => c.slug === product.category)?.label ?? product.category;
  return {
    title: `${product.name} — ${product.brand} | Brandy Store`,
    description: `${product.description}. Shop ${product.brand} ${categoryLabel.toLowerCase()} at Brandy Store, Chișinău.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const { data } = await supabaseAdmin.from("products").select("*").eq("slug", slug).single();
  if (!data) notFound();
  return <ProductDetail product={fromRow(data)} />;
}
