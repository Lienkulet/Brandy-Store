import Link from "next/link";
import { motion } from "framer-motion";
import { ease } from "@/lib/animations";
import BagIcon from "@/components/icons/BagIcon";

type Props = { onClose: () => void };

export function EmptyCart({ onClose }: Props) {
  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center px-8 py-24 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease, delay: 0.15 }}
    >
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-foreground/5">
        <span className="text-foreground/35"><BagIcon size={32} /></span>
      </div>

      <p className="font-serif text-2xl font-semibold text-foreground">Your bag is empty</p>
      <p className="mt-3 max-w-56 text-sm leading-relaxed text-muted">
        Add pieces you love and they will appear here.
      </p>

      <Link
        href="/shop"
        onClick={onClose}
        className="mt-10 inline-block rounded-full border border-foreground px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors duration-300 hover:bg-foreground hover:text-white"
      >
        Explore the Shop
      </Link>
    </motion.div>
  );
}
