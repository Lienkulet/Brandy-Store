import BrandStrip from "@/components/home/BrandStrip";
import Categories from "@/components/home/Categories";
import Collection from "@/components/home/Collection";
import Hero from "@/components/home/Hero";
import Container from "@/components/layout/Container";
import Season from "@/components/home/Season";
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
