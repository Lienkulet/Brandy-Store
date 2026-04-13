"use client";

import { motion } from "framer-motion";
import CategoryCard from "./cards/CategoryCard";

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
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

function Categories() {
  return (
    <section className="mt-10">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {categoryItems.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease, delay: i * 0.14 }}
          >
            <CategoryCard {...item} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Categories;
