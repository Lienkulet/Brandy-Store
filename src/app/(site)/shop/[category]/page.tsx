import type { Metadata } from "next";
import { ShopContent } from "../../../../components/ShopContent";
import { categories } from "../../../../data/products";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const match = categories.find((c) => c.slug === category);
  const label = match?.label ?? "Shop";
  return {
    title: `${label} — Brandy Store`,
    description: `Shop ${label.toLowerCase()} from Loro Piana, Brunello Cucinelli, Polo Ralph Lauren and more.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  return <ShopContent initialCategory={category} />;
}
