"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import GreyBtn from "../ui/GreyBtn";

type CategoryCardProps = {
  title: string;
  cta: string;
  image: string;
  href?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

const MotionLink = motion(Link);

function CategoryCard({ title, cta, image, href }: CategoryCardProps) {
  return (
    <MotionLink
      href={href || "/#"}
      className="relative block overflow-hidden rounded-3xl cursor-pointer"
      whileHover="hover"
      initial="rest"
      animate="rest"
      transition={{ duration: 0.38, ease }}
    >
      {/* Image — zooms in on hover */}
      <div className="overflow-hidden">
        <motion.div
          variants={{ rest: { scale: 1 }, hover: { scale: 1.08 } }}
          transition={{ duration: 0.55, ease }}
          className="will-change-transform"
        >
          <Image
            src={image}
            alt={title}
            width={236}
            height={210}
            className="h-57.5 w-full object-cover sm:h-62.5 lg:h-72.5"
          />
        </motion.div>
      </div>

      {/* Base gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/5 to-transparent" />

      {/* Hover gradient — darkens on hover */}
      <motion.div
        className="absolute inset-0 bg-linear-to-t from-black/65 via-black/15 to-transparent"
        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.4 }}
      />

      {/* Title + CTA — drifts up on hover */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-3 p-4 sm:p-5"
        transition={{ duration: 0.38, ease }}
      >
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white">
          {title}
        </span>
        <GreyBtn name={cta} />
      </motion.div>
    </MotionLink>
  );
}

export default CategoryCard;
