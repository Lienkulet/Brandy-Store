import BrandStrip from "@/components/BrandStrip";
import Categories from "@/components/Categories";
import Collection from "@/components/Collection";
import Hero from "@/components/Hero";
import Container from "@/components/layout/Container";
import Season from "@/components/Season";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Brandy Store",
  description: "Minimal menswear storefront landing page.",
};

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <Hero />
      <Container>
        <Collection />
      </Container>
      <BrandStrip />
      <Container>
        <Categories />
        <Season />
      </Container>
    </main>
  );
}
