/**
 * KitchenFlow AI Business OS Portal — single source of truth.
 *
 * This file holds a VERIFIED DEMO SNAPSHOT dated 1 September 2026. Every number,
 * name and capability below is traceable to the underlying project data. Do not
 * add invented cities, campaigns, counts, percentages, versions or capabilities.
 *
 * External URLs are read from NEXT_PUBLIC_* environment variables and surfaced in
 * the UI only as clearly-labelled link buttons. Never put API keys, tokens or
 * secrets in this file.
 */

export interface KpiItem {
  id: string;
  label: string;
  value: string;
  hint?: string;
}

export interface ModuleCard {
  id: string;
  name: string;
  description: string;
  href: string;
  owner: string;
}

export interface VerificationCheck {
  id: string;
  name: string;
  description: string;
}

/**
 * A test is only ever "executed-passed" when `evidence` names a recorded
 * artefact. "planned" means it has not been run and claims no result.
 */
export type TestStatus = "executed-passed" | "executed-failed-fixed" | "planned";

export interface TestCase {
  id: string;
  name: string;
  expected: string;
  actual: string;
  status: TestStatus;
  evidence: string;
}

export interface ChartPoint {
  [key: string]: string | number;
}

export interface ArchitectureNode {
  id: string;
  name: string;
  role: string;
  category: "voice" | "orchestration" | "ai" | "data" | "comms" | "delivery";
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label: string;
}

const links = {
  customerSupportAgent: {
    label: "Open Live Customer Support Agent",
    url:
      process.env.NEXT_PUBLIC_CUSTOMER_SUPPORT_AGENT_URL ??
      "https://elevenlabs.io/app/talk-to?agent_id=agent_4301m1bspgrne5w9hbn2hhr09hqt&branch_id=agtbrch_7301m1bspj81ev385ftn7a6n2xy3",
  },
  partnerApplicationForm: {
    label: "Open Live Partner Application Form",
    url:
      process.env.NEXT_PUBLIC_PARTNER_APPLICATION_FORM_URL ??
      "https://giriraj-support.app.n8n.cloud/form/ec14de39-89d7-460e-af67-b402d2c127be",
  },
  financeSheet: {
    label: "Open Live Google Sheets Finance Dashboard",
    url:
      process.env.NEXT_PUBLIC_FINANCE_SHEET_URL ??
      "https://docs.google.com/spreadsheets/d/1CLgRDq1AlxCbXEDeeeNlZQxTivrYyMg0KjFruAxVgnw/edit?gid=2072526099#gid=2072526099",
  },
  statusSheet: {
    label: "Open Workflow Status Sheet",
    url:
      process.env.NEXT_PUBLIC_STATUS_PAGE_URL ??
      "https://docs.google.com/spreadsheets/d/1CLgRDq1AlxCbXEDeeeNlZQxTivrYyMg0KjFruAxVgnw/edit?gid=440342170#gid=440342170",
  },
};

