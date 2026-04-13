import type { Metadata } from "next";
import Collection from "../components/Collection";
import Hero from "../components/Hero";
import Season from "../components/Season";
import Categories from "../components/Categories";
import Container from "../components/layout/Container";

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
        <Season />
        <Categories />
      </Container>
    </main>
  );
}
