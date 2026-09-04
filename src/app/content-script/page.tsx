import { Clapperboard, Quote, ShieldCheck } from "lucide-react";
import { portalConfig } from "@/config/portal.config";
import { Card, PageHeader, Section, StatusBadge } from "@/components/ui";

export default function ContentScriptPage() {
  const cs = portalConfig.contentScript;

  return (
    <div>
      <PageHeader
        title="Content Script"
        description={`Marketing hook and short-form video script for ${cs.partner} (${cs.city}) · ${cs.campaignId}`}
        icon={Clapperboard}
      />

      <div className="mb-6">
        <StatusBadge status={cs.approval} />
      </div>

      <Section title="Offer">
        <Card>
          <p className="text-base font-semibold text-ink-900">{cs.offer}</p>
          <p className="mt-1 text-sm text-ink-500">{cs.validity}</p>
        </Card>
      </Section>

      <Section title="Hook">
        <Card className="flex items-start gap-3">
          <Quote size={18} className="mt-0.5 shrink-0 text-brand-600" />
          <p className="text-lg font-medium text-ink-900">{cs.hook}</p>
        </Card>
      </Section>

      <Section title={`Script (${cs.durationSeconds})`}>
        <Card>
          <p className="text-sm leading-relaxed text-ink-700">{cs.script}</p>
        </Card>
      </Section>

      <Section title="Scene-by-scene Shot List">
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[36rem] text-sm">
            <thead className="border-b border-ink-100 text-left text-xs uppercase text-ink-400">
              <tr>
                <th className="p-3">Shot</th>
                <th className="p-3">Time</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {cs.shotList.map((s) => (
                <tr key={s.shot}>
                  <td className="p-3 font-mono text-xs text-ink-600">{s.shot}</td>
                  <td className="p-3 text-ink-600">{s.seconds}s</td>
                  <td className="p-3 text-ink-800">{s.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Section>

      <Section title="Call To Action">
        <Card>
          <p className="font-medium text-brand-700">{cs.callToAction}</p>
        </Card>
      </Section>

      <Section title="Claims Scope">
        <Card className="flex items-start gap-3">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand-600" />
          <p className="text-sm text-ink-600">{cs.claimsNote}</p>
        </Card>
      </Section>

      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
        This script is a draft and is held at <strong>Pending Human Approval</strong>.
        It is not published until a person approves it.
      </p>
    </div>
  );
}
