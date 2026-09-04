"use client";

import { Activity, Bell, Info, AlertTriangle } from "lucide-react";
import { portalConfig } from "@/config/portal.config";
import { DataBoundary } from "@/components/PortalDataProvider";
import { DASH, formatCount, formatDate } from "@/lib/portalData";
import { Card, PageHeader, Section, StatusBadge } from "@/components/ui";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase text-ink-400">{label}</dt>
      <dd className="font-medium text-ink-800">{value}</dd>
    </div>
  );
}

export default function WorkflowMonitoringPage() {
  const wm = portalConfig.workflowMonitoring;

  return (
    <div>
      <PageHeader
        title="Workflow Monitoring"
        description="Execution counts for each workflow, read live from the KitchenFlow WF-06 data API."
        icon={Activity}
      />

      <div className="mb-6 flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
        <Info size={16} className="mt-0.5 shrink-0" />
        <span>{wm.systemNote}</span>
      </div>

      <Section title="Workflows">
        <DataBoundary
          select={(d) => d.workflows}
          isEmpty={(rows) => rows.length === 0}
          emptyTitle="No workflows returned"
          emptyDescription="The API responded successfully but returned no workflow records."
        >
          {(workflows) => (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {workflows.map((w) => {
                const description = wm.descriptions[w.workflowId];
                const note = wm.notes[w.workflowId];
                return (
                  <Card key={w.workflowId || w.workflowName}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-mono text-xs text-ink-400">
                          {w.workflowId || DASH}
                        </p>
                        <h4 className="font-semibold text-ink-900">
                          {w.workflowName || DASH}
                        </h4>
                      </div>
                      {w.status ? (
                        <StatusBadge status={w.status} />
                      ) : (
                        <StatusBadge status="Status not reported" tone="neutral" />
                      )}
                    </div>
                    {description && (
                      <p className="mt-2 text-sm text-ink-500">{description}</p>
                    )}
                    <dl className="mt-4 grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
                      <Stat label="Total" value={formatCount(w.total)} />
                      <Stat label="Success" value={formatCount(w.success)} />
                      <Stat label="Failure" value={formatCount(w.failure)} />
                    </dl>
                    {note && (
                      <p className="mt-3 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-700">
                        {note}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </DataBoundary>
      </Section>

      <Section title="Open Errors" description="Unresolved Error_Log entries.">
        <DataBoundary
          select={(d) => d.openErrors}
          isEmpty={(rows) => rows.length === 0}
          emptyTitle="No open errors"
          emptyDescription="The API returned no unresolved errors."
        >
          {(errors) => (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {errors.map((e) => (
                <Card key={e.errorId} className="flex flex-col gap-2">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      size={18}
                      className="mt-0.5 shrink-0 text-amber-500"
                    />
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-ink-400">
                        {e.errorId} · {e.traceId}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-ink-900">
                        {e.workflowName}
                      </p>
                    </div>
                    {e.status && <StatusBadge status={e.status} tone="warning" />}
                  </div>
                  <p className="text-sm text-ink-600">{e.errorMessage}</p>
                  <p className="text-xs text-ink-500">
                    <span className="font-semibold uppercase">Fallback: </span>
                    {e.fallbackAction}
                  </p>
                  <p className="text-xs text-ink-400">
                    {e.errorType} · {e.nodeName} · {formatDate(e.createdAt)}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </DataBoundary>
      </Section>

      <Section title="Slack Alerts & Error_Log Handling">
        <Card>
          <div className="flex items-center gap-2 text-sm font-medium text-ink-900">
            <Bell size={16} className="text-brand-600" />
            {wm.slackChannel} · {wm.errorLogSheet}
          </div>
          <p className="mt-3 text-sm text-ink-600">{wm.explanation}</p>
        </Card>
      </Section>
    </div>
  );
}
