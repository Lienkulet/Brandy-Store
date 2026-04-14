"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type ProductPrice = {
  original: string;
  current: string;
};

type ProductCardProps = {
  name: string;
  brand?: string;
  description: string;
  image: string;
  price: ProductPrice | null;
  href?: string;
  isNew?: boolean;
};

const ease = [0.22, 1, 0.36, 1] as const;

function ProductCard({ name, brand, description, image, price, href, isNew }: ProductCardProps) {
  return (
    <motion.article
      className="soft-card group relative overflow-hidden rounded-3xl p-4 sm:p-5"
      transition={{ duration: 0.35, ease }}
      style={{ boxShadow: "0 18px 40px rgba(95, 77, 57, 0.08)" }}
    >
      {/* Stretched link overlay */}
      {href && (
        <Link href={href} className="absolute inset-0 z-10" aria-label={name} />
      )}

      {/* New badge */}
      {isNew && (
        <div className="absolute left-7 top-7 z-5 rounded-full bg-foreground px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
          New In
        </div>
      )}

      {/* Image — zooms subtly on card hover */}
      <div className="overflow-hidden rounded-[18px] bg-[#f7f4f0]">
        <motion.div
          className="will-change-transform"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.55, ease }}
        >
          <Image
            src={image}
            alt={name}
            width={214}
            height={260}
            className="h-65 w-full object-cover"
          />
        </motion.div>
      </div>

      {/* Details */}
      <div className="px-1 pb-1 pt-4">
        {brand && (
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
            {brand}
          </p>
        )}
        <h2 className="font-serif text-xl font-semibold leading-tight text-foreground">
          {name}
        </h2>
        <p className="mt-1 text-sm text-muted">{description}</p>

        {price ? (
          <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-foreground sm:text-base">
            <span className="text-foreground/45 line-through">{price.original}</span>
            <span>{price.current}</span>
          </p>
        ) : (
          <div className="mt-4 h-6" aria-hidden="true" />
        )}
      </div>
    </motion.article>
  );
}

export default ProductCard;
