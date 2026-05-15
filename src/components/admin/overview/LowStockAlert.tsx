import { motion } from "framer-motion";
import { ease } from "@/lib/animations";
import WarningIcon from "@/components/icons/WarningIcon";

export function LowStockAlert({ count }: { count: number }) {
  return (
    <motion.div
      className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease, delay: 0.38 }}
    >
      <div className="flex items-start gap-3">
        <WarningIcon />
        <div>
          <p className="text-[11px] font-semibold text-amber-800">
            {count} product{count > 1 ? "s" : ""} fully out of stock
          </p>
          <p className="mt-0.5 text-[11px] text-amber-700/70">
            Review your products to update stock availability.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
