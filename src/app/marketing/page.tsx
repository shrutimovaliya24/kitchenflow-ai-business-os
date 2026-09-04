"use client";

import { Megaphone, Hash } from "lucide-react";
import { portalConfig } from "@/config/portal.config";
import { DataBoundary } from "@/components/PortalDataProvider";
import { formatDate } from "@/lib/portalData";
import {
  Card,
  FlowSteps,
  JsonBlock,
  PageHeader,
  Section,
  StatusBadge,
} from "@/components/ui";

export default function MarketingPage() {
  const mk = portalConfig.marketing;

  return (
    <div>
      <PageHeader title="Marketing" description={mk.summary} icon={Megaphone} />

      <Section title="Content Flow">
        <Card>
          <FlowSteps steps={mk.flow} />
        </Card>
      </Section>

      <Section
        title="Campaigns"
        description="Marketing_Content records read live from the KitchenFlow WF-06 data API."
      >
        <DataBoundary
          select={(d) => d.marketingCampaigns}
          isEmpty={(rows) => rows.length === 0}
          emptyTitle="No campaigns returned"
          emptyDescription="The API responded successfully but returned no Marketing_Content records."
        >
          {(campaigns) => (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {campaigns.map((c) => (
                <Card key={c.contentId} className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-ink-900">
                        {c.restaurantName}
                      </h4>
                      <p className="text-xs text-ink-400">
                        {c.campaignId} · {c.platform} · {formatDate(c.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={c.approvalStatus} />
                  </div>

                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-xs font-semibold uppercase text-ink-400">
                        Headline
                      </dt>
                      <dd className="text-ink-800">{c.headline}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase text-ink-400">
                        Primary Copy
                      </dt>
                      <dd className="text-ink-600">{c.primaryCopy}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase text-ink-400">
                        Call To Action
                      </dt>
                      <dd className="font-medium text-brand-700">
                        {c.callToAction}
                      </dd>
                    </div>
                    {c.offer && (
                      <div>
                        <dt className="text-xs font-semibold uppercase text-ink-400">
                          Offer
                        </dt>
                        <dd className="text-ink-600">{c.offer}</dd>
                      </div>
                    )}
                    {c.campaignGoal && (
                      <div>
                        <dt className="text-xs font-semibold uppercase text-ink-400">
                          Campaign Goal
                        </dt>
                        <dd className="text-ink-600">{c.campaignGoal}</dd>
                      </div>
                    )}
                  </dl>

                  {c.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {c.hashtags.map((h) => (
                        <span key={h} className="pill bg-ink-100 text-ink-500">
                          <Hash size={11} />
                          {h.replace(/^#/, "")}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="font-mono text-[11px] text-ink-400">
                    {c.contentId} · {c.traceId}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </DataBoundary>
      </Section>

      <Section title="Exact Data Handoff" description={mk.dataHandoff.description}>
        <JsonBlock data={mk.dataHandoff.example} />
      </Section>
    </div>
  );
}
