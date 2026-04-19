import type { Metadata } from "next";
import { CheckoutContent } from "../../../components/CheckoutContent";

export const metadata: Metadata = {
  title: "Checkout — Brandy Store",
  description: "Complete your order at Brandy Store, Chișinău.",
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}
