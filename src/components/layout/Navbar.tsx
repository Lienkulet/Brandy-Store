"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  motion, AnimatePresence,
  useScroll, useTransform, useMotionTemplate,
  type Variants,
} from "framer-motion";
import { AccountIcon } from "@/components/icons/Account";
import { CartIcon } from "@/components/icons/CartIcon";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { useCart } from "@/context/CartContext";
import { ease } from "@/lib/animations";
import { navigationItems } from "@/data/nav-links";
import { MobileMenu } from "@/components/layout/nav/MobileMenu";

const actionItems = [
  // { label: "Search",  icon: SearchIcon  },
  { label: "Cart",    icon: CartIcon    },
  { label: "Account", icon: AccountIcon },
];

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
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isOpen, setIsOpen]         = useState(false);
  const [cartOpen, setCartOpen]     = useState(false);
  const [authed, setAuthed]         = useState(false);
  const [cartPulse, setCartPulse]   = useState(false);
  const { itemCount, isHydrated }   = useCart();
  const previousItemCount = useRef(itemCount);
  const hasHydratedCart = useRef(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setAuthed(d.authenticated ?? false))
      .catch(() => {});
  }, [pathname]);
  const { scrollY } = useScroll();

  // Close menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  // Pulse the cart icon only when the shopper adds something after hydration.
  useEffect(() => {
    if (!isHydrated) return;
    if (!hasHydratedCart.current) {
      previousItemCount.current = itemCount;
      hasHydratedCart.current = true;
      return;
    }

    if (itemCount > previousItemCount.current) {
      setCartPulse(true);
      const timer = window.setTimeout(() => setCartPulse(false), 650);
      previousItemCount.current = itemCount;
      return () => window.clearTimeout(timer);
    }

    previousItemCount.current = itemCount;
  }, [isHydrated, itemCount]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // On inner pages start fully "scrolled" — on homepage animate from transparent
  const bgOpacity   = useTransform(scrollY, [0, 72], isHome ? [0, 0.92]   : [0.92, 0.92]);
  const blurPx      = useTransform(scrollY, [0, 72], isHome ? [0, 14]     : [14, 14]);
  const borderAlpha = useTransform(scrollY, [0, 72], isHome ? [0, 0.1]    : [0.1, 0.1]);
  const shadowAlpha = useTransform(scrollY, [0, 72], isHome ? [0, 0.06]   : [0.06, 0.06]);

  const backgroundColor = useMotionTemplate`rgba(252,250,247,${bgOpacity})`;
  const backdropFilter  = useMotionTemplate`blur(${blurPx}px)`;
  const borderColor     = useMotionTemplate`rgba(76,64,53,${borderAlpha})`;
  const boxShadow       = useMotionTemplate`0 1px 32px rgba(95,77,57,${shadowAlpha})`;

  // Text/icon color: white→dark on homepage, always dark on inner pages
  const navAlpha = useTransform(scrollY, [0, 72], isHome ? [0.75, 0.80] : [0.80, 0.80]);
  const navR     = useTransform(scrollY, [0, 72], isHome ? [255, 30]    : [30, 30]);
  const navG     = useTransform(scrollY, [0, 72], isHome ? [255, 26]    : [26, 26]);
  const navB     = useTransform(scrollY, [0, 72], isHome ? [255, 23]    : [23, 23]);
  const navColor = useMotionTemplate`rgba(${navR},${navG},${navB},${navAlpha})`;

  return (
    <>
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
            <Link href="/" aria-label="Home" className="block">
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

          {/* Nav links — desktop only */}
          <nav aria-label="Primary" className="hidden md:block">
            <motion.ul
              className="flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: navColor }}
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {navigationItems.map((item) => (
                <motion.li key={item.label} variants={fadeDown} whileHover="hover">
                  <Link href={item.href} className="relative block py-1 opacity-80 hover:opacity-100 transition-opacity duration-200">
                    {item.label}
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

          {/* Right side: action icons + hamburger */}
          <motion.div
            className="flex items-center gap-3 sm:gap-4"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* Action icons */}
            {actionItems.map(({ label, icon: Icon }) => (
              <motion.div key={label} variants={fadeDown} className="block">
                {label === "Cart" ? (
                  <button
                    aria-label="Open cart"
                    onClick={() => setCartOpen(true)}
                    className="cursor-pointer relative block"
                  >
                    <motion.div
                      animate={cartPulse ? { y: [0, -3, 0], scale: [1, 1.16, 1], rotate: [0, -8, 8, 0] } : { y: 0, scale: 1, rotate: 0 }}
                      whileHover={{ y: -2, scale: 1.1 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ duration: 0.48, ease }}
                      style={{ color: navColor }}
                    >
                      <Icon />
                    </motion.div>
                    {isHydrated && itemCount > 0 && (
                      <motion.span
                        key={itemCount}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={cartPulse ? { scale: [1, 1.28, 1], opacity: 1 } : { scale: 1, opacity: 1 }}
                        transition={{ duration: 0.42, ease }}
                        className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] font-bold text-white"
                      >
                        {itemCount > 9 ? "9+" : itemCount}
                      </motion.span>
                    )}
                    {cartPulse && (
                      <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-2 -top-2 h-5 w-5 rounded-full border border-foreground/45"
                        initial={{ scale: 0.55, opacity: 0.7 }}
                        animate={{ scale: 1.8, opacity: 0 }}
                        transition={{ duration: 0.55, ease }}
                      />
                    )}
                  </button>
                ) : (
                  <Link
                    href={label === "Account" ? (authed ? "/admin" : "/login") : "#"}
                    aria-label={label}
                    className="block"
                  >
                    <motion.div
                      whileHover={{ y: -2, scale: 1.1 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ duration: 0.22, ease }}
                      style={{ color: navColor }}
                    >
                      <Icon />
                    </motion.div>
                  </Link>
                )}
              </motion.div>
            ))}

            {/* Hamburger — mobile only */}
            <motion.button
              variants={fadeDown}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              onClick={() => setIsOpen((v) => !v)}
              className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.25 md:hidden"
              style={{ color: isOpen ? undefined : navColor } as React.CSSProperties}
            >
              <motion.span
                className="block h-px w-5 rounded-full bg-current origin-center"
                animate={isOpen
                  ? { rotate: 45, y: 6, backgroundColor: "#ffffff" }
                  : { rotate: 0,  y: 0, backgroundColor: "currentColor" }
                }
                transition={{ duration: 0.3, ease }}
              />
              <motion.span
                className="block h-px w-5 rounded-full bg-current origin-center"
                animate={isOpen
                  ? { opacity: 0, scaleX: 0 }
                  : { opacity: 1, scaleX: 1 }
                }
                transition={{ duration: 0.2, ease }}
              />
              <motion.span
                className="block h-px w-5 rounded-full bg-current origin-center"
                animate={isOpen
                  ? { rotate: -45, y: -6, backgroundColor: "#ffffff" }
                  : { rotate: 0,   y: 0,  backgroundColor: "currentColor" }
                }
                transition={{ duration: 0.3, ease }}
              />
            </motion.button>
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {isOpen && (
          <MobileMenu onClose={() => setIsOpen(false)} pathname={pathname} />
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

