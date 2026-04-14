"use client";

import { useState } from "react";
import BlackBtn from "./ui/BlackBtn";

type Status = "idle" | "sending" | "sent";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    // TODO: wire to backend / email service
    setTimeout(() => setStatus("sent"), 1200);
  }

  if (status === "sent") {
    return (
      <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-foreground/8 bg-foreground/2 px-8 py-12 text-center">
        <p className="font-serif text-2xl font-semibold text-foreground">
          Message received.
        </p>
        <p className="mt-3 text-sm text-muted">
          We'll get back to you within a few hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/50">
          Name
        </label>
        <input
          type="text"
          required
          placeholder="Your name"
          className="w-full rounded-xl border border-foreground/12 bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted/50 focus:border-foreground/40 transition-colors duration-200"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/50">
          Phone or Email
        </label>
        <input
          type="text"
          required
          placeholder="+373 or email address"
          className="w-full rounded-xl border border-foreground/12 bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted/50 focus:border-foreground/40 transition-colors duration-200"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/50">
          Message
        </label>
        <textarea
          required
          rows={5}
          placeholder="What can we help you with?"
          className="w-full resize-none rounded-xl border border-foreground/12 bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted/50 focus:border-foreground/40 transition-colors duration-200"
        />
      </div>

      <BlackBtn
        name={status === "sending" ? "Sending…" : "Send Message"}
        type="submit"
      />
    </form>
  );
}
