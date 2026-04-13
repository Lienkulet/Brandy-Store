"use client";

import { motion } from "framer-motion";
import ProductCard from "./cards/ProductCard";

const collectionItems = [
  {
    name: "Leather Penny Loafers",
    description: "Built for every setting",
    image: "/assets/product-loafers.png",
    price: null,
  },
  {
    name: "V-Neck Sleeveless Sweater Polo",
    description: "Built for every setting",
    image: "/assets/product-vest.png",
    price: null,
  },
  {
    name: "Crochet Polo Shirt",
    description: "Built for every setting",
    image: "/assets/product-shirt.png",
    price: null,
  },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

function Collection() {
  return (
    <section
      id="collection"
      className="mx-auto mt-14 flex w-full max-w-280 flex-col"
    >
      {/* Heading block */}
      <motion.div
        className="mb-8 text-center sm:mb-10"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease }}
      >
        <p className="font-serif text-2xl font-semibold uppercase tracking-[0.24em] text-foreground sm:text-3xl">
          New Collection
        </p>

        {/* Animated divider */}
        <motion.div
          className="mx-auto mt-4 h-px bg-foreground/20"
          initial={{ width: 0 }}
          whileInView={{ width: "2.5rem" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35, ease }}
        />

        <p className="mx-auto mt-4 max-w-170 text-sm text-muted sm:text-base">
          Our latest collection, where classic and contemporary styles converge
          in perfect harmony.
        </p>
      </motion.div>

      {/* Cards grid — each card staggers in */}
      <div className="grid gap-5 md:grid-cols-3">
        {collectionItems.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease, delay: i * 0.14 }}
          >
            <ProductCard {...item} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Collection;
