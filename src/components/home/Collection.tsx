"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/cards/ProductCard";
import type { Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import { ease } from "@/lib/animations";

function Collection() {
  const filterNewProducts = useCallback((product: Product) => Boolean(product.isNew), []);
  const { products } = useProducts(filterNewProducts);
  const items = products.slice(0, 3);

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

      {/* Cards grid */}
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease, delay: i * 0.14 }}
          >
            <ProductCard
              name={product.name}
              brand={product.brand}
              description={product.description}
              image={product.image}
              price={product.price}
              href={`/product/${product.slug}`}
              isNew={product.isNew}
              sizeFree={product.category === "accessories"}
              quickAdd={{
                productId: product.id,
                slug:      product.slug,
                colorName: product.colors[0]?.name ?? "",
                sizes: product.sizes,
                price: product.price?.current ?? "Price on request",
              }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Collection;
