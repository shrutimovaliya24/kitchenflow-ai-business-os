import Link from "next/link";
import {
  AlertTriangle,
  Inbox,
  Loader2,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { portalConfig } from "@/config/portal.config";

/* ---------------- Page header ---------------- */

export function PageHeader({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-700">
            <Icon size={20} />
          </span>
        )}
        <div>
          <h2 className="text-xl font-semibold text-ink-900 lg:text-2xl">{title}</h2>
          {description && (
            <p className="mt-1 max-w-3xl text-sm text-ink-500">{description}</p>
          )}
        </div>
      </div>
      <GlobalLabels className="mt-3" />
    </div>
  );
}

/* ---------------- Global labels ---------------- */

export function GlobalLabels({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {portalConfig.app.globalLabels.map((label) => (
        <span
          key={label}
          className="pill border border-brand-200 bg-brand-50 text-brand-700"
        >
          <ShieldCheck size={12} />
          {label}
        </span>
      ))}
    </div>
  );
}

/* ---------------- Section ---------------- */

export function Section({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-ink-900">{title}</h3>
          {description && <p className="text-sm text-ink-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/* ---------------- Card ---------------- */

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`card p-4 lg:p-5 ${className}`}>{children}</div>;
}

/* ---------------- KPI card ---------------- */

export function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="flex flex-col gap-1">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
        {label}
      </p>
      <p className="text-2xl font-semibold text-ink-900">{value}</p>
      {hint && <p className="text-xs text-ink-400">{hint}</p>}
    </Card>
  );
}

/* ---------------- Status badge ---------------- */

type Tone = "success" | "warning" | "info" | "danger" | "neutral";

const toneStyles: Record<Tone, string> = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-sky-100 text-sky-700",
  danger: "bg-rose-100 text-rose-700",
  neutral: "bg-ink-200 text-ink-600",
};

const statusToneMap: Record<string, Tone> = {
  operational: "success",
  active: "success",
  completed: "info",
  approved: "success",
  "auto-approved": "success",
  success: "success",
  healthy: "success",
  low: "success",
  suspicious: "warning",
  warning: "warning",
  pending: "warning",
  open: "warning",
  medium: "warning",
  "pending human approval": "warning",
  "draft created": "info",
  info: "info",
  failing: "danger",
  rejected: "danger",
  error: "danger",
  high: "danger",
  paused: "neutral",
  unknown: "neutral",
};

export function StatusBadge({
  status,
  tone,
}: {
  status: string;
  tone?: Tone;
}) {
  const resolved = tone ?? statusToneMap[status.toLowerCase()] ?? "neutral";
  return (
    <span className={`pill ${toneStyles[resolved]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

/* ---------------- External link button ---------------- */

export function ExternalLinkButton({
  label,
  url,
}: {
  label: string;
  url: string;
}) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
    >
      {label}
      <ExternalLink size={15} />
    </Link>
  );
}

/* ---------------- States ---------------- */

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-ink-300 bg-white p-10 text-sm text-ink-500">
      <Loader2 className="animate-spin" size={18} />
      {label}
    </div>
  );
}

export function EmptyState({
  title = "Nothing here yet",
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-300 bg-white p-10 text-center">
      <Inbox className="text-ink-300" size={28} />
      <p className="mt-2 text-sm font-medium text-ink-700">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-ink-400">{description}</p>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-rose-300 bg-rose-50 p-10 text-center">
      <AlertTriangle className="text-rose-400" size={28} />
      <p className="mt-2 text-sm font-medium text-rose-800">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-rose-500">{description}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="focus-ring mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}

/* ---------------- Flow steps ---------------- */

export function FlowSteps({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <span className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800">
            {step}
          </span>
          {i < steps.length - 1 && (
            <ArrowRight className="text-ink-300" size={16} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------------- JSON block ---------------- */

export function JsonBlock({ data }: { data: unknown }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-ink-800 bg-ink-900 p-4 text-xs leading-relaxed text-ink-100">
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}
