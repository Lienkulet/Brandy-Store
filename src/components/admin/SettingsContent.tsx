"use client";

import { PageHeader } from "@/components/admin/AdminPrimitives";
import { useSettings } from "@/hooks/useSettings";
import { CredentialsForm } from "@/components/admin/settings/CredentialsForm";
import { InfoNote } from "@/components/admin/settings/InfoNote";

export function SettingsContent() {
  const settings = useSettings();

  return (
    <main>
      <PageHeader title="Settings" subtitle="Manage your admin credentials." />

      <div className="mt-6 w-full">
        <CredentialsForm {...settings} />
        <InfoNote />
      </div>
    </main>
  );
}
