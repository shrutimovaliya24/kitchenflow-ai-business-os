import { FlaskConical, ShieldAlert, CheckCircle2, Wrench, Info } from "lucide-react";
import { portalConfig, type TestCase, type TestStatus } from "@/config/portal.config";
import { Card, PageHeader, Section, StatusBadge } from "@/components/ui";

const statusLabel: Record<TestStatus, string> = {
  "executed-passed": "Executed · Passed",
  "executed-failed-fixed": "Executed · Failed → Fixed",
  planned: "Planned · Not executed",
};

const statusTone: Record<TestStatus, "success" | "warning" | "neutral"> = {
  "executed-passed": "success",
  "executed-failed-fixed": "warning",
  planned: "neutral",
};

function TestStatusBadge({ status }: { status: TestStatus }) {
  return <StatusBadge status={statusLabel[status]} tone={statusTone[status]} />;
}

function TestTable({ rows }: { rows: TestCase[] }) {
  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full min-w-[64rem] text-sm">
        <thead className="border-b border-ink-100 text-left text-xs uppercase text-ink-400">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Test</th>
            <th className="p-3">Expected result</th>
            <th className="p-3">Actual result</th>
            <th className="p-3">Status</th>
            <th className="p-3">Evidence</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {rows.map((r) => (
            <tr key={r.id} className={r.status === "planned" ? "bg-ink-50/60" : undefined}>
              <td className="p-3 font-mono text-xs text-ink-600">{r.id}</td>
              <td className="p-3 text-ink-800">{r.name}</td>
              <td className="p-3 text-ink-600">{r.expected}</td>
              <td className={`p-3 ${r.actual === "—" ? "text-ink-300" : "text-ink-800"}`}>
                {r.actual}
              </td>
              <td className="p-3">
                <TestStatusBadge status={r.status} />
              </td>
              <td className={`p-3 text-xs ${r.evidence === "—" ? "text-ink-300" : "text-ink-600"}`}>
                {r.evidence}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function ControlCard({
  title,
  description,
  status,
  evidence,
}: {
  title: string;
  description: string;
  status: TestStatus;
  evidence: string;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-brand-600" />
          <h4 className="font-semibold text-ink-900">{title}</h4>
        </div>
        <TestStatusBadge status={status} />
      </div>
      <p className="mt-2 text-sm text-ink-600">{description}</p>
      <p className="mt-2 text-xs text-ink-400">
        <span className="font-semibold uppercase">Evidence: </span>
        {evidence}
      </p>
    </Card>
  );
}

export default function TestingSafetyPage() {
  const ts = portalConfig.testingSafety;

  const allTests: TestCase[] = [
    ...ts.assistantTests.normal,
    ...ts.assistantTests.tricky,
    ...ts.agentTests.flatMap((a) => a.tests),
  ];
  const executed = allTests.filter((t) => t.status !== "planned").length;

  return (
    <div>
      <PageHeader
        title="Testing & Safety"
        description="Test cases for the support assistant and each agent, plus the safeguards that keep them in bounds."
        icon={FlaskConical}
      />

      <div className="mb-6 flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
        <Info size={16} className="mt-0.5 shrink-0" />
        <span>
          <strong>
            {executed} of {allTests.length} tests executed with recorded evidence.
          </strong>{" "}
          {ts.evidencePolicy}
        </span>
      </div>

      <Section title="Assistant Tests — Normal">
        <TestTable rows={ts.assistantTests.normal} />
      </Section>

      <Section title="Assistant Tests — Tricky">
        <TestTable rows={ts.assistantTests.tricky} />
      </Section>

      <Section title="Agent Tests" description="Two tests per agent.">
        <div className="space-y-4">
          {ts.agentTests.map((a) => (
            <div key={a.agent}>
              <h4 className="mb-2 text-sm font-semibold text-ink-900">{a.agent}</h4>
              <TestTable rows={a.tests} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Controls">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ControlCard
            title="Duplicate Prevention"
            description={ts.duplicatePrevention.description}
            status={ts.duplicatePrevention.status}
            evidence={ts.duplicatePrevention.evidence}
          />
          <ControlCard
            title="Execute Once"
            description={ts.executeOnce.description}
            status={ts.executeOnce.status}
            evidence={ts.executeOnce.evidence}
          />
          <ControlCard
            title="Context Memory"
            description={ts.contextMemory.description}
            status={ts.contextMemory.status}
            evidence={ts.contextMemory.evidence}
          />
          <Card>
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-rose-500" />
              <h4 className="font-semibold text-ink-900">Safety Rules</h4>
            </div>
            <p className="mt-2 text-sm text-ink-600">{ts.safetyRulesRef}</p>
          </Card>
        </div>
      </Section>

      <Section title="Errors & Fixes">
        <Card className="divide-y divide-ink-100 p-0">
          {ts.errorsAndFixes.map((e, i) => (
            <div key={i} className="flex gap-3 p-4">
              <Wrench size={16} className="mt-0.5 shrink-0 text-ink-400" />
              <div>
                <p className="text-sm font-medium text-ink-800">{e.error}</p>
                <p className="mt-0.5 text-sm text-ink-500">Fix: {e.fix}</p>
              </div>
            </div>
          ))}
        </Card>
      </Section>

      <Section title="Enforced Safety Rules">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {portalConfig.architecture.safetyRules.map((rule, i) => (
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
