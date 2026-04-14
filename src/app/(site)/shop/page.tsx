import type { Metadata } from "next";
import { ShopContent } from "../../../components/ShopContent";

export const metadata: Metadata = {
  title: "Shop — Brandy Store",
  description: "Browse our full menswear collection — tops, knitwear, jackets, trousers, shoes and essentials from the world's finest houses.",
};

export default function ShopPage() {
  return <ShopContent />;
}
