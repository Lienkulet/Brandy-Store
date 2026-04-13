import Image from "next/image";
import Link from "next/link";
import { AccountIcon } from "../icons/Account";
import { CartIcon } from "../icons/CartIcon";
import { SearchIcon } from "../icons/SearchIcon";

const navigationItems = [
  "The Story",
  "New & Featured",
  "Women",
  "Men",
];

const actionItems = [
  { label: "Search", icon: SearchIcon },
  { label: "Cart", icon: CartIcon },
  { label: "Account", icon: AccountIcon },
];

export function Navbar() {
  return (
    <header className="mb-8 border-b border-border/80 pb-4 sm:mb-10 sm:pb-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="#" className="order-1 self-center" aria-label="Home">
          <Image
            src="/logo.png"
            alt="Brandy Store"
            width={260}
            height={104}
            priority
            className="h-20 w-auto object-contain sm:h-24"
          />
        </Link>

        <nav aria-label="Primary" className="order-2 overflow-x-auto">
          <ul className="flex min-w-max items-center gap-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/85 sm:gap-7 sm:text-xs">
            {navigationItems.map((item) => (
              <li key={item}>
                <Link href="#" className="transition-opacity hover:opacity-65">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="order-3 flex items-center justify-end gap-4 text-black md:min-w-31">
          {actionItems.map(({ label, icon: Icon }) => (
            <Link
              key={label}
              href="#"
              aria-label={label}
              className="transition-transform hover:scale-105"
            >
              <Icon />
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
