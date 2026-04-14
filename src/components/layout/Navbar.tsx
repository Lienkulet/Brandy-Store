"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionTemplate, type Variants } from "framer-motion";
import { AccountIcon } from "../icons/Account";
import { CartIcon } from "../icons/CartIcon";
import { SearchIcon } from "../icons/SearchIcon";

const navigationItems = ["New Arrivals", "Shop", "The Story", "Contact"];

const actionItems = [
  { label: "Search", icon: SearchIcon },
  { label: "Cart", icon: CartIcon },
  { label: "Account", icon: AccountIcon },
];

const ease = [0.22, 1, 0.36, 1] as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
};

const fadeDown = {
  hidden: { y: -10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease } },
};

const underline: Variants = {
  hidden:  { scaleX: 0 },
  visible: { scaleX: 0, transition: { duration: 0.25, ease: [0.55, 0, 1, 0.45] } },
  hover:   { scaleX: 1, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
};

export function Navbar() {
  const { scrollY } = useScroll();

  // Smooth scroll-driven glass effect
  const bgOpacity   = useTransform(scrollY, [0, 72], [0, 0.92]);
  const blurPx      = useTransform(scrollY, [0, 72], [0, 14]);
  const borderAlpha = useTransform(scrollY, [0, 72], [0, 0.1]);
  const shadowAlpha = useTransform(scrollY, [0, 72], [0, 0.06]);

  const backgroundColor  = useMotionTemplate`rgba(252,250,247,${bgOpacity})`;
  const backdropFilter   = useMotionTemplate`blur(${blurPx}px)`;
  const borderColor      = useMotionTemplate`rgba(76,64,53,${borderAlpha})`;
  const boxShadow        = useMotionTemplate`0 1px 32px rgba(95,77,57,${shadowAlpha})`;

  // Text/icon color: white at top, dark foreground when scrolled
  const navAlpha  = useTransform(scrollY, [0, 72], [0.75, 0.80]);
  const navR      = useTransform(scrollY, [0, 72], [255, 30]);
  const navG      = useTransform(scrollY, [0, 72], [255, 26]);
  const navB      = useTransform(scrollY, [0, 72], [255, 23]);
  const navColor  = useMotionTemplate`rgba(${navR},${navG},${navB},${navAlpha})`;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ y: -36, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease }}
    >
      {/* Glass background layer */}
      <motion.div
        className="absolute inset-0 border-b"
        style={{ backgroundColor, backdropFilter, borderColor, boxShadow }}
      />

      {/* Content */}
      <div className="relative mx-auto flex w-full max-w-360 items-center justify-between px-4 py-2 sm:px-6 lg:px-8">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.1, ease }}
        >
          <Link href="#" aria-label="Home" className="block">
            <Image
              src="/logo.png"
              alt="Brandy Store"
              width={260}
              height={104}
              priority
              className="h-16 w-auto object-contain sm:h-20"
            />
          </Link>
        </motion.div>

        {/* Nav links — hidden on mobile */}
        <nav aria-label="Primary" className="hidden md:block">
          <motion.ul
            className="flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: navColor }}
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {navigationItems.map((item) => (
              <motion.li key={item} variants={fadeDown} whileHover="hover">
                <Link href="#" className="relative block py-1 opacity-80 hover:opacity-100 transition-opacity duration-200">
                  {item}
                  <motion.span
                    className="absolute bottom-0 left-0 h-px w-full bg-current"
                    variants={underline}
                    initial={{ scaleX: 0 }}
                    style={{ transformOrigin: "left" }}
                  />
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </nav>

        {/* Action icons */}
        <motion.div
          className="flex items-center gap-3 sm:gap-4"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {actionItems.map(({ label, icon: Icon }) => (
            <motion.div key={label} variants={fadeDown}>
              <Link href="#" aria-label={label} className="block">
                <motion.div
                  whileHover={{ y: -2, scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ duration: 0.22, ease }}
                  style={{ color: navColor }}
                >
                  <Icon />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.header>
  );
}
