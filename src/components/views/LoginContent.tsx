"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ease } from "@/lib/animations";
import EyeOffIcon from "@/components/icons/EyeOffIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import SpinnerIcon from "@/components/icons/SpinnerIcon";

type Status = "idle" | "loading" | "error";

export function LoginContent() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [status,   setStatus]   = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/auth/login", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setStatus("error");
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-16">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
      >
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <Image
            src="/logo.png"
            alt="Brandy Store"
            width={200}
            height={80}
            className="h-14 w-auto object-contain"
          />
        </div>

        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-muted">
            Access the Brandy Store admin panel.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/55"
            >
              Email / Username
            </label>
            <input
              id="email"
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
              className={`input-field ${status === "error" ? "border-red-400!" : ""}`}
              placeholder="admin"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/55"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setStatus("idle"); }}
                className={`input-field pr-11 ${status === "error" ? "border-red-400!" : ""}`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-foreground/35 transition-colors duration-150 hover:text-foreground"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Error */}
          {status === "error" && (
            <motion.p
              className="text-[11px] font-semibold text-red-500"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease }}
            >
              Incorrect email or password. Please try again.
            </motion.p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="cursor-pointer w-full rounded-full bg-foreground py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-foreground/85 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center gap-2">
                <SpinnerIcon size={13} />
                Signing in…
              </span>
            ) : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-10 border-t border-foreground/8 pt-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/30">
            Brandy Store &copy; {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>
    </main>
  );
}
