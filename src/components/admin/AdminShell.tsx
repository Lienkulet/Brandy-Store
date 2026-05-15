"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/animations";

const NAV = [
  {
    href:  "/admin/overview",
    label: "Overview",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href:  "/admin/orders",
    label: "Orders",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    href:  "/admin/products",
    label: "Products",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    href:  "/admin/settings",
    label: "Settings",
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex h-dvh bg-[#f7f5f2] text-foreground overflow-hidden">

      {/* ── Desktop Sidebar ──────────────────────────────────── */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-foreground/8 bg-white lg:flex">
        <SidebarInner pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* ── Mobile sidebar backdrop ───────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed left-0 top-0 z-50 flex h-dvh w-56 flex-col border-r border-foreground/8 bg-white lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease }}
            >
              <SidebarInner pathname={pathname} onLogout={handleLogout} onNav={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-foreground/8 bg-white px-5 lg:px-7">
          <button
            onClick={() => setMobileOpen(true)}
            className="cursor-pointer text-foreground/50 hover:text-foreground transition-colors lg:hidden"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Current section label */}
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/40 lg:ml-0 ml-4">
            {NAV.find((n) => pathname.startsWith(n.href))?.label ?? "Admin"}
          </p>

          {/* View store link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40 transition-colors duration-200 hover:text-foreground"
          >
            View Store
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ─── Sidebar inner (shared desktop + mobile) ───────────────────────── */

function SidebarInner({
  pathname, onLogout, onNav,
}: {
  pathname: string;
  onLogout: () => void;
  onNav?:   () => void;
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center border-b border-foreground/8 px-5">
        <Image src="/logo.png" alt="Brandy Store" width={120} height={48} className="h-9 w-auto object-contain" />
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNav}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all duration-200 ${
                active
                  ? "bg-foreground text-white!"
                  : "text-foreground/50 hover:bg-foreground/6 hover:text-foreground"
              }`}
            >
              <span className={active ? "text-white!" : "text-foreground/40"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-foreground/8 p-3">
        <button
          onClick={onLogout}
          className="cursor-pointer flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/40 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Log out
        </button>
      </div>
    </>
  );
}
