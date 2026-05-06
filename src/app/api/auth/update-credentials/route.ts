import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

const ENV_PATH = path.resolve(process.cwd(), ".env.local");

async function readEnv(): Promise<Record<string, string>> {
  try {
    const raw = await readFile(ENV_PATH, "utf-8");
    return Object.fromEntries(
      raw.split("\n")
        .filter((line) => line.includes("="))
        .map((line) => {
          const [k, ...rest] = line.split("=");
          return [k.trim(), rest.join("=").trim()];
        })
    );
  } catch {
    return {};
  }
}

async function writeEnv(vars: Record<string, string>) {
  const content = Object.entries(vars)
    .map(([k, v]) => `${k}=${v}`)
    .join("\n") + "\n";
  await writeFile(ENV_PATH, content, "utf-8");
}

export async function POST(req: NextRequest) {
  // Must be authenticated
  const session = req.cookies.get("brandy-session")?.value;
  if (session !== "brandy-authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newEmail, newPassword } = await req.json();

  const env = await readEnv();

  // Verify current password
  if (currentPassword !== (env.ADMIN_PASSWORD ?? "")) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  }

  if (newEmail)    env.ADMIN_EMAIL    = newEmail;
  if (newPassword) env.ADMIN_PASSWORD = newPassword;

  await writeEnv(env);

  return NextResponse.json({ ok: true });
}