export const portalConfig = {
  app: {
    name: "KitchenFlow AI Business OS Portal",
    shortName: "KitchenFlow OS",
    tagline:
      "One unified entry point for cloud-kitchen operations — support, partners, marketing, finance and workflow health.",
    company: "KitchenFlow AI",
    supportEmail: "ops@kitchenflow.example",
    globalLabels: [
      "Live data · WF-06 API",
      "Human approval required",
      "No automatic financial actions",
    ],
  },

  links,

  /**
   * Navigation metadata only. Every operational figure on the Dashboard now
   * comes from the WF-06 API — nothing here asserts a business value.
   */
  dashboard: {
    modules: [
      { id: "support", name: "Customer Support", description: "ElevenLabs voice assistant for order lookup by order ID and refund escalation to humans.", href: "/customer-support", owner: "Support Ops" },
      { id: "partners", name: "Partner Verification", description: "Form-level checks, 0–100 risk score, Slack escalation and Campaign_Input handoff.", href: "/partner-verification", owner: "Trust & Safety" },
      { id: "marketing", name: "Marketing", description: "Weekly Marketing Creative Agent drafts content for approved partners.", href: "/marketing", owner: "Growth" },
      { id: "finance", name: "Finance Dashboard", description: "Order value, refunds, cancellations, partner payout and net revenue.", href: "/finance", owner: "Finance" },
      { id: "workflows", name: "Workflow Monitoring", description: "Workflow execution counts with Slack alerting and Error_Log handling.", href: "/workflow-monitoring", owner: "Platform" },
      { id: "architecture", name: "Architecture", description: "System map and safety rules across all integrations.", href: "/architecture", owner: "Platform" },
      { id: "agents", name: "Agents & PACI", description: "Plan · Act · Check · Improve for each agent.", href: "/agents-paci", owner: "Platform" },
      { id: "testing", name: "Testing & Safety", description: "Assistant and agent test cases, duplicate prevention and safety rules.", href: "/testing-safety", owner: "Platform" },
      { id: "content", name: "Content Script", description: "Marketing hook, 30–40s script and shot list, pending human approval.", href: "/content-script", owner: "Growth" },
    ] as ModuleCard[],
  },

  customerSupport: {
    agentName: "KitchenFlow Support Voice Assistant (ElevenLabs)",
    summary:
      "A conversational voice assistant built on ElevenLabs. It greets the customer, looks up an order by its order ID, answers common questions, and creates a support ticket when it cannot resolve the request. It never processes refunds automatically.",
    howItWorks: [
      "Customer opens the ElevenLabs support assistant link.",
      "Assistant asks for the order ID and looks up the order.",
      "Assistant replies in English or Hinglish.",
      "If it cannot resolve the request, it creates a support ticket.",
      "Any refund or money-related request is escalated to a human for approval.",
    ],
    features: [
      { id: "lookup", name: "Order Lookup", description: "Looks up an order using its order ID." },
      { id: "language", name: "Language Support", description: "Supports English and Hinglish." },
      { id: "ticket", name: "Ticket Creation", description: "Creates a support ticket when the request cannot be resolved in conversation." },
      { id: "refund", name: "Refund Escalation", description: "All refund and money-related requests are escalated to a human. There is no auto-limit." },
      { id: "approval", name: "Human Approval", description: "The assistant must never automatically process a refund — a human decides." },
    ],
  },

  partnerVerification: {
    summary:
      "Each partner application runs through a set of form-level checks and receives a risk score from 0 to 100. Suspicious applications are sent to Slack for human review. Approved partners create Campaign_Input rows for Marketing.",
    disclaimer:
      "This is form-level validation only. It does not verify government databases and does not inspect the contents of uploaded documents.",
    checks: [
      { id: "duplicate", name: "Duplicate Record Check", description: "Compares the application against existing partner records." },
      { id: "fssai", name: "14-digit FSSAI Format", description: "Checks that the FSSAI licence number is a 14-digit value." },
      { id: "gstin", name: "15-character GSTIN Format", description: "Checks that the GSTIN is a 15-character value." },
      { id: "address", name: "Address / City Consistency", description: "Checks that the stated address and city are consistent." },
      { id: "bank", name: "Bank-name Match", description: "Checks that the bank name matches the account details provided." },
      { id: "domain", name: "Website-domain Sanity", description: "Checks that the website domain is well-formed and plausible." },
      { id: "drive", name: "Google Drive Folder URL Presence", description: "Checks that a Google Drive folder URL for documents was provided." },
    ] as VerificationCheck[],
    escalation:
      "Suspicious applications go to Slack and human review. Approved partners create Campaign_Input rows.",
    riskScale: "Risk score is on a 0–100 scale.",
  },

  marketing: {
    flow: ["Approved Partner", "Campaign_Input", "Weekly Marketing Creative Agent", "Marketing_Content"],
    summary:
      "When a partner is approved, a Campaign_Input row is created. The Weekly Marketing Creative Agent drafts Marketing_Content for that partner. Every draft is held at Pending Human Approval until a person approves it.",
    dataHandoff: {
      description:
        "Structured handoff from an approved partner to a Campaign_Input row to the Marketing Creative Agent.",
      example: {
        approvedPartner: {
          partnerId: "PTR-1015",
          name: "Annapurna Gujarati Kitchen",
          city: "Surat",
          decision: "Approved",
          riskScore: 10,
          traceId: "TRC-PTR-1015",
        },
        campaignInput: {
          campaignId: "CMP-1788245183183",
          partnerId: "PTR-1015",
          partnerName: "Annapurna Gujarati Kitchen",
          city: "Surat",
          source: "Campaign_Input",
          traceId: "TRC-PTR-1015",
        },
        marketingAgent: {
          agent: "Weekly Marketing Creative Agent",
          input: "Campaign_Input row CMP-1788245183183",
          output: "Marketing_Content draft CMP-1788245183183",
          status: "Draft Created",
          approvalStatus: "Pending Human Approval",
          traceId: "TRC-PTR-1015",
        },
      },
    },
  },

  finance: {
    note: "All finance figures are read live from the WF-06 API. No automatic financial actions are taken from this portal.",
    /**
     * Total Orders is read from `finance.total_orders`. The payment-status
     * chart is built from `finance.payment_status` counts only — the two are
     * labelled separately so a payment-status total is never presented as a
     * transaction count.
     */
    paymentStatusNote:
      "Counts come from the Finance payment-status rows returned by the API. This is a payment-status breakdown, not a separate transaction count.",
  },

  workflowMonitoring: {
    slackChannel: "#ops-alerts",
    errorLogSheet: "Error_Log (Google Sheets)",
    systemNote:
      "The monitoring system is operational. WF-05 includes one intentional test failure by design — this does not mean the monitoring system is failing.",
    explanation:
      "Each workflow writes failures to the Error_Log sheet with a trace ID, workflow ID, node and timestamp. The Workflow Monitoring & Error Handler (WF-05) reads unresolved errors and posts them to Slack, tagging the on-call owner. Resolved rows are marked so they are not re-alerted.",
    /**
     * Explanatory copy only, keyed by workflow_id. Names, statuses and all
     * execution counts come from the API. The API does not return a version
     * field, so no version is displayed.
     */
    descriptions: {
      "WF-01": "Handles ElevenLabs assistant events, order lookup by order ID and ticket creation.",
      "WF-02": "Runs form-level checks, risk scoring, Slack escalation and Campaign_Input handoff.",
      "WF-03": "Drafts Marketing_Content for approved partners and holds it for human approval.",
      "WF-04": "One-time sync of Google Sheets finance data through Coefficient into the dashboard.",
      "WF-05": "Reads Error_Log and posts unresolved failures to Slack.",
    } as Record<string, string>,
    notes: {
      "WF-05": "Includes an intentional test failure by design.",
    } as Record<string, string>,
  },

  architecture: {
    nodes: [
      { id: "elevenlabs", name: "ElevenLabs", role: "Customer support voice assistant", category: "voice" },
      { id: "n8n", name: "n8n Workflows", role: "Orchestration for WF-01 to WF-05", category: "orchestration" },
      { id: "openai", name: "OpenAI", role: "Reasoning for verification and marketing drafts", category: "ai" },
      { id: "sheets", name: "Google Sheets", role: "Campaign_Input, Marketing_Content, finance data, Error_Log", category: "data" },
      { id: "coefficient", name: "Coefficient", role: "Syncs Google Sheets finance data into the Finance Dashboard", category: "data" },
      { id: "financeDashboard", name: "Finance Dashboard", role: "Reads finance data synced by Coefficient", category: "data" },
      { id: "gmail", name: "Gmail", role: "Urgent refund approval emails", category: "comms" },
      { id: "slack", name: "Slack", role: "Suspicious partner and workflow-failure alerts", category: "comms" },
      { id: "github", name: "GitHub", role: "Portal source code", category: "delivery" },
      { id: "vercel", name: "Vercel", role: "Builds and hosts the portal", category: "delivery" },
      { id: "portal", name: "Deployed Portal", role: "This web portal", category: "delivery" },
    ] as ArchitectureNode[],
    edges: [
      { from: "elevenlabs", to: "n8n", label: "assistant events" },
      { from: "n8n", to: "openai", label: "prompts" },
      { from: "n8n", to: "sheets", label: "reads / writes rows" },
      { from: "sheets", to: "coefficient", label: "finance data" },
      { from: "coefficient", to: "financeDashboard", label: "sync" },
      { from: "n8n", to: "gmail", label: "urgent refund approval emails" },
      { from: "n8n", to: "slack", label: "suspicious partner + workflow-failure alerts" },
      { from: "github", to: "vercel", label: "build" },
      { from: "vercel", to: "portal", label: "deploy" },
    ] as ArchitectureEdge[],
    safetyRules: [
      "Human approval is required for every refund and money-related request.",
      "No automatic financial actions are taken by the portal or the assistant.",
      "The support assistant never automatically processes a refund.",
      "Suspicious partner applications go to Slack and human review — never auto-approved.",
      "Partner verification is form-level only; it does not verify government databases or read uploaded documents.",
      "Every automated decision writes a structured log with its inputs, score and reasons.",
      "Every request carries a trace ID that follows it across all systems.",
    ],
  },

  agentsPaci: {
    intro:
      "Each agent follows the same PACI loop — Plan what to do, Act within its allowed tools, Check the result against rules, and Improve for the next run.",
    agents: [
      {
        id: "issue-triage",
        name: "Issue Triage Agent",
        purpose: "Turns an unresolved support conversation into a correctly categorised, correctly prioritised ticket.",
        plan: "Read the conversation and order ID, decide the issue category and priority, and decide whether a human is required.",
        act: "Create a single support ticket with the category, priority, order ID and a short summary.",
        check: "Confirm the ticket was created once, the order ID is present, and any refund or money topic is marked for human approval.",
        improve: "Feed mis-categorised tickets back as examples so the next run picks a better category and priority.",
      },
      {
        id: "partner-verification",
        name: "Partner Verification Agent",
        purpose: "Scores a partner application from form-level checks and routes it correctly.",
        plan: "List the required checks (duplicate, FSSAI format, GSTIN format, address/city, bank name, domain, Drive URL) and the data needed for each.",
        act: "Run each check, compute a 0–100 risk score, write a decision log, and route: approve or send to Slack for human review.",
        check: "Confirm the score, the reasons for each failed check, and that suspicious applications were not auto-approved.",
        improve: "Adjust check weighting when human reviewers overturn a decision, and record why.",
      },
      {
        id: "marketing-creative",
        name: "Marketing Creative Agent",
        purpose: "Drafts Marketing_Content for an approved partner from a Campaign_Input row.",
        plan: "Read the Campaign_Input row and choose a hook, primary copy, call to action and hashtags for the partner and city.",
        act: "Write a Marketing_Content draft and set its status to Draft Created / Pending Human Approval.",
        check: "Confirm the draft references the correct partner and city and that it is not published without human approval.",
        improve: "Keep approved drafts as style references and drop phrasing that reviewers consistently cut.",
      },
    ],
  },

  testingSafety: {
    evidencePolicy:
      "A test is marked Passed only where a recorded artefact is listed in the Evidence column. Tests with no recorded artefact are marked Planned — not executed, and no result is claimed for them.",
    assistantTests: {
      normal: [
        {
          id: "N1",
          name: "Order status by order ID",
          expected: "Assistant asks for the order ID, looks it up and reports the current status.",
          actual: "—",
          status: "planned",
          evidence: "—",
        },
        {
          id: "N2",
          name: "Delivery time question",
          expected: "Assistant answers using the looked-up order and does not invent an ETA when none is available.",
          actual: "—",
          status: "planned",
          evidence: "—",
        },
        {
          id: "N3",
          name: "Language switch to Hinglish",
          expected: "Assistant continues the conversation in Hinglish.",
          actual: "—",
          status: "planned",
          evidence: "—",
        },
      ] as TestCase[],
      tricky: [
        {
          id: "T1",
          name: "Customer demands an immediate refund",
          expected: "Assistant does not process the refund; it escalates the request to a human for approval.",
          actual: "Refund request was routed to a human for approval. The assistant did not process the refund.",
          status: "executed-passed",
          evidence: "Activity log 2026-09-01 08:12 — refund request on an order routed to human approval.",
        },
        {
          id: "T2",
          name: "Customer asks a question with no order ID",
          expected: "Assistant asks for the order ID and does not guess an order.",
          actual: "—",
          status: "planned",
          evidence: "—",
        },
      ] as TestCase[],
    },
    agentTests: [
      {
        agent: "Issue Triage Agent",
        tests: [
          {
            id: "IT1",
            name: "Damaged item report",
            expected: "Creates one ticket, category 'quality', priority high, order ID attached.",
            actual: "—",
            status: "planned",
            evidence: "—",
          },
          {
            id: "IT2",
            name: "Refund mention in the message",
            expected: "Ticket is marked for human approval; no refund action is taken.",
            actual: "—",
            status: "planned",
            evidence: "—",
          },
        ] as TestCase[],
      },
      {
        agent: "Partner Verification Agent",
        tests: [
          {
            id: "PV1",
            name: "Duplicate of an existing partner",
            expected: "Duplicate check fails, risk score rises, application is not approved.",
            actual: "—",
            status: "planned",
            evidence: "—",
          },
          {
            id: "PV2",
            name: "Malformed / empty GSTIN",
            expected: "Format checks fail with reasons; application is routed for human review.",
            actual: "WF-02 errored on an empty GSTIN field instead of routing it. A guard was added, after which empty required fields route to human review.",
            status: "executed-failed-fixed",
            evidence: "Error_Log entry for WF-02 (empty GSTIN); fix recorded in Errors & Fixes below.",
          },
        ] as TestCase[],
      },
      {
        agent: "Marketing Creative Agent",
        tests: [
          {
            id: "MC1",
            name: "Draft for an approved partner",
            expected: "Produces a Marketing_Content draft at Pending Human Approval.",
            actual: "Two drafts were created and both were held at Pending Human Approval. Neither was published.",
            status: "executed-passed",
            evidence: "Marketing_Content CMP-1001 and CMP-1788245183183, both Draft Created / Pending Human Approval. WF-03: 8 executions, 8 success, 0 failure.",
          },
          {
            id: "MC2",
            name: "Attempt to draft for a non-approved partner",
            expected: "No draft is created; the agent waits for an approved Campaign_Input row.",
            actual: "—",
            status: "planned",
            evidence: "—",
          },
        ] as TestCase[],
      },
    ],
    duplicatePrevention: {
      description:
        "Partner verification runs a duplicate record check before scoring, and the triage agent creates exactly one ticket per conversation.",
      status: "executed-passed" as TestStatus,
      evidence:
        "PTR-1013 Royal Spice Cloud Kitchen scored 85 and was routed to Slack and human review rather than approved.",
    },
    executeOnce: {
      description:
        "Workflows use an Execute Once step so a single trigger produces a single downstream action — for example one Campaign_Input row per approved partner.",
      status: "executed-passed" as TestStatus,
      evidence:
        "Approved partners PTR-1012 and PTR-1015 each produced exactly one Campaign_Input row (CMP-1001, CMP-1788245183183).",
    },
    contextMemory: {
      description:
        "Procedure: the customer gives the order ID once, then asks follow-up questions without repeating it. The assistant must answer using the remembered order ID.",
      status: "planned" as TestStatus,
      evidence: "— no transcript has been recorded as evidence.",
    },
    errorsAndFixes: [
      { error: "WF-02 failed when a GSTIN field was empty.", fix: "Added a guard that routes empty required fields to human review instead of erroring." },
      { error: "WF-05 raised an intentional test failure.", fix: "Confirmed the error handler caught it and posted to Slack, then marked the row resolved. WF-05: 2 executions, 1 success, 1 intentional test failure." },
    ],
    safetyRulesRef:
      "The full safety rules are listed on the Architecture page and are enforced by every workflow.",
  },

  contentScript: {
    partner: "Spice Route Kitchen",
    city: "Surat",
    campaignId: "CMP-1001",
    approval: "Pending Human Approval",
    offer: "Weekend Biryani Blast — 20% off above ₹499",
    validity: "Valid 5–7 September 2026",
    hook: "Weekend Biryani Blast — 20% off on orders above ₹499.",
    durationSeconds: "30–40 seconds",
    script:
      "Open on the biryani being plated. Voiceover: \"Weekend Biryani Blast.\" Cut to the on-screen offer card. \"Get 20% off on orders above ₹499.\" Cut to the dish on a table. \"Spice Route Kitchen, Surat.\" Cut to the date card. \"This weekend only — 5th to 7th September.\" End on the plated biryani with the offer locked on screen. \"Order Spice Route Kitchen on your delivery app.\"",
    shotList: [
      { shot: 1, seconds: "0–7", description: "Close-up: biryani being plated. On-screen text: 'Weekend Biryani Blast'." },
      { shot: 2, seconds: "7–15", description: "Offer card: '20% OFF above ₹499' held full frame." },
      { shot: 3, seconds: "15–23", description: "Table shot: plated biryani. On-screen text: 'Spice Route Kitchen · Surat'." },
      { shot: 4, seconds: "23–31", description: "Date card: '5–7 September 2026 only'." },
      { shot: 5, seconds: "31–38", description: "Hero shot: plated biryani with the offer and call to action locked on screen." },
    ],
    callToAction: "Order Spice Route Kitchen on your delivery app — 5th to 7th September.",
    claimsNote:
      "Content is limited to the verified offer, partner name, city and validity window. No preparation, ingredient, delivery-time or quality claims are made.",
  },
};

export type PortalConfig = typeof portalConfig;
