"use client";

import { useState } from "react";
import BlackBtn from "@/components/ui/BlackBtn";
import { useLang } from "@/context/LanguageContext";

type Status = "idle" | "sending" | "sent";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const { t } = useLang();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1200);
  }

  if (status === "sent") {
    return (
      <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-foreground/8 bg-foreground/2 px-8 py-12 text-center">
        <p className="font-serif text-2xl font-semibold text-foreground">
          {t("form.success.title")}
        </p>
        <p className="mt-3 text-sm text-muted">
          {t("form.success.body")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/50">
          {t("form.name")}
        </label>
        <input
          type="text"
          required
          placeholder={t("form.namePlaceholder")}
          className="w-full rounded-xl border border-foreground/12 bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted/50 focus:border-foreground/40 transition-colors duration-200"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/50">
          {t("form.phoneOrEmail")}
        </label>
        <input
          type="text"
          required
          placeholder={t("form.phoneOrEmailPlaceholder")}
          className="w-full rounded-xl border border-foreground/12 bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted/50 focus:border-foreground/40 transition-colors duration-200"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/50">
          {t("form.message")}
        </label>
        <textarea
          required
          rows={5}
          placeholder={t("form.messagePlaceholder")}
          className="w-full resize-none rounded-xl border border-foreground/12 bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted/50 focus:border-foreground/40 transition-colors duration-200"
        />
      </div>

      <BlackBtn
        name={status === "sending" ? t("form.sending") : t("form.send")}
        type="submit"
      />
    </form>
  );
}
