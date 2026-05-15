"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ease } from "@/lib/animations";
import { navigationItems, navSocialLinks } from "@/data/nav-links";

type Props = { onClose: () => void; pathname: string };

export function MobileMenu({ onClose, pathname }: Props) {
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
        <div className="flex items-center gap-5">
          {navSocialLinks.map(({ label, href, icon: Icon }) => (
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

        <p className="font-serif text-sm italic text-white/25">
          Dressed for every room.
        </p>
      </motion.div>
    </motion.div>
  );
}
