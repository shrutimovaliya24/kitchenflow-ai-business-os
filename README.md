# KitchenFlow AI Business OS Portal

One unified entry point for a cloud-kitchen business operating system — connecting
customer support, partner verification, marketing automation, finance intelligence
and workflow monitoring.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**,
**Recharts** and **Lucide React**.

## Modules

| Route | Module | Highlights |
| --- | --- | --- |
| `/` | Dashboard | Business OS summary, 6 KPI cards, module status, recent activity |
| `/customer-support` | Customer Support | ElevenLabs voice agent explainer, live agent button, feature list |
| `/partner-verification` | Partner Verification | Live application form button, 6-stage pipeline, recent decisions |
| `/marketing` | Marketing | Campaign cards, generated content, Approved Partner → Content flow |
| `/finance` | Finance Dashboard | 4 KPI cards, 3 Recharts charts, live Google Sheets button |
| `/workflow-monitoring` | Workflow Monitoring | WF-01…WF-05 execution counts, Slack + Error_Log explainer |
| `/architecture` | Architecture | System map across all integrations + safety rules |
| `/agents-paci` | Agents & PACI | Plan · Act · Check · Improve for each agent + data handoff JSON |
| `/testing-safety` | Testing & Safety | Assistant + agent test cases, duplicate prevention, safety rules |
| `/content-script` | Content Script | Marketing hook, 30–40s script, shot list, CTA (pending approval) |

All figures on the Dashboard and Finance pages are a **verified demo snapshot dated
1 September 2026** — point-in-time values with no trend data.

## Local setup

Requires **Node.js 18.18+** (Node 20 LTS recommended).

```bash
npm install
cp .env.example .env.local   # then edit the URLs
npm run dev
```

Open http://localhost:3000.

## Environment variables

All variables are **public links** shown in the UI. They are optional — the portal
falls back to demo URLs in `src/config/portal.config.ts` when they are unset.

**Never put API keys, tokens or secrets in this project.**

| Variable | Used by |
| --- | --- |
| `NEXT_PUBLIC_CUSTOMER_SUPPORT_AGENT_URL` | Customer Support — live ElevenLabs agent button |
| `NEXT_PUBLIC_PARTNER_APPLICATION_FORM_URL` | Partner Verification — live application form button |
| `NEXT_PUBLIC_FINANCE_SHEET_URL` | Finance Dashboard — live Google Sheets button |
| `NEXT_PUBLIC_STATUS_PAGE_URL` | Workflow status sheet link |

Raw variable names and full URLs are never shown in the UI — only clearly
labelled external-link buttons.

## Configuration & sample data

Everything replaceable lives in a single file:

```
src/config/portal.config.ts
```

External URLs, KPI values, module list, campaigns, workflow records, chart data and
the architecture graph are all defined there. Swap the sample data for live API
calls without touching any component.

## Build

```bash
npm run build
npm run start   # serve the production build on :3000
```

```bash
npm run lint
```

## Deploy to Vercel

1. Push this repository to GitHub / GitLab / Bitbucket.
2. In Vercel, **Add New → Project** and import the repo. The framework preset is
   detected as **Next.js** — no build settings changes needed
   (`npm run build`, output handled automatically).
3. Under **Settings → Environment Variables**, add the `NEXT_PUBLIC_*` values from
   the table above for the Production (and optionally Preview) environments.
4. **Deploy.** Every push to the default branch ships to production; pull requests
   get preview URLs.

CLI alternative:

```bash
npm i -g vercel
vercel          # preview deploy
vercel --prod   # production deploy
```

## Project structure

```
src/
  app/
    layout.tsx            Root layout + AppShell
    page.tsx              Dashboard
    loading.tsx           Global loading state
    error.tsx             Global error boundary
    not-found.tsx         404
    customer-support/     Module pages …
    partner-verification/
    marketing/
    finance/
    workflow-monitoring/
    architecture/
  components/
    AppShell.tsx          Sidebar + top bar + responsive nav
    nav.ts                Navigation items
    ui.tsx                Reusable primitives (Card, KpiCard, StatusBadge,
                          ExternalLinkButton, GlobalLabels, SnapshotNote,
                          JsonBlock, Loading/Empty/Error states…)
    FinanceCharts.tsx     Recharts client components
  config/
    portal.config.ts      Single source of truth for URLs + sample data
```

## Troubleshooting

### Page renders as unstyled HTML (Windows + OneDrive)

This project sits inside a OneDrive-synced folder. OneDrive's **Files On-Demand**
dehydrates inactive files into cloud placeholders (NTFS reparse points). Node's
`fs.readlink()` fails on those with `EINVAL`, so any build or dev server that
touches a dehydrated file under `.next` or `node_modules` breaks with:

```
EINVAL: invalid argument, readlink '...\.next\package.json'
PageNotFoundError: Cannot find module for page: /_document
```

The build then stops partway and the server hands the browser HTML whose
stylesheet link points at a chunk it cannot read — **so the page renders with no
CSS even though Tailwind compiled perfectly.**

`scripts/ensure-build-dir.mjs` runs automatically via `predev` / `prebuild`. It
pins `.next` and `node_modules` as "always keep on this device" (`attrib +P -U`)
so OneDrive cannot dehydrate them. It is a no-op on non-Windows platforms, so
Vercel builds are unaffected.

If you still see an unstyled page:

1. **Stop any old dev server.** A server started before this fix stays broken and
   keeps serving 500s. Kill it and run `npm run dev` again.
2. Delete the build cache and rebuild: `rm -rf .next && npm run build`.
3. For a permanent fix, move the project out of OneDrive (e.g. `C:\dev\`), or
   right-click the project folder → **Always keep on this device**.

## Notes

- Responsive: sidebar collapses to a drawer under `lg`; grids reflow to single
  column on mobile.
- Theme: professional blue/cyan dashboard palette (`brand.*` + `ink.*` in
  `tailwind.config.ts`).
- Loading, empty and error states are provided as reusable components and wired
  into the App Router.
