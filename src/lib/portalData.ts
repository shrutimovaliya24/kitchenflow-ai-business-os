/**
 * Typed data-fetching layer for the WF-06 dynamic data API.
 *
 * Design rules enforced here:
 *  - `cache: "no-store"` — never serve a stale snapshot.
 *  - The `success` field is validated before any data is trusted.
 *  - Network failures, non-2xx responses, invalid JSON and missing fields are
 *    all handled without throwing raw errors at the UI.
 *  - NO invented fallback business values. A missing or non-numeric figure
 *    normalises to `null`, and the UI renders it as "—" rather than 0.
 *  - Only whitelisted fields are read. Customer phone/email, bank details,
 *    Drive URLs and raw input_data are never mapped and so can never render.
 */

export const PORTAL_DATA_API_URL =
  process.env.NEXT_PUBLIC_PORTAL_DATA_API_URL ??
  "https://giriraj-support.app.n8n.cloud/webhook/kitchenflow-portal-data";

/* ------------------------------------------------------------------ */
/* Error                                                               */
/* ------------------------------------------------------------------ */

export class PortalDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PortalDataError";
  }
}

/* ------------------------------------------------------------------ */
/* Safe coercion                                                       */
/* ------------------------------------------------------------------ */

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** A number, or null when absent/non-numeric. Never invents a 0. */
function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const parsed = Number(v);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

/** A trimmed string, or "" when absent. */
function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function rows(v: unknown): Record<string, unknown>[] {
  return Array.isArray(v) ? v.filter(isRecord) : [];
}

/* ------------------------------------------------------------------ */
/* Normalised types                                                    */
/* ------------------------------------------------------------------ */

export interface DashboardMetrics {
  configuredWorkflows: number | null;
  activeAutomationWorkflows: number | null;
  supportTickets: number | null;
  partnerRecords: number | null;
  approvedPartnerDecisions: number | null;
  marketingCampaigns: number | null;
  netRevenue: number | null;
  openErrors: number | null;
}

export interface PartnerDecisionRow {
  partnerId: string;
  restaurantName: string;
  city: string;
  riskScore: number | null;
  riskLevel: string;
  /** Absent on incomplete records — never defaulted to "Approved". */
  decision: string;
  reviewerStatus: string;
  traceId: string;
  checkedAt: string;
  /** True when the row has no name and no decision — an incomplete record. */
  isIncomplete: boolean;
}

export interface MarketingCampaignRow {
  contentId: string;
  campaignId: string;
  traceId: string;
  restaurantName: string;
  platform: string;
  campaignGoal: string;
  contentType: string;
  headline: string;
  primaryCopy: string;
  callToAction: string;
  /** API returns a single space-separated string; split for rendering. */
  hashtags: string[];
  targetAudience: string;
  offer: string;
  approvalStatus: string;
  createdAt: string;
}

export interface FinanceCityRow {
  city: string;
  orderValue: number | null;
  refundValue: number | null;
  partnerPayout: number | null;
  netRevenue: number | null;
}

export interface PaymentStatusRow {
  status: string;
  count: number | null;
}

export interface FinanceMetrics {
  totalOrders: number | null;
  cancelledOrders: number | null;
  cancellationRate: number | null;
  totalOrderValue: number | null;
  totalRefundValue: number | null;
  refundRate: number | null;
  netRevenue: number | null;
  totalPartnerPayout: number | null;
  byCity: FinanceCityRow[];
  paymentStatus: PaymentStatusRow[];
}

export interface WorkflowRow {
  workflowId: string;
  workflowName: string;
  status: string;
  total: number | null;
  success: number | null;
  failure: number | null;
}

export interface OpenErrorRow {
  errorId: string;
  traceId: string;
  workflowName: string;
  nodeName: string;
  errorType: string;
  errorMessage: string;
  fallbackAction: string;
  status: string;
  createdAt: string;
}

export interface PortalData {
  generatedAt: string;
  source: string;
  dashboard: DashboardMetrics;
  partnerDecisions: PartnerDecisionRow[];
  marketingCampaigns: MarketingCampaignRow[];
  finance: FinanceMetrics;
  workflows: WorkflowRow[];
  openErrors: OpenErrorRow[];
}

/* ------------------------------------------------------------------ */
/* Normalisation                                                       */
/* ------------------------------------------------------------------ */

function normaliseDashboard(v: unknown): DashboardMetrics {
  const d = isRecord(v) ? v : {};
  return {
    configuredWorkflows: num(d.configured_workflows),
    activeAutomationWorkflows: num(d.active_automation_workflows),
    supportTickets: num(d.support_tickets),
    partnerRecords: num(d.partner_records),
    approvedPartnerDecisions: num(d.approved_partner_decisions),
    marketingCampaigns: num(d.marketing_campaigns),
    netRevenue: num(d.net_revenue),
    openErrors: num(d.open_errors),
  };
}

