import { Bot } from "lucide-react";
import { portalConfig } from "@/config/portal.config";
import { Card, JsonBlock, PageHeader, Section } from "@/components/ui";

const paciSteps = [
  { key: "plan", label: "Plan", tone: "bg-brand-50 text-brand-800 border-brand-200" },
  { key: "act", label: "Act", tone: "bg-indigo-50 text-indigo-800 border-indigo-200" },
  { key: "check", label: "Check", tone: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { key: "improve", label: "Improve", tone: "bg-amber-50 text-amber-800 border-amber-200" },
] as const;

export default function AgentsPaciPage() {
  const { intro, agents } = portalConfig.agentsPaci;

  return (
    <div>
      <PageHeader
        title="Agents & PACI"
        description={intro}
        icon={Bot}
      />

      <Section title="Agents">
        <div className="space-y-4">
          {agents.map((a) => (
            <Card key={a.id}>
              <h4 className="font-semibold text-ink-900">{a.name}</h4>
              <p className="mt-1 text-sm text-ink-500">{a.purpose}</p>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                {paciSteps.map((s) => (
                  <div key={s.key} className={`rounded-lg border p-3 ${s.tone}`}>
                    <p className="text-xs font-semibold uppercase tracking-wide">{s.label}</p>
                    <p className="mt-1 text-sm text-ink-700">{a[s.key]}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="Exact Data Handoff"
        description={portalConfig.marketing.dataHandoff.description}
      >
        <JsonBlock data={portalConfig.marketing.dataHandoff.example} />
      </Section>
    </div>
  );
}
