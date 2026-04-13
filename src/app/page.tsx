import type { Metadata } from "next";
import Collection from "../../components/Collection";
import Hero from "../../components/Hero";
import Season from "../../components/Season";
import CategoryCard from "../../components/cards/CategoryCard";
import Container from "../../components/layout/Container";

const categoryItems = [
  {
    title: "Men",
    cta: "Shop Men",
    image: "/assets/category-men-copy.png",
  },
  {
    title: "Women",
    cta: "Shop Women",
    image: "/assets/category-women-copy.png",
  },
  {
    title: "Kids",
    cta: "Shop Kids",
    image: "/assets/category-kids-copy.png",
  },
];

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
        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {categoryItems.map((item) => (
            <CategoryCard key={item.title} {...item} />
          ))}
        </section>
      </Container>

    </main>
  );
}
