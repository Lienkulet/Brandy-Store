import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "../../../../data/products";
import { ProductDetail } from "../../../../components/ProductDetail";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: "Product Not Found — Brandy Store" };
  return {
    title: `${product.name} — ${product.brand} | Brandy Store`,
    description: `${product.description}. Shop ${product.brand} menswear at Brandy Store, Chișinău.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
