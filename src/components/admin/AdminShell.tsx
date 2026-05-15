"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/animations";
import ExternalLinkIcon from "@/components/icons/ExternalLinkIcon";
import LogoutIcon from "@/components/icons/LogoutIcon";
import MenuIcon from "@/components/icons/MenuIcon";
import OrderIcon from "@/components/icons/OrderIcon";
import OverviewIcon from "@/components/icons/OverviewIcon";
import ProductsIcon from "@/components/icons/ProductsIcon";
import SettingsIcon from "@/components/icons/SettingsIcon";

const NAV = [
  {
    href:  "/admin/overview",
    label: "Overview",
    icon: (
      <OverviewIcon />
    ),
  },
  {
    href:  "/admin/orders",
    label: "Orders",
    icon: (
      <OrderIcon />
    ),
  },
  {
    href:  "/admin/products",
    label: "Products",
    icon: (
     <ProductsIcon />
    ),
  },
  {
    href:  "/admin/settings",
    label: "Settings",
    icon: (
      <SettingsIcon />
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
            <MenuIcon />
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
            <ExternalLinkIcon />
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
          <LogoutIcon />
          Log out
        </button>
      </div>
    </>
  );
}
