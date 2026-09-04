"use client";

import { ShieldCheck, Info, ArrowRight } from "lucide-react";
import { portalConfig } from "@/config/portal.config";
import { DataBoundary } from "@/components/PortalDataProvider";
import { DASH, formatDate } from "@/lib/portalData";
import {
  Card,
  ExternalLinkButton,
  PageHeader,
  Section,
  StatusBadge,
} from "@/components/ui";

export default function PartnerVerificationPage() {
  const pv = portalConfig.partnerVerification;
  const link = portalConfig.links.partnerApplicationForm;

  return (
    <div>
      <PageHeader
        title="Partner Verification"
        description={pv.summary}
        icon={ShieldCheck}
      />

      <Section title="Live Partner Application Form">
        <Card className="flex flex-col gap-2">
          <ExternalLinkButton label={link.label} url={link.url} />
          <p className="text-xs text-ink-400">Opens the application form in a new tab.</p>
        </Card>
      </Section>

      <Section title="Form-level Checks" description={pv.riskScale}>
        <div className="mb-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <Info size={16} className="mt-0.5 shrink-0" />
          <span>{pv.disclaimer}</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pv.checks.map((c, i) => (
            <Card key={c.id}>
              <span className="text-xs font-semibold text-ink-400">Check {i + 1}</span>
              <h4 className="mt-1 font-semibold text-ink-900">{c.name}</h4>
              <p className="mt-1 text-sm text-ink-500">{c.description}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Routing">
        <Card className="flex flex-wrap items-center gap-3 text-sm text-ink-700">
          <span className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 font-medium text-brand-800">
            Application scored 0–100
          </span>
          <ArrowRight size={16} className="text-ink-300" />
          <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-medium text-emerald-800">
            Approved → Campaign_Input row
          </span>
          <ArrowRight size={16} className="text-ink-300" />
          <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 font-medium text-amber-800">
            Suspicious → Slack + human review
          </span>
        </Card>
      </Section>

      <Section
        title="Partner Decisions"
        description="Live records from the KitchenFlow WF-06 data API."
      >
        <DataBoundary
          select={(d) => d.partnerDecisions}
          isEmpty={(rows) => rows.length === 0}
          emptyTitle="No partner decisions returned"
          emptyDescription="The API responded successfully but returned no partner records."
        >
          {(decisions) => (
            <Card className="overflow-x-auto p-0">
              <table className="w-full min-w-[48rem] text-sm">
                <thead className="border-b border-ink-100 text-left text-xs uppercase text-ink-400">
                  <tr>
                    <th className="p-3">Partner ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">City</th>
                    <th className="p-3">Decision</th>
                    <th className="p-3">Risk (0–100)</th>
                    <th className="p-3">Reviewer</th>
                    <th className="p-3">Trace ID</th>
                    <th className="p-3">Checked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {decisions.map((d) => (
                    <tr
                      key={d.partnerId}
                      className={d.isIncomplete ? "bg-ink-50/60" : undefined}
                    >
                      <td className="p-3 font-mono text-xs text-ink-600">
                        {d.partnerId || DASH}
                      </td>
                      <td
                        className={`p-3 ${d.restaurantName ? "text-ink-800" : "text-ink-300"}`}
                      >
                        {d.restaurantName || DASH}
                      </td>
                      <td className={`p-3 ${d.city ? "text-ink-600" : "text-ink-300"}`}>
                        {d.city || DASH}
                      </td>
                      <td className="p-3">
                        {d.decision ? (
                          <StatusBadge status={d.decision} />
                        ) : (
                          <StatusBadge status="No decision recorded" tone="neutral" />
                        )}
                      </td>
                      <td className="p-3 text-ink-600">
                        {d.isIncomplete || d.riskScore === null ? DASH : d.riskScore}
                      </td>
                      <td
                        className={`p-3 ${d.reviewerStatus ? "text-ink-600" : "text-ink-300"}`}
                      >
                        {d.reviewerStatus || DASH}
                      </td>
                      <td className="p-3 font-mono text-xs text-ink-500">
                        {d.traceId || DASH}
                      </td>
                      <td className="p-3 text-xs text-ink-500">
                        {formatDate(d.checkedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </DataBoundary>
        <p className="mt-2 text-xs text-ink-400">
          Greyed rows are incomplete records returned by the API with no
          restaurant name and no recorded decision. No decision or risk level is
          inferred for them.
        </p>
      </Section>
    </div>
  );
}
