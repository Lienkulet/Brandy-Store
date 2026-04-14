import type { Metadata } from "next";
import { AboutContent } from "../../../components/AboutContent";

export const metadata: Metadata = {
  title: "The Story — Brandy Store",
  description: "Brandy Store opened in Chișinău in 2023 with a single idea — world-class menswear, closer to home.",
};

export default function AboutPage() {
  return <AboutContent />;
}
