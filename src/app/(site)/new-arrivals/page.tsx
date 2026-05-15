import type { Metadata } from "next";
import { ShopContent } from "@/components/shop/ShopContent";

export const metadata: Metadata = {
  title: "New Arrivals — Brandy Store",
  description: "The latest additions to our menswear collection from the world's finest houses.",
};

export default function NewArrivalsPage() {
  return <ShopContent onlyNew />;
}