function normalisePartnerDecisions(v: unknown): PartnerDecisionRow[] {
  return rows(v).map((r) => {
    const restaurantName = str(r.restaurant_name);
    const decision = str(r.decision);
    return {
      partnerId: str(r.partner_id),
      restaurantName,
      city: str(r.city),
      riskScore: num(r.risk_score),
      riskLevel: str(r.risk_level),
      decision,
      reviewerStatus: str(r.reviewer_status),
      traceId: str(r.trace_id),
      checkedAt: str(r.checked_at),
      isIncomplete: restaurantName === "" && decision === "",
    };
  });
}

function normaliseCampaigns(v: unknown): MarketingCampaignRow[] {
  return rows(v).map((r) => ({
    contentId: str(r.content_id),
    campaignId: str(r.campaign_id),
    traceId: str(r.trace_id),
    restaurantName: str(r.restaurant_name),
    platform: str(r.platform),
    campaignGoal: str(r.campaign_goal),
    contentType: str(r.content_type),
    headline: str(r.headline),
    primaryCopy: str(r.primary_copy),
    callToAction: str(r.call_to_action),
    hashtags: str(r.hashtags).split(/\s+/).filter(Boolean),
    targetAudience: str(r.target_audience),
    offer: str(r.offer),
    approvalStatus: str(r.approval_status),
    createdAt: str(r.created_at),
  }));
}

function normaliseFinance(v: unknown): FinanceMetrics {
  const f = isRecord(v) ? v : {};
  return {
    totalOrders: num(f.total_orders),
    cancelledOrders: num(f.cancelled_orders),
    cancellationRate: num(f.cancellation_rate),
    totalOrderValue: num(f.total_order_value),
    totalRefundValue: num(f.total_refund_value),
    refundRate: num(f.refund_rate),
    netRevenue: num(f.net_revenue),
    totalPartnerPayout: num(f.total_partner_payout),
    byCity: rows(f.by_city).map((c) => ({
      city: str(c.city),
      orderValue: num(c.order_value),
      refundValue: num(c.refund_value),
      partnerPayout: num(c.partner_payout),
      netRevenue: num(c.net_revenue),
    })),
    paymentStatus: rows(f.payment_status).map((p) => ({
      status: str(p.status),
      count: num(p.count),
    })),
  };
}

function normaliseWorkflows(v: unknown): WorkflowRow[] {
  return rows(v).map((w) => ({
    workflowId: str(w.workflow_id),
    workflowName: str(w.workflow_name),
    status: str(w.status),
    total: num(w.total),
    success: num(w.success),
    failure: num(w.failure),
  }));
}

function normaliseOpenErrors(v: unknown): OpenErrorRow[] {
  return rows(v).map((e) => ({
    errorId: str(e.error_id),
    traceId: str(e.trace_id),
    workflowName: str(e.workflow_name),
    nodeName: str(e.node_name),
    errorType: str(e.error_type),
    errorMessage: str(e.error_message),
    fallbackAction: str(e.fallback_action),
    status: str(e.status),
    createdAt: str(e.created_at),
  }));
}

/* ------------------------------------------------------------------ */
/* Fetch                                                               */
/* ------------------------------------------------------------------ */

export async function fetchPortalData(signal?: AbortSignal): Promise<PortalData> {
  let response: Response;

  try {
    response = await fetch(PORTAL_DATA_API_URL, { cache: "no-store", signal });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") throw cause;
    throw new PortalDataError(
      "Could not reach the KitchenFlow data API. Check your network connection and try again.",
    );
  }

  if (!response.ok) {
    throw new PortalDataError(
      `The data API responded with HTTP ${response.status}. It may be paused or redeploying.`,
    );
  }

  let raw: unknown;
  try {
    raw = await response.json();
  } catch {
    throw new PortalDataError("The data API returned a response that is not valid JSON.");
  }

  if (!isRecord(raw)) {
    throw new PortalDataError("The data API returned an unexpected response shape.");
  }

  if (raw.success !== true) {
    throw new PortalDataError(
      "The data API reported success: false. No live data was applied.",
    );
  }

  return {
    generatedAt: str(raw.generated_at),
    source: str(raw.source),
    dashboard: normaliseDashboard(raw.dashboard),
    partnerDecisions: normalisePartnerDecisions(raw.partner_decisions),
    marketingCampaigns: normaliseCampaigns(raw.marketing_campaigns),
    finance: normaliseFinance(raw.finance),
    workflows: normaliseWorkflows(raw.workflows),
    openErrors: normaliseOpenErrors(raw.open_errors),
  };
}

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

/** Renders "—" for a missing value rather than inventing a zero. */
export const DASH = "—";

export function formatCount(v: number | null): string {
  return v === null ? DASH : v.toLocaleString("en-IN");
}

export function formatCurrency(v: number | null): string {
  if (v === null) return DASH;
  const fractionDigits = Number.isInteger(v) ? 0 : 2;
  return `₹${v.toLocaleString("en-IN", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

export function formatPercent(v: number | null): string {
  return v === null ? DASH : `${v}%`;
}

export function formatTimestamp(iso: string): string {
  if (!iso) return DASH;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** Date-only display for row timestamps that may be a bare date. */
export function formatDate(iso: string): string {
  if (!iso) return DASH;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-IN", { dateStyle: "medium" });
}
