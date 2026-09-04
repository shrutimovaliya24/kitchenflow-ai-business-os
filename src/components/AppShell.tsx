"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChefHat, RefreshCw } from "lucide-react";
import { navItems } from "./nav";
import { portalConfig } from "@/config/portal.config";
import { usePortalData } from "./PortalDataProvider";
import { formatTimestamp } from "@/lib/portalData";

function DataStatus() {
  const { status, data, refreshing, refresh } = usePortalData();

  const label =
    status === "loading"
      ? "Loading live data…"
      : status === "error"
        ? "Live data unavailable"
        : data
          ? `Last updated ${formatTimestamp(data.generatedAt)}`
          : "";

  return (
    <div className="ml-auto flex items-center gap-2">
      <span
        className={`hidden text-xs sm:inline ${
          status === "error" ? "text-rose-600" : "text-ink-400"
        }`}
      >
        {label}
      </span>
      <button
        onClick={refresh}
        disabled={refreshing || status === "loading"}
        className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-2.5 py-1.5 text-xs font-medium text-ink-600 transition-colors hover:bg-ink-100 disabled:opacity-50"
        aria-label="Refresh live data"
      >
        <RefreshCw
          size={14}
          className={refreshing || status === "loading" ? "animate-spin" : undefined}
        />
        <span className="hidden sm:inline">Refresh</span>
      </button>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-ink-800 bg-ink-900 text-ink-100 transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-ink-800 px-5 py-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-ink-950">
            <ChefHat size={20} />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">{portalConfig.app.shortName}</p>
            <p className="text-xs text-ink-400">Business OS Portal</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-brand-500/15 text-brand-200"
                    : "text-ink-300 hover:bg-ink-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Backdrop */}
      {open && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-ink-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
          <button
            className="focus-ring rounded-lg p-1.5 text-ink-600 hover:bg-ink-100 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-ink-900 lg:text-base">
              {portalConfig.app.name}
            </h1>
            <p className="hidden truncate text-xs text-ink-500 sm:block">
              {portalConfig.app.tagline}
            </p>
          </div>
          <DataStatus />
          {open && (
            <button
              className="rounded-lg p-1.5 text-ink-600 lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          )}
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
        <footer className="border-t border-ink-200 px-4 py-4 text-center text-xs text-ink-400 lg:px-8">
          {portalConfig.app.company} · {portalConfig.app.name}
        </footer>
      </div>
    </div>
  );
}
