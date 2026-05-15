"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarInner } from "@/components/admin/shell/SidebarInner";
import { MobileSidebar } from "@/components/admin/shell/MobileSidebar";
import { AdminTopBar } from "@/components/admin/shell/AdminTopBar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-[#f7f5f2] text-foreground">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-foreground/8 bg-white lg:flex">
        <SidebarInner pathname={pathname} onLogout={handleLogout} />
      </aside>

      <MobileSidebar
        open={mobileOpen}
        pathname={pathname}
        onClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopBar pathname={pathname} onMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
