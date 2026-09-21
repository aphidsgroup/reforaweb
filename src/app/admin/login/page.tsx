import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { authenticate, getAdminSession, startSession } from "@/lib/admin-auth";
import { LeafMotif } from "@/components/ui/brand-art";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

async function signIn(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) redirect("/admin/login?error=missing");

  const session = await authenticate(email, password);
  // One generic message for every failure — never reveal whether the address
  // exists, is inactive, or simply had the wrong password.
  if (!session) redirect("/admin/login?error=invalid");

  await startSession(session);
  redirect("/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getAdminSession()) redirect("/admin");

  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-espresso text-ivory grid place-items-center px-5 py-12 relative overflow-hidden grain">
      <div
        className="absolute -left-20 -bottom-24 w-80 text-gold opacity-[0.08] rotate-[-14deg] pointer-events-none"
        aria-hidden="true"
      >
        <LeafMotif className="w-full h-auto" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="wordmark text-2xl text-ivory mb-3">REFORA</p>
          <p className="eyebrow text-gold">Admin</p>
        </div>

        <form
          action={signIn}
          className="bg-ivory/[0.04] border border-ivory/15 rounded-sm p-7 backdrop-blur-sm"
        >
          {error && (
            <p
              role="alert"
              className="mb-5 text-sm text-rose border border-rose/40 bg-rose/10 rounded-sm px-4 py-3"
            >
              {error === "missing"
                ? "Enter both your email and password."
                : "Those details were not recognised."}
            </p>
          )}

          <div className="mb-5">
            <label htmlFor="email" className="label-refora text-ivory/55">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              autoFocus
              className="input-refora bg-ivory/[0.06] border-ivory/25 text-ivory placeholder:text-ivory/35 focus:border-gold"
              placeholder="you@refora.in"
            />
          </div>

          <div className="mb-7">
            <label htmlFor="password" className="label-refora text-ivory/55">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="input-refora bg-ivory/[0.06] border-ivory/25 text-ivory placeholder:text-ivory/35 focus:border-gold"
              placeholder="••••••••••••"
            />
          </div>

          <button type="submit" className="btn btn-gold btn-block">
            <span>Sign in</span>
          </button>
        </form>

        <p className="text-center text-xs text-ivory/35 mt-7">
          Authorised access only. Activity is logged.
        </p>
      </div>
    </main>
  );
}
