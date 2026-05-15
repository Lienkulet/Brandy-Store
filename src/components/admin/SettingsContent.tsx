"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/admin/OverviewContent";
import { ease } from "@/lib/animations";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function SettingsContent() {
  const [email,    setEmail]    = useState("");
  const [currPass, setCurrPass] = useState("");
  const [newPass,  setNewPass]  = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showNew,  setShowNew]  = useState(false);
  const [status,   setStatus]   = useState<SaveStatus>("idle");
  const [errMsg,   setErrMsg]   = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg("");

    if (newPass && newPass !== confirm) {
      setErrMsg("New passwords do not match.");
      return;
    }
    if (newPass && newPass.length < 4) {
      setErrMsg("Password must be at least 4 characters.");
      return;
    }

    setStatus("saving");

    const res = await fetch("/api/auth/update-credentials", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        currentPassword: currPass,
        newEmail:        email || undefined,
        newPassword:     newPass || undefined,
      }),
    });

    if (res.ok) {
      setStatus("saved");
      setCurrPass(""); setNewPass(""); setConfirm("");
      setTimeout(() => setStatus("idle"), 3000);
    } else {
      const data = await res.json().catch(() => ({}));
      setErrMsg(data.error ?? "Something went wrong. Try again.");
      setStatus("error");
    }
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your admin credentials." />

      <div className="mt-6 w-full">
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

            {/* New email */}
            <Field label="New email / username">
              <input
                type="text"
                placeholder="Leave blank to keep current"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </Field>

            <div className="h-px bg-foreground/8" />

            {/* Current password — required for any change */}
            <Field label="Current password" required>
              <input
                type="password"
                placeholder="••••••••"
                value={currPass}
                onChange={(e) => setCurrPass(e.target.value)}
                className="input-field"
                required
              />
            </Field>

            {/* New password */}
            <Field label="New password">
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
                  {showNew ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </Field>

            {/* Confirm new password */}
            {newPass && (
              <Field label="Confirm new password" required>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="input-field"
                />
              </Field>
            )}

            {/* Error */}
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

            {/* Save */}
            <button
              type="submit"
              disabled={status === "saving" || !currPass}
              className="cursor-pointer w-full rounded-full bg-foreground py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-foreground/85 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {status === "saving" ? "Saving…" : status === "saved" ? "✓ Saved" : "Save changes"}
            </button>
          </form>
        </motion.div>

        {/* Info note */}
        <motion.div
          className="mt-4 flex gap-3 rounded-2xl bg-foreground/4 px-5 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease, delay: 0.15 }}
        >
          <svg className="mt-0.5 shrink-0 text-foreground/35" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-[11px] leading-relaxed text-foreground/50">
            Credentials are stored in <code className="rounded bg-foreground/8 px-1 py-0.5 font-mono text-[10px]">.env.local</code>. Changes take effect immediately without a server restart.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/55">
        {label}{required && <span className="ml-0.5 text-foreground/35">*</span>}
      </label>
      {children}
    </div>
  );
}
