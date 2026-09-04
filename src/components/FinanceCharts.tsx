"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FinanceCityRow, PaymentStatusRow } from "@/lib/portalData";
import { EmptyState } from "./ui";

const BRAND = ["#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63"];
const STATUS_COLORS: Record<string, string> = {
  Paid: "#06b6d4",
  Pending: "#38bdf8",
  Refunded: "#f59e0b",
  Failed: "#f43f5e",
  Unknown: "#94a3b8",
};

function ChartFrame({
  title,
  note,
  isEmpty,
  children,
}: {
  title: string;
  note?: string;
  isEmpty?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-4 lg:p-5">
      <h4 className="mb-1 text-sm font-semibold text-ink-900">{title}</h4>
      {note && <p className="mb-3 text-xs text-ink-400">{note}</p>}
      {isEmpty ? (
        <EmptyState
          title="No data returned"
          description="The API returned no rows for this chart."
        />
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {children as React.ReactElement}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export function NetRevenueByCityChart({ data }: { data: FinanceCityRow[] }) {
  const points = data
    .filter((d) => d.netRevenue !== null)
    .map((d) => ({ city: d.city, netRevenue: d.netRevenue as number }));

  return (
    <ChartFrame title="Net Revenue by City (₹)" isEmpty={points.length === 0}>
      <BarChart data={points} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="city" tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <Tooltip />
        <ReferenceLine y={0} stroke="#94a3b8" />
        <Bar dataKey="netRevenue" name="Net Revenue" radius={[4, 4, 0, 0]}>
          {points.map((d, i) => (
            <Cell key={i} fill={d.netRevenue < 0 ? "#f43f5e" : BRAND[i % BRAND.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartFrame>
  );
}

export function PaymentStatusChart({
  data,
  note,
}: {
  data: PaymentStatusRow[];
  note?: string;
}) {
  const points = data
    .filter((d) => d.count !== null)
    .map((d) => ({ name: d.status || "Unspecified", value: d.count as number }));

  return (
    <ChartFrame
      title="Payment Status Breakdown"
      note={note}
      isEmpty={points.length === 0}
    >
      <PieChart>
        <Pie
          data={points}
          dataKey="value"
          nameKey="name"
          innerRadius={50}
          outerRadius={85}
          paddingAngle={2}
          label
        >
          {points.map((d, i) => (
            <Cell key={i} fill={STATUS_COLORS[d.name] ?? BRAND[i % BRAND.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ChartFrame>
  );
}

export function OrderValueVsRefundChart({ data }: { data: FinanceCityRow[] }) {
  const points = data
    .filter((d) => d.orderValue !== null || d.refundValue !== null)
    .map((d) => ({
      city: d.city,
      orderValue: d.orderValue ?? 0,
      refundValue: d.refundValue ?? 0,
    }));

  return (
    <ChartFrame
      title="Order Value vs Refund Value by City (₹)"
      isEmpty={points.length === 0}
    >
      <BarChart data={points} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="city" tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <Tooltip />
        <Legend />
        <Bar dataKey="orderValue" name="Order Value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
        <Bar dataKey="refundValue" name="Refund Value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartFrame>
  );
}

export function PartnerPayoutByCityChart({ data }: { data: FinanceCityRow[] }) {
  const points = data
    .filter((d) => d.partnerPayout !== null)
    .map((d) => ({ city: d.city, partnerPayout: d.partnerPayout as number }));

  return (
    <ChartFrame title="Partner Payout by City (₹)" isEmpty={points.length === 0}>
      <BarChart data={points} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="city" tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
        <Tooltip />
        <Bar dataKey="partnerPayout" name="Partner Payout" radius={[4, 4, 0, 0]}>
          {points.map((_, i) => (
            <Cell key={i} fill={BRAND[i % BRAND.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartFrame>
  );
}
