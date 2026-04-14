"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  motion, AnimatePresence,
  useScroll, useTransform, useMotionTemplate,
  type Variants,
} from "framer-motion";
import { AccountIcon } from "../icons/Account";
import { CartIcon } from "../icons/CartIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { TelegramIcon } from "../icons/TelegramIcon";
import { TikTokIcon } from "../icons/TikTokIcon";

const navigationItems = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Shop",         href: "/shop"         },
  { label: "The Story",    href: "/about"        },
  { label: "Contact",      href: "/contact"      },
];

const actionItems = [
  { label: "Search",  icon: SearchIcon  },
  { label: "Cart",    icon: CartIcon    },
  { label: "Account", icon: AccountIcon },
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/brandystoremd", icon: InstagramIcon },
  { label: "Telegram",  href: "https://t.me/brandystoremd",              icon: TelegramIcon  },
  { label: "TikTok",    href: "https://www.tiktok.com/@brandystore11",   icon: TikTokIcon    },
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
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

  // Close menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

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
            {/* Action icons — desktop only */}
            {actionItems.map(({ label, icon: Icon }) => (
              <motion.div key={label} variants={fadeDown} className="hidden md:block">
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
    </>
  );
}

/* ─── Mobile menu overlay ─────────────────────────────────────────── */

function MobileMenu({ onClose, pathname }: { onClose: () => void; pathname: string }) {
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col bg-[#1e1a17] px-6 pb-10 pt-28"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease }}
    >
      {/* Nav links */}
      <nav className="flex-1 flex flex-col justify-center gap-1">
        {navigationItems.map((item, i) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.4, ease, delay: 0.05 + i * 0.07 }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                className="group flex items-baseline gap-4 py-4 border-b border-white/8"
              >
                <span className="w-5 text-[10px] font-semibold tabular-nums text-white/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`font-serif text-4xl font-semibold uppercase tracking-[0.04em] transition-colors duration-200 sm:text-5xl ${
                    isActive ? "text-white" : "text-white/60 group-hover:text-white"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                    Current
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom bar */}
      <motion.div
        className="flex items-center justify-between pt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease, delay: 0.35 }}
      >
        {/* Social icons */}
        <div className="flex items-center gap-5">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-white/40 transition-colors duration-200 hover:text-white"
            >
              <Icon />
            </a>
          ))}
        </div>

        {/* Tagline */}
        <p className="font-serif text-sm italic text-white/25">
          Dressed for every room.
        </p>
      </motion.div>
    </motion.div>
  );
}
