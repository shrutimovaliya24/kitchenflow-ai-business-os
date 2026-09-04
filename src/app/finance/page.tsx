"use client";

import { Wallet, Info } from "lucide-react";
import { portalConfig } from "@/config/portal.config";
import { DataBoundary } from "@/components/PortalDataProvider";
import {
  DASH,
  formatCount,
  formatCurrency,
  formatPercent,
} from "@/lib/portalData";
import {
  Card,
  ExternalLinkButton,
  KpiCard,
  PageHeader,
  Section,
} from "@/components/ui";
import {
  NetRevenueByCityChart,
  OrderValueVsRefundChart,
  PartnerPayoutByCityChart,
  PaymentStatusChart,
} from "@/components/FinanceCharts";

export default function FinancePage() {
  const fin = portalConfig.finance;
  const link = portalConfig.links.financeSheet;

  return (
    <div>
      <PageHeader
        title="Finance Dashboard"
        description="Order value, refunds, cancellations, partner payout and net revenue."
        icon={Wallet}
      />

      <div className="mb-6 flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">
        <Info size={16} className="mt-0.5 shrink-0" />
        <span>{fin.note}</span>
      </div>

      <Section title="Live Google Sheets Finance Dashboard">
        <Card className="flex flex-col gap-2">
          <ExternalLinkButton label={link.label} url={link.url} />
          <p className="text-xs text-ink-400">
            Opens the finance workbook in a new tab. This portal takes no
            automatic financial actions.
          </p>
        </Card>
      </Section>

      <DataBoundary select={(d) => d.finance}>
        {(f) => {
          const paymentTotal = f.paymentStatus.reduce(
            (sum, row) => (row.count === null ? sum : sum + row.count),
            0,
          );
          const hasPaymentCounts = f.paymentStatus.some((r) => r.count !== null);

          return (
            <>
              <Section title="Key Metrics">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <KpiCard
                    label="Total Orders"
                    value={formatCount(f.totalOrders)}
                    hint="From finance.total_orders"
                  />
                  <KpiCard label="Cancelled Orders" value={formatCount(f.cancelledOrders)} />
                  <KpiCard label="Cancellation Rate" value={formatPercent(f.cancellationRate)} />
                  <KpiCard label="Total Order Value" value={formatCurrency(f.totalOrderValue)} />
                  <KpiCard label="Total Refund Value" value={formatCurrency(f.totalRefundValue)} />
                  <KpiCard label="Refund Rate" value={formatPercent(f.refundRate)} />
                  <KpiCard label="Net Revenue" value={formatCurrency(f.netRevenue)} />
                  <KpiCard
                    label="Total Partner Payout"
                    value={formatCurrency(f.totalPartnerPayout)}
                  />
                </div>
              </Section>

              <Section title="Charts">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <NetRevenueByCityChart data={f.byCity} />
                  <PaymentStatusChart
                    data={f.paymentStatus}
                    note={
                      hasPaymentCounts
                        ? `${formatCount(paymentTotal)} payment-status records. ${fin.paymentStatusNote}`
                        : fin.paymentStatusNote
                    }
                  />
                  <OrderValueVsRefundChart data={f.byCity} />
                  <PartnerPayoutByCityChart data={f.byCity} />
                </div>
              </Section>

              <Section title="City Breakdown">
                <Card className="overflow-x-auto p-0">
                  <table className="w-full min-w-[40rem] text-sm">
                    <thead className="border-b border-ink-100 text-left text-xs uppercase text-ink-400">
                      <tr>
                        <th className="p-3">City</th>
                        <th className="p-3">Order Value</th>
                        <th className="p-3">Refund Value</th>
                        <th className="p-3">Partner Payout</th>
                        <th className="p-3">Net Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-100">
                      {f.byCity.length === 0 ? (
                        <tr>
                          <td className="p-3 text-ink-400" colSpan={5}>
                            No city rows returned.
                          </td>
                        </tr>
                      ) : (
                        f.byCity.map((c) => (
                          <tr key={c.city || DASH}>
                            <td className="p-3 text-ink-800">{c.city || DASH}</td>
                            <td className="p-3 text-ink-600">
                              {formatCurrency(c.orderValue)}
                            </td>
                            <td className="p-3 text-ink-600">
                              {formatCurrency(c.refundValue)}
                            </td>
                            <td className="p-3 text-ink-600">
                              {formatCurrency(c.partnerPayout)}
                            </td>
                            <td
                              className={`p-3 font-medium ${
                                (c.netRevenue ?? 0) < 0
                                  ? "text-rose-600"
                                  : "text-ink-800"
                              }`}
                            >
                              {formatCurrency(c.netRevenue)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </Card>
              </Section>
            </>
          );
        }}
      </DataBoundary>
    </div>
  );
}
