import { motion } from "framer-motion";
import { ease } from "@/lib/animations";
import { FormField } from "@/components/admin/form/FormPrimitives";
import EyeIcon from "@/components/icons/EyeIcon";
import EyeOffIcon from "@/components/icons/EyeOffIcon";
import type { useSettings } from "@/hooks/useSettings";

type Props = ReturnType<typeof useSettings>;

export function CredentialsForm({
  email, setEmail,
  currPass, setCurrPass,
  newPass, setNewPass,
  confirm, setConfirm,
  showNew, setShowNew,
  status, errMsg,
  handleSave,
}: Props) {
  return (
    <motion.div
      className="rounded-2xl border border-foreground/8 bg-white p-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease }}
    >
      <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/55">
        Change credentials
      </p>

      <form onSubmit={handleSave} className="space-y-4" noValidate>
        <FormField label="New email / username">
          <input
            type="text"
            placeholder="Leave blank to keep current"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </FormField>

        <div className="h-px bg-foreground/8" />

        <FormField label="Current password" required>
          <input
            type="password"
            placeholder="••••••••"
            value={currPass}
            onChange={(e) => setCurrPass(e.target.value)}
            className="input-field"
            required
          />
        </FormField>

        <FormField label="New password">
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              placeholder="Leave blank to keep current"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="input-field pr-11"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-foreground/35 transition-colors hover:text-foreground"
            >
              {showNew ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </FormField>

        {newPass && (
          <FormField label="Confirm new password" required>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="input-field"
            />
          </FormField>
        )}

        {(status === "error" || errMsg) && (
          <motion.p
            className="text-[11px] font-semibold text-red-500"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {errMsg}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={status === "saving" || !currPass}
          className="cursor-pointer w-full rounded-full bg-foreground py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-foreground/85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "saving" ? "Saving…" : status === "saved" ? "✓ Saved" : "Save changes"}
        </button>
      </form>
    </motion.div>
  );
}
