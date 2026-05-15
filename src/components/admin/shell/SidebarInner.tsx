import Image from "next/image";
import Link from "next/link";
import { NAV } from "@/data/admin-nav";
import LogoutIcon from "@/components/icons/LogoutIcon";

type Props = {
  pathname: string;
  onLogout: () => void;
  onNav?:   () => void;
};

export function SidebarInner({ pathname, onLogout, onNav }: Props) {
  return (
    <>
      <div className="flex h-14 shrink-0 items-center border-b border-foreground/8 px-5">
        <Image src="/logo.png" alt="Brandy Store" width={120} height={48} className="h-9 w-auto object-contain" />
      </div>

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
                <item.Icon />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

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
