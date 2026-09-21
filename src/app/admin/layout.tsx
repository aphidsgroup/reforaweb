import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession, endSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · REFORA Admin" },
  robots: { index: false, follow: false },
};

/**
 * The admin area sits outside the (store) route group, so it inherits the root
 * layout's fonts and tokens but none of the storefront chrome.
 *
 * This layout only decides whether to draw the shell — it is NOT the security
 * boundary. The login page renders through here without a session, so every
 * admin page and every server action calls `requireAdmin()` for itself. A
 * layout check could not protect actions anyway: they are independently
 * addressable POST endpoints that do not re-run this file.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // No session — render bare. This is the login page's case; any other admin
  // page redirects itself via requireAdmin().
  if (!session) return <>{children}</>;

  async function signOut() {
    "use server";
    await endSession();
    redirect("/admin/login");
  }

  return (
    <AdminShell session={session} signOut={signOut}>
      {children}
    </AdminShell>
  );
}
