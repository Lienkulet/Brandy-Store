import type { Metadata } from "next";
import { SizeGuideContent } from "../../../components/SizeGuideContent";

export const metadata: Metadata = {
  title: "Size Guide — Brandy Store",
  description: "Find your perfect fit with our complete menswear size guide.",
};

export default function SizeGuidePage() {
  return <SizeGuideContent />;
}
