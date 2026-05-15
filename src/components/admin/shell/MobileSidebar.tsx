import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/animations";
import { SidebarInner } from "@/components/admin/shell/SidebarInner";

type Props = {
  open:     boolean;
  pathname: string;
  onClose:  () => void;
  onLogout: () => void;
};

export function MobileSidebar({ open, pathname, onClose, onLogout }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed left-0 top-0 z-50 flex h-dvh w-56 flex-col border-r border-foreground/8 bg-white lg:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.35, ease }}
          >
            <SidebarInner pathname={pathname} onLogout={onLogout} onNav={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
