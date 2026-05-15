import { motion } from "framer-motion";
import { ease } from "@/lib/animations";
import InfoIcon from "@/components/icons/InfoIcon";

export function InfoNote() {
  return (
    <motion.div
      className="mt-4 flex gap-3 rounded-2xl bg-foreground/4 px-5 py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease, delay: 0.15 }}
    >
      <InfoIcon />
      <p className="text-[11px] leading-relaxed text-foreground/50">
        Credentials are stored in{" "}
        <code className="rounded bg-foreground/8 px-1 py-0.5 font-mono text-[10px]">.env.local</code>.
        Changes take effect immediately without a server restart.
      </p>
    </motion.div>
  );
}