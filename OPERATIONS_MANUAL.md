# OPERATIONS MANUAL — The Driving Center SaaS
**Version:** 2.0 (Refined)
**Date:** 2026-04-22
**Stack:** OpenClaw + Kimi K2.6 (Ollama) + Supabase + Stripe + Twilio + Resend
**Inspired by:** Jack Roberts B.L.A.S.T. + Alex Finn Agentic Business Model + Dan Martell SaaS

---

## The Core Principle

**You are the CEO. I am the operator that never sleeps.**

Every repeatable task = an agent. Every agent has one job. OpenClaw is the operating system that runs 24/7.

Jack Roberts says: agents are employees.
Alex Finn says: one agent = one company function.
Dan Martell says: one person can run a complete SaaS business with AI.

**What this means for you:** You approve strategy. I execute. You talk to customers. I handle everything else.

---

## What Actually Works Here (Honest Assessment)

After a full day building with this framework:

**What works:**
- Agent org chart — clear roles, clear responsibilities
- Flywheel — mental model that compounds
- CEO/conductor mindset — you decide, I build
- Daily standup loop — keeps the business alive between sessions
- Discovery questions for *new projects* — prevents wasted work

**What doesn't work here:**
- Spawning coding agents for every task — Codex/Kimi startup issues mean I build directly 80% of the time
- Formal task_plan/findings/progress files per session — duplicates OPERATIONS_LOG
- Discovery questions for every feature — overkill, slows down fixes

**The real model:**
- I (Everest) handle 80% of building directly
- Kimi K2.6 via Ollama handles complex features when needed
- OpenClaw subagents handle marketing, sales, CS outreach
- You (Cayden) approve the SPEC and talk to customers

---

## The Agent Org Chart

```
CAYDEN WILSON (Founder / CEO)
│
└── EVEREST / OPENCLAW (Chief of Staff — MiniMax, always on)
    │
    ├── OPS AGENT (OpenClaw cron — every morning)
    │   ├── Checks: payments, leads, churn risk
    │   ├── Writes standup to OPERATIONS_LOG.md
    │   └── Flags only what needs Cayden's attention
    │
    ├── CODER (Everest — direct build)
    │   └── Reads SPEC.md → builds → commits → tests
    │   └── Kimi K2.6 (Ollama) for complex features only
    │
    ├── PRODUCT (Everest — reads research + writes SPEC)
    │   └── Discovery questions → SPEC.md → Approved → Build
    │
    ├── MARKETING (OpenClaw subagent — outbound)
    │   ├── Cold outreach to TN/KY/GA schools
    │   ├── Content: blog, email templates
    │   └── Updates lead list with status
    │
    ├── SALES (OpenClaw subagent — lead response)
    │   ├── Responds within 2 hours of inbound
    │   ├── Scores leads 1-3
    │   └── Sends demo video or nurture sequence
    │
    └── CS AGENT (OpenClaw subagent — retention)
        ├── Day 0: Welcome email + guide
        ├── Day 3/7/14/30: Check-in sequence
        ├── Day before renewal: Retention message
        └── Churn预警: 14 days inactive → escalate to Cayden
```

---

## Your Role (Founder / CEO)

**What you do:**
- Approve SPEC.md before any major feature is built
- Review OPERATIONS_LOG every morning
- Make decisions that need human judgment (pricing, contracts, partnerships)
- Talk to real customers — the relationship work AI can't do
- Celebrate when things ship

**What you never do:**
- Write code yourself
- Send cold outreach emails
- Manually follow up with leads
- Check whether payments processed (I do this)

**Your only 4 metrics:**
1. Number of paying schools
2. Monthly recurring revenue (MRR)
3. Churn rate
4. Lead response time

---

## My Role (Everest / OpenClaw)

**What I do:**
- Execute the daily ops loop every morning
- Read research → write SPEC.md → build → test → commit
- Spawn subagents for marketing, sales, CS tasks
- Manage cron jobs (replaces what n8n used to do)
- Handle inbound Discord messages, triage, respond
- Escalate only when a real decision is needed

**How I run:**
- MiniMax M2 model, runs continuously
- Spawns subagents for parallel work
- Writes every session to OPERATIONS_LOG.md
- Reads PROJECT_CONSTITUTION.md at the start of every session

**I am NOT:**
- A chatbot — I'm an autonomous operator
- A rubber stamp — I push back when something is a bad idea
- A magic wand — I need real credentials (Supabase, Stripe) to make things work

---

## The Flywheel (How We Compound)

```
MARKETING finds leads
    ↓
SALES converts leads to schools
    ↓
SCHOOL pays $99/mo
    ↓
CS keeps schools happy
    ↓
Schools refer other schools
    ↓
MORE LEADS (cheaper, faster)
    ↓
More schools = more revenue = more to reinvest
```

Every new school increases the probability of the next one (referrals). The wheel gets faster every month.

---

## The Discovery Questions (For New Projects Only)

Before starting anything new — a new feature, a new integration, a new page:

1. **North Star** — What does success look like in one sentence?
2. **Integrations** — What external services are involved? Are keys ready?
3. **Source of Truth** — Where does the data live?
4. **Delivery Payload** — Where does the result end up?
5. **What it must NOT do** — The non-negotiables (leak data, allow cross-tenant access, accept invalid input)

---

## The Daily Loop

### Every Morning (OpenClaw runs automatically)
```
OPS AGENT wakes up:
├── Stripe: any new payments? → update MRR tracker
├── Stripe: any failed payments? → flag for CS follow-up
├── Leads: any new inbound? → spawn Sales Agent within 2h
├── Support: any flagged emails?
└── Write standup to OPERATIONS_LOG.md

IF Monday → spawn Marketing Agent (weekly campaign)
IF new lead → spawn Sales Agent
IF churn risk → flag for Cayden
```

### Your Morning (4-5 PM after school)
```
YOU open OPERATIONS_LOG.md
├── Read what was built today
├── Check git commits
├── Review anything flagged
├── Approve SPEC.md changes
└── Tell me what to prioritize tomorrow
```

### Your Evening Window (5-9 PM — deep work)
```
I run in background:
├── If you message me → I respond immediately
├── If build finishes → I commit and notify you
├── If Sales Agent gets a response → I notify you
└── If a lead goes cold → I flag it
```

### Every Week (Monday morning)
```
WEEKLY REVIEW (I write this):
├── Marketing: outreach sent, responses received, pipeline updated
├── Sales: leads scored, demos booked, closes expected
├── CS: active schools reviewed, churn risk flagged
├── Product: what's shipping this week
└── Metrics: MRR, schools, pipeline, churn
```

---

## How We Build (B.L.A.S.T. Applied)

**For every feature or fix:**

```
B — Blueprint
  → SPEC.md entry written
  → PII fields identified
  → External services identified
  → Test case defined before code

L — Link
  → Env vars verified present
  → SQL migrations ready
  → External services accessible

A — Architect
  → Auth check (getUser())
  → Ownership check (school_id)
  → Input validation
  → Audit log on writes
  → npm run build → must pass

S — Stylize
  → UI updated if changed
  → Error states + loading states
  → Mobile check

T — Trigger
  → git commit (descriptive message)
  → Push to remote
  → New env vars documented
  → New cron job set up if needed
```

---

## What Gets Built Next (Current Priority Order)

| Priority | What | Why | Status |
|---|---|---|---|
| P0 | Fill .env.local with real credentials | Everything is blocked on this | Waiting on Cayden |
| P0 | Run SQL migrations 001, 002, 003 | Database schema not live yet | Waiting on Cayden |
| P1 | Test full checkout flow end-to-end | Verify the whole chain works | Blocked on P0 |
| P1 | Record demo video (Loom) | Need this to close first customers | After P1 |
| P2 | Start outreach to 5 schools | First revenue | After P1 |
| P2 | Set up OpenClaw cron for reminders | /api/reminders fires every hour | After P1 |
| P3 | Booking calendar polish | Already built, needs real data | After P2 |
| P3 | Email sequences (Resend) | CS onboarding automation | After P2 |
| P4 | Referral program | Flywheel activation | Future |

---

## Security Rules (Non-Negotiable)

Every endpoint must pass this before commit:
- [ ] `getUser()` called — not `getSession()`
- [ ] `school_id` ownership verified on every PUT/DELETE
- [ ] PII encrypted at write, stripped at read
- [ ] Input validated (DOB age, email format, phone format)
- [ ] Audit log on every POST/PUT/DELETE
- [ ] No secrets in `NEXT_PUBLIC_` namespace

PII never in responses: `dob`, `permit_number`, `legal_name` (returns `[encrypted]`), `emergency_contact_phone`

---

## Key Contacts

| Role | Name | Notes |
|---|---|---|
| Technical mentor | Mark Martin | CS teacher, ORNL security, Full Stack Open |
| Industry mentor | Matt Reedy | Driving instructor |
| First call target | Oak Ridge Driving School | First outreach candidate |

---

## Success Targets

| Target | Timeline | What it means |
|---|---|---|
| First paying school | Month 3 | Proof the product works |
| 5 schools paying | Month 6 | $495/mo — model validated |
| 20 schools paying | Month 12 | $1,980/mo — real part-time income |
| 50 schools paying | Month 15 (18th birthday) | $4,950/mo — $60k ARR business |

**By your 18th birthday: a $60k ARR SaaS that runs 24/7.**

---

## Files in the Project

```
the-driving-center-website/
├── PROJECT_CONSTITUTION.md   ← The law: our protocol, security rules, stack
├── DISCOVERIES.md           ← What we know: constraints, lessons, findings
├── PROGRESS.md              ← Session log: built, errors, fixes
├── OPERATIONS_LOG.md        ← Daily standup: revenue, pipeline, blockers
├── SPEC.md                  ← Current phase work orders
├── SPEC_PHASE_3.md         ← Phase 3 work order
├── SECURITY_TESTING_PLAN.md ← Pre-launch security checklist
├── RESEARCH_TRACK_A_*.md   ← Research files from OpenClaw agents
└── src/
    ├── app/                 ← All pages + API routes
    ├── lib/
    │   ├── security.ts      ← Encryption, validation, audit helpers
    │   ├── email.ts         ← Resend client (stub mode)
    │   ├── twilio.ts        ← Twilio client (stub mode)
    │   └── migrations/      ← SQL to run in Supabase SQL Editor
    └── components/
```

---

*This document is the business blueprint. I execute. I escalate. You decide.*
