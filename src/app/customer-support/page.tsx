import { Headphones, CheckCircle2 } from "lucide-react";
import { portalConfig } from "@/config/portal.config";
import {
  Card,
  ExternalLinkButton,
  PageHeader,
  Section,
} from "@/components/ui";

export default function CustomerSupportPage() {
  const cs = portalConfig.customerSupport;
  const link = portalConfig.links.customerSupportAgent;

  return (
    <div>
      <PageHeader
        title="Customer Support"
        description="ElevenLabs conversational voice agent for cloud-kitchen customers."
        icon={Headphones}
      />

      <Section title="Live Customer Support Agent">
        <Card className="flex flex-col gap-2">
          <ExternalLinkButton label={link.label} url={link.url} />
          <p className="text-xs text-ink-400">
            Opens the ElevenLabs support assistant in a new tab. All refund and
            money-related requests require human approval.
          </p>
        </Card>
      </Section>

      <Section title={cs.agentName}>
        <Card>
          <p className="text-sm text-ink-600">{cs.summary}</p>
          <ol className="mt-4 space-y-2">
            {cs.howItWorks.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink-700">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Card>
      </Section>

      <Section title="Features">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cs.features.map((f) => (
            <Card key={f.id}>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-brand-600" />
                <h4 className="font-semibold text-ink-900">{f.name}</h4>
              </div>
              <p className="mt-2 text-sm text-ink-500">{f.description}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
