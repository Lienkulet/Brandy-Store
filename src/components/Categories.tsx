"use client";

import { motion } from "framer-motion";
import CategoryCard from "./cards/CategoryCard";

const categoryItems = [
  {
    title: "Tops & Shirts",
    image: "/assets/category/tops-shirts.png",
  },
  {
    title: "Pants & Jeans",
    image: "/assets/category/pants-jeans.png",
  },
  {
    title: "Knitwear & Layering",
    image: "/assets/category/knitwear-layering.png",
  },
  {
    title: "Jackets & Outerwear",
    image: "/assets/category/jackets-outwear.png",
  },
  {
    title: "Underwear & Essentials",
    image: "/assets/category/underwear-essentials.png",
  },
  {
    title: "Sportswear & Shoes",
    image: "/assets/category/sportswear-shoes.png",
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

function Categories() {
  return (
    <section className="mt-14">
      {/* Heading block */}
      <motion.div
        className="mb-8 text-center sm:mb-10"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease }}
      >
        <p className="font-serif text-2xl font-semibold uppercase tracking-[0.24em] text-foreground sm:text-3xl">
          Shop by Category
        </p>

        <motion.div
          className="mx-auto mt-4 h-px bg-foreground/20"
          initial={{ width: 0 }}
          whileInView={{ width: "2.5rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35, ease }}
        />

        <p className="mx-auto mt-4 max-w-170 text-sm text-muted sm:text-base">
          From sharp tailoring to everyday essentials — find your style.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {categoryItems.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease, delay: i * 0.14 }}
          >
            <CategoryCard {...item} cta='Shop' />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Categories;
