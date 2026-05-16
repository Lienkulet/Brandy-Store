import Link from "next/link";
import { NAV } from "@/data/admin-nav";
import MenuIcon from "@/components/icons/MenuIcon";
import ExternalLinkIcon from "@/components/icons/ExternalLinkIcon";

type Props = {
  pathname:    string;
  onMenuOpen:  () => void;
};

export function AdminTopBar({ pathname, onMenuOpen }: Props) {
  const currentLabel = NAV.find((n) => pathname.startsWith(n.href))?.label ?? "Admin";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-foreground/8 bg-white px-5 lg:px-7">
      <button
        onClick={onMenuOpen}
        className="cursor-pointer text-foreground/50 hover:text-foreground transition-colors lg:hidden"
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>

      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/40 lg:ml-0 ml-4">
        {currentLabel}
      </p>

      <Link
        href="/shop"
        target="_blank"
        className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40 transition-colors duration-200 hover:text-foreground"
      >
        View Store
        <ExternalLinkIcon />
      </Link>
    </header>
  );
}
