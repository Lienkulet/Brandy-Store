"use client";

import { useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useSettings() {
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

  return {
    email, setEmail,
    currPass, setCurrPass,
    newPass, setNewPass,
    confirm, setConfirm,
    showNew, setShowNew,
    status, errMsg,
    handleSave,
  };
}
