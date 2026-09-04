"use client";

import Link from "next/link";
import { LayoutDashboard, ArrowRight, AlertTriangle } from "lucide-react";
import { portalConfig } from "@/config/portal.config";
import { DataBoundary } from "@/components/PortalDataProvider";
import {
  Card,
  KpiCard,
  PageHeader,
  Section,
  EmptyState,
} from "@/components/ui";
import {
  formatCount,
  formatCurrency,
  formatDate,
  type PortalData,
} from "@/lib/portalData";

const levelDot: Record<string, string> = {
  info: "bg-sky-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
};

/** Recent activity derived from timestamped API rows — nothing hardcoded. */
function buildActivity(data: PortalData) {
  const items: {
    id: string;
    at: string;
    module: string;
    message: string;
    level: keyof typeof levelDot;
  }[] = [];

  for (const p of data.partnerDecisions) {
    if (p.isIncomplete) continue;
    items.push({
      id: `partner-${p.partnerId}`,
      at: p.checkedAt,
      module: "Partner Verification",
      message: `${p.partnerId} ${p.restaurantName} — ${p.decision}${
        p.riskScore === null ? "" : ` (risk ${p.riskScore})`
      }.`,
      level: p.decision.toLowerCase() === "approved" ? "success" : "warning",
    });
  }

  for (const c of data.marketingCampaigns) {
    items.push({
      id: `campaign-${c.contentId}`,
      at: c.createdAt,
      module: "Marketing",
      message: `${c.campaignId} ${c.restaurantName} — ${c.approvalStatus}.`,
      level: "info",
    });
  }

  for (const e of data.openErrors) {
    items.push({
      id: `error-${e.errorId}`,
      at: e.createdAt,
      module: "Workflow Monitoring",
      message: `${e.errorId} ${e.workflowName} — ${e.errorType}.`,
      level: "warning",
    });
  }

  return items
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 8);
}

export default function DashboardPage() {
  const { modules } = portalConfig.dashboard;

  return (
    <div>
      <PageHeader
        title="Business OS Summary"
        description={portalConfig.app.tagline}
        icon={LayoutDashboard}
      />

      <Section
        title="Live Metrics"
        description="Read from the KitchenFlow WF-06 data API."
      >
        <DataBoundary select={(d) => d.dashboard}>
          {(dash) => (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <KpiCard label="Configured Workflows" value={formatCount(dash.configuredWorkflows)} />
              <KpiCard label="Active Automation Workflows" value={formatCount(dash.activeAutomationWorkflows)} />
              <KpiCard label="Support Tickets" value={formatCount(dash.supportTickets)} />
              <KpiCard label="Partner Records" value={formatCount(dash.partnerRecords)} />
              <KpiCard label="Approved Partner Decisions" value={formatCount(dash.approvedPartnerDecisions)} />
              <KpiCard label="Marketing Campaigns" value={formatCount(dash.marketingCampaigns)} />
              <KpiCard label="Net Revenue" value={formatCurrency(dash.netRevenue)} />
              <KpiCard label="Open Errors" value={formatCount(dash.openErrors)} />
            </div>
          )}
        </DataBoundary>
      </Section>

      <Section title="Open Errors" description="Unresolved entries from the Error_Log.">
        <DataBoundary
          select={(d) => d.openErrors}
          isEmpty={(rows) => rows.length === 0}
          emptyTitle="No open errors"
          emptyDescription="The API returned no unresolved errors."
        >
          {(errors) => (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {errors.map((e) => (
                <Card key={e.errorId} className="flex items-start gap-3">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-ink-400">
                      {e.errorId} · {e.traceId}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-ink-900">
                      {e.workflowName}
                    </p>
                    <p className="mt-1 text-sm text-ink-600">{e.errorMessage}</p>
                    <p className="mt-2 text-xs text-ink-400">
                      {e.errorType} · {e.nodeName} · {formatDate(e.createdAt)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </DataBoundary>
      </Section>

      <Section title="Modules" description="Every part of the Business OS.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <Link key={m.id} href={m.href} className="focus-ring group">
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <h4 className="font-semibold text-ink-900">{m.name}</h4>
                <p className="mt-2 text-sm text-ink-500">{m.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-ink-400">
                  <span>Owner: {m.owner}</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        title="Recent Activity"
        description="Derived from timestamped partner, campaign and error records."
      >
        <DataBoundary select={buildActivity} isEmpty={(items) => items.length === 0}>
          {(activity) =>
            activity.length === 0 ? (
              <EmptyState description="No timestamped records were returned." />
            ) : (
              <Card className="divide-y divide-ink-100 p-0">
                {activity.map((a) => (
                  <div key={a.id} className="flex gap-3 p-4">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        levelDot[a.level] ?? "bg-ink-300"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-ink-800">{a.message}</p>
                      <p className="mt-0.5 text-xs text-ink-400">
                        {formatDate(a.at)} · {a.module}
                      </p>
                    </div>
                  </div>
                ))}
              </Card>
            )
          }
        </DataBoundary>
      </Section>
    </div>
  );
}
