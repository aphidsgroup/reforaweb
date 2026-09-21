"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ReceiptText,
  TicketPercent,
  Users,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminSession } from "@/lib/admin-auth";

const NAV = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", Icon: ReceiptText },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/coupons", label: "Coupons", Icon: TicketPercent },
  { href: "/admin/customers", label: "Customers", Icon: Users },
];

export function AdminShell({
  session,
  signOut,
  children,
}: {
  session: AdminSession;
  signOut: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const nav = (
    <nav className="flex-1 px-3 py-5 space-y-1" aria-label="Admin sections">
      {NAV.map(({ href, label, Icon, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-sm transition-colors duration-200",
              active
                ? "bg-ivory/10 text-ivory"
                : "text-ivory/60 hover:text-ivory hover:bg-ivory/[0.06]"
            )}
          >
            <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const identity = (
    <div className="px-5 py-5 border-t border-ivory/12">
      <p className="text-sm text-ivory truncate">{session.name}</p>
      <p className="text-xs text-ivory/45 truncate mb-3">
        {session.email} · {session.role.replace("_", " ")}
      </p>
      <form action={signOut}>
        <button
          type="submit"
          className="inline-flex items-center gap-2 text-xs text-ivory/60 hover:text-ivory transition-colors"
        >
          <LogOut size={13} strokeWidth={1.5} aria-hidden="true" />
          Sign out
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory lg:grid lg:grid-cols-[248px_1fr]">
      {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col bg-espresso text-ivory sticky top-0 h-screen">
        <div className="px-5 py-6 border-b border-ivory/12">
          <Link href="/admin" className="wordmark text-lg text-ivory">
            REFORA
          </Link>
          <p className="eyebrow text-gold mt-1.5">Admin</p>
        </div>
        {nav}
        {identity}
      </aside>

      {/* ── Mobile bar ──────────────────────────────────────────────────── */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-espresso text-ivory px-4 h-14">
        <Link href="/admin" className="wordmark text-base text-ivory">
          REFORA
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={open}
          className="p-2 -mr-2"
        >
          <Menu size={20} strokeWidth={1.4} aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            className="absolute inset-0 w-full bg-espresso/60"
            onClick={() => setOpen(false)}
            aria-label="Close admin menu"
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-espresso text-ivory flex flex-col">
            <div className="flex items-center justify-between px-5 h-14 border-b border-ivory/12">
              <span className="wordmark text-base">REFORA</span>
              <button onClick={() => setOpen(false)} aria-label="Close" className="p-2 -mr-2">
                <X size={18} strokeWidth={1.4} aria-hidden="true" />
              </button>
            </div>
            {nav}
            {identity}
          </div>
        </div>
      )}

      <div className="min-w-0">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Shared building blocks for admin pages
   ═══════════════════════════════════════════════════════════════════════════ */

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-serif text-3xl font-light text-espresso leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-espresso/55 mt-1.5">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone: Record<string, string> = {
    delivered: "bg-gold/20 text-espresso border-gold/50",
    paid: "bg-gold/20 text-espresso border-gold/50",
    published: "bg-gold/20 text-espresso border-gold/50",
    shipped: "bg-clay/15 text-clay border-clay/40",
    out_for_delivery: "bg-clay/15 text-clay border-clay/40",
    processing: "bg-sand text-espresso/75 border-sand",
    confirmed: "bg-sand text-espresso/75 border-sand",
    pending: "bg-cream text-espresso/60 border-sand",
    draft: "bg-cream text-espresso/60 border-sand",
    upcoming: "bg-cream text-espresso/60 border-sand",
    cancelled: "bg-rose/15 text-rose border-rose/40",
    failed: "bg-rose/15 text-rose border-rose/40",
    refunded: "bg-rose/15 text-rose border-rose/40",
    returned: "bg-rose/15 text-rose border-rose/40",
    archived: "bg-cream text-espresso/45 border-sand",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center text-[0.625rem] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full border whitespace-nowrap",
        tone[status] ?? "bg-cream text-espresso/60 border-sand"
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
