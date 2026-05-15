import { motion } from "framer-motion";
import { ease } from "@/lib/animations";

type Props = {
  label:    string;
  value:    string;
  sublabel: string;
  icon:     React.ReactNode;
  index:    number;
};

export function StatCard({ label, value, sublabel, icon, index }: Props) {
  return (
    <motion.div
      className="rounded-2xl border border-foreground/8 bg-white p-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease, delay: index * 0.07 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/40">
          {label}
        </p>
        <span className="text-foreground/25">{icon}</span>
      </div>
      <p className="font-serif text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-[11px] text-muted">{sublabel}</p>
    </motion.div>
  );
}
