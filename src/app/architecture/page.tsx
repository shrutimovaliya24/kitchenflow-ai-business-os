import { Network, ShieldAlert, ArrowRight } from "lucide-react";
import { portalConfig } from "@/config/portal.config";
import { Card, PageHeader, Section } from "@/components/ui";

const categoryLabels: Record<string, string> = {
  voice: "Voice",
  orchestration: "Orchestration",
  ai: "AI",
  data: "Data",
  comms: "Communications",
  delivery: "Build & Delivery",
};

const categoryColor: Record<string, string> = {
  voice: "border-brand-300 bg-brand-50 text-brand-800",
  orchestration: "border-indigo-300 bg-indigo-50 text-indigo-800",
  ai: "border-violet-300 bg-violet-50 text-violet-800",
  data: "border-emerald-300 bg-emerald-50 text-emerald-800",
  comms: "border-amber-300 bg-amber-50 text-amber-800",
  delivery: "border-sky-300 bg-sky-50 text-sky-800",
};

export default function ArchitecturePage() {
  const arch = portalConfig.architecture;
  const categories = Object.keys(categoryLabels);
  const nameById = Object.fromEntries(arch.nodes.map((n) => [n.id, n.name]));

  return (
    <div>
      <PageHeader
        title="Architecture"
        description="How every system in the KitchenFlow Business OS connects — and the guardrails around it."
        icon={Network}
      />

      <Section title="System Map">
        <Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const nodes = arch.nodes.filter((n) => n.category === cat);
              if (nodes.length === 0) return null;
              return (
                <div key={cat} className="rounded-lg border border-ink-200 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
                    {categoryLabels[cat]}
                  </p>
                  <div className="space-y-2">
                    {nodes.map((n) => (
                      <div
                        key={n.id}
                        className={`rounded-lg border px-3 py-2 ${categoryColor[cat]}`}
                      >
                        <p className="text-sm font-semibold">{n.name}</p>
                        <p className="text-xs opacity-80">{n.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
              Data Flows
            </p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {arch.edges.map((e, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 rounded-lg bg-ink-50 px-3 py-2 text-sm text-ink-700"
                >
                  <span className="font-medium">{nameById[e.from] ?? e.from}</span>
                  <ArrowRight size={14} className="text-ink-400" />
                  <span className="font-medium">{nameById[e.to] ?? e.to}</span>
                  <span className="ml-auto text-xs text-ink-400">{e.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </Section>

      <Section title="Safety Rules" description="Non-negotiable guardrails enforced across all automations.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {arch.safetyRules.map((rule, i) => (
            <Card key={i} className="flex items-start gap-3">
              <ShieldAlert size={18} className="mt-0.5 shrink-0 text-rose-500" />
              <p className="text-sm text-ink-700">{rule}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
