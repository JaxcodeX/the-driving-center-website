# The Driving Center SaaS — OPERATIONS MANUAL
## Agentic Business Blueprint v1.0

**Date:** 2026-04-22
**Inspired by:** Jack Roberts Protocol + Alex Finn Agentic Business Model + Dan Martell SaaS
**Architecture:** OpenClaw-first, no n8n, no manual orchestration
**Stack:** OpenClaw (MiniMax) + Codex/Kimi K2.6 (Ollama) + Supabase + Stripe + Twilio

---

## The Core Principle

**You are the CEO. You do not do the work. You approve the work.**

Every task that runs repeatedly = an agent. Every agent has one job. OpenClaw is the COO that never sleeps.

Jack Roberts says: agents are employees.
Alex Finn says: one agent = one company function.
Dan Martell says: one person can run a complete SaaS business with AI.

**This document:** Combines all three into one operational reality.

---

## The Agent Org Chart

```
CAYDEN WILSON (Founder / CEO)
│
└── OPENCLAW (Chief of Staff — MiniMax, always on)
    │
    ├── DAILY OPS AGENT (OpenClaw cron — every morning 7 AM)
    │   ├── Checks: payments, leads, support tickets, churn risk
    │   ├── Writes standup to OPERATIONS_LOG.md
    │   └── Flags anything that needs Cayden's attention
    │
    ├── PRODUCT AGENT (Kimi K2.6 — Ollama)
    │   └── Reads research → writes SPEC.md → hands to Coder
    │
    ├── CODER AGENT (Kimi K2.6 + Codex — Ollama)
    │   └── Builds per SPEC.md → commits to blast-phase-* branches
    │
    ├── MARKETING AGENT (OpenClaw subagent — MiniMax cloud)
    │   ├── Content Writer → blog posts, emails, outreach
    │   ├── SEO Researcher → finds leads, builds list
    │   └── Cold Outreach → sends emails, follows up
    │
    ├── SALES AGENT (OpenClaw subagent — MiniMax cloud)
    │   ├── Lead Qualifier → "Are they serious? Do they have budget?"
    │   └── Demo Scheduler → books calls, sends demo links
    │
    └── CS AGENT (OpenClaw subagent — MiniMax cloud)
        ├── Onboarding → welcomes new schools, sends guide
        ├── Follow-up → day 3, day 7, day 30 check-ins
        └── Renewal → 5 days before billing → retention message
```

---

## Role Definitions

### YOU (Founder / Conductor)
**What you do:**
- Approve the SPEC.md before any code is written
- Review OpenClaw's daily standup report each morning
- Make decisions that require human judgment (pricing changes, contract terms, partnership deals)
- Talk to real customers — the relationship stuff AI can't do
- Celebrate when things ship

**What you never do:**
- Write code yourself (that's what Kimi K2.6 is for)
- Send cold emails (that's the Marketing Agent)
- Follow up with leads manually (that's the Sales Agent)
- Check whether payments processed (that's the Ops Agent)

**Your only metrics:**
1. Number of paying schools
2. Monthly recurring revenue
3. Churn rate
4. Net promoter score

---

### OPENCLAW (Chief of Staff / COO)
**What it does:**
- Orchestrates all other agents
- Runs the daily standup loop
- Reads SPEC.md, spawns agents, reviews output
- Manages cron jobs (replaces n8n)
- Handles inbound Discord messages and triages
- Escalates only when a decision is needed

**How it runs:**
- Powered by MiniMax M2 (your $10/mo)
- Runs continuously in the background
- Spawns subagents for parallel tasks
- Writes daily standup to OPERATIONS_LOG.md
- Sends Cayden a morning summary

**It is NOT:**
- A chatbot — it's an autonomous operating system
- A code writer — that's the Coder Agent (Kimi K2.6)
- A marketing dept — that's the Marketing Agent (OpenClaw subagent)

---

### PRODUCT AGENT (Kimi K2.6 via Ollama)
**Trigger:** Research documents land in the project directory
**Input:** RESEARCH_TRACK_A_*.md files from OpenClaw's research agents
**Output:** SPEC.md — numbered tasks, ranked by revenue impact
**Session:** `sessions_spawn runtime=subagent model=kimi-k2.6`

**Loop:**
1. OpenClaw spawns Product Agent with research docs
2. Product Agent reads all research files
3. Product Agent writes SPEC.md with prioritized task list
4. OpenClaw reviews SPEC.md
5. If approved → spawns Coder Agent
6. If rejected → Product Agent revises

---

### CODER AGENT (Kimi K2.6 + Codex via Ollama)
**Trigger:** SPEC.md has unbuilt tasks
**Input:** SPEC.md + all existing source files
**Output:** Working code, committed to blast-phase-* branch
**Session:** `ollama launch codex --model kimi-k2.6:cloud`

**Loop:**
1. OpenClaw spawns Codex with SPEC.md
2. Codex reads SPEC.md and project files
3. Codex builds one file at a time, commits after each
4. OpenClaw reviews the git diff
5. If good → next task. If broken → Codex goes back and fixes.
6. When all tasks done → notify OpenClaw

**Rules for the Coder Agent:**
- Commit after every file, not one big commit at the end
- Write descriptive commit messages: "B.L.A.S.T. login: magic link auth flow"
- Never touch env files or secrets
- Keep it simple — no overengineering
- If unsure → ask OpenClaw, don't guess

---

### MARKETING AGENT (OpenClaw subagent — MiniMax cloud)
**Trigger:** Weekly cron every Monday 9 AM + on-demand
**Input:** Lead list + content calendar + competitor research
**Output:**
- 2 blog posts/month (driving school pain point content)
- 5 personalized cold emails/week to TN/KY/GA schools
- Updated lead list every Friday
- Demo page conversion report

**How it works:**
- OpenClaw spawns it Monday morning
- It reads the lead list (RESEARCH_TRACK_A_LEADS.md)
- It generates personalized outreach emails using the templates
- It updates the lead list with status (contacted / warm / cold / booked call)
- It writes a weekly marketing report

**For cold email — always personalize:**
```
Subject: Quick question about [School Name]

Hi [Owner Name],

I noticed [specific thing about their school — location, reviews, website].
I'm building The Driving Center SaaS — software that handles scheduling,
billing, and automated reminders for driving schools.

Curious if you're currently paying for any software for this?

[link to demo]

Thanks,
Cayden
```

---

### SALES AGENT (OpenClaw subagent — MiniMax cloud)
**Trigger:** New lead from inbound form OR marketing outreach response
**Response time:** Within 2 hours of new lead
**Output:**
- Lead scored 1-3 (Tier 1 = serious buyer, Tier 2 = interested, Tier 3 = window shopping)
- Personalized reply within 2 hours
- Demo link sent to Tier 1 leads
- Follow-up sequence active for 14 days

**Lead scoring rubric:**
| Signal | Score |
|---|---|
| Has 2+ instructors | +1 |
| Currently paying for software | +1 |
| Responded to cold email within 24h | +1 |
| Visited pricing page | +1 |
| Booked a demo call | = Tier 1 |

**Response templates (Sales Agent uses these, personalized):**

*Tier 1 — Book a demo:*
```
Subject: RE: [their message]

[Owner Name],

Yes — let's talk. I've got 15 minutes Thursday at 2 PM or Friday at 10 AM.

Here's a 2-minute walkthrough of what we'd build for [their use case]:
[link to loom demo]

Or just reply with what time works and I'll send a calendar link.

Cayden
```

*Tier 2 — Nurture:*
```
Subject: RE: [their message]

[Owner Name],

Thanks for getting back. A few quick questions:

1. How are you currently handling lesson bookings?
2. How many hours a week does admin work take you?
3. What software are you using right now, if any?

Happy to send a quick overview — just want to make sure it's actually relevant first.

Cayden
```

---

### CUSTOMER SUCCESS AGENT (OpenClaw subagent — MiniMax cloud)
**Trigger:** New Stripe payment (webhook fires → CS Agent activated)
**Output:** Timed onboarding sequence for each new school

**The sequence:**
| Day | Action | Channel |
|---|---|---|
| Day 0 | Welcome email + onboarding guide PDF | Email |
| Day 3 | "How's setup going? Need help with anything?" | Email |
| Day 7 | "Which feature are you using most? What needs to be easier?" | Email |
| Day 14 | "Have you connected your first student yet?" | Email |
| Day 30 | NPS: "What do you love? What frustrates you?" | Email |
| Day 60 | "What should we build next? You're our customer." | Email |
| 5 days before renewal | "Your subscription renews on [date]. Nothing changes unless you cancel." | Email |
| Day of renewal | Receipt + "Thanks for being a customer." | Email |

**Churn prevention triggers:**
- If CS Agent detects a school hasn't logged in for 14 days → early warning to OpenClaw
- OpenClaw escalates to Cayden: "School [name] inactive for 14 days — worth a personal check-in call?"

---

## Daily Loop — How the Business Runs

### Every Morning (7 AM — while you sleep) 🌅

```
OPENCLAW wakes up
├── OPS Agent checks:
│   ├── Did any new Stripe payments come in? → Update revenue tracker
│   ├── Did any payments fail? → Flag for CS Agent follow-up
│   ├── New inbound leads? → Spawn Sales Agent
│   ├── New support emails? → Triage and respond or escalate
│   └── Write standup to OPERATIONS_LOG.md
│
├── IF Monday → Spawn Marketing Agent (weekly campaign)
├── IF new leads → Spawn Sales Agent (within 2 hours)
└── IF any schools flagged churn-risk → Escalate to Cayden

OPENCLAW sends Cayden a morning message:
"Good morning Cayden. Here's your daily standup:
- Revenue: $[amount] this month | [n] schools paying
- New leads: [n] | Pending response: [n]
- Churn risk: [n] schools haven't logged in 14+ days
- Today's focus: [top 3 tasks]
- Nothing needs your attention right now."
```

### Every Evening (while you work 4-9 PM) 🌆

```
YOU open OPERATIONS_LOG.md
├── Review what OpenClaw built today
├── Check git commits from Coder Agent
├── Approve SPEC.md changes if needed
└── Start tomorrow's priorities

OPENCLAW running in background:
├── If you message OpenClaw → responds immediately
├── If Coder Agent commits → OpenClaw reviews and flags issues
└── If Sales Agent gets a response → OpenClaw notifies you with summary
```

### Every Week (Monday morning) 📅

```
OPENCLAW runs weekly review:
├── Marketing Agent: generates this week's content + outreach
├── Sales Agent: reviews all leads, scores them, sends follow-ups
├── CS Agent: reviews all active schools for churn risk
├── Product Agent: reviews backlog, updates SPEC.md priorities
└── Writes WEEKLY_REVIEW.md with metrics +下周 plan
```

---

## The Agentic Flywheel

This is the self-reinforcing loop that compounds over time:

```
MARKETING AGENT finds leads
    ↓
SALES AGENT converts leads to schools
    ↓
SCHOOL pays $99/mo (Stripe)
    ↓
CS AGENT keeps schools happy
    ↓
Schools refer other schools (word of mouth)
    ↓
MORE LEADS from existing schools
    ↓
More schools = more revenue = more to reinvest in agents
```

Every school that joins increases the odds of the next school joining (referrals). The flywheel gets faster every month.

---

## What Gets Built Next (Priority Order)

After Phase 1 (MVP core — auth, Stripe, dashboard):

| Phase | What | Agent | Why |
|---|---|---|---|
| **Phase 2** | Booking calendar | Coder Agent | Core product — schools can't sell without it |
| **Phase 2** | School admin panel | Coder Agent | School owner needs to see their own data |
| **Phase 3** | Twilio SMS reminders | CS Agent config | Automated 72h/24h reminders = fewer no-shows |
| **Phase 3** | Demo video (Loom) | Marketing Agent | Close sales faster — show before you sell |
| **Phase 4** | Multi-state support | Coder Agent | Expand to KY then GA |
| **Phase 4** | Instructor management | Coder Agent | Unlock medium-size school tier ($149/mo) |
| **Phase 5** | Referral program | CS Agent | Flywheel activation — schools refer schools |

---

## How to Launch a New Agent

**Rule: Never build without a SPEC. Never SPEC without research.**

The correct order:
1. OpenClaw research agent identifies a need
2. OpenClaw writes SPEC.md with the task
3. OpenClaw spawns Coder Agent to build it
4. OpenClaw reviews the output
5. If it works → merge to main. If not → back to step 3.

Example — launching the Marketing Agent:
```
OPENCLAW spawns marketing-agent subagent with task:
"Design and launch the cold outreach campaign for Phase 3 launch.

Use the lead list in RESEARCH_TRACK_A_LEADS.md.
Send 5 emails/week to Tier 1 schools.
Personalize each email using the school name and any public info about them.
Track responses in lead list.
Report back when done."

When agent finishes → OpenClaw reviews output → approves or revises
```

---

## The OPERATIONS_LOG.md

OpenClaw writes this every morning. It's the heartbeat of the business.

```markdown
# Operations Log — [DATE]

## Revenue
- MRR: $[amount] | Schools paying: [n] | Churned: [n]

## Pipeline
- Leads this week: [n] | Converted: [n] | Lost: [n]
- Pipeline value: $[estimated ARR if all closed]

## What We Built
- [SPEC.md task] → DONE / IN PROGRESS / BLOCKED
- [Git commit] → [description]

## What's Blocked
- [Issue] → [What's needed to fix it]

## Tomorrow
1. [ ] [Task]
2. [ ] [Task]
3. [ ] [Task]

## Cayden's Attention Needed
- [ ] [Decision to make with context]
```

---

## The One Rule That Runs Everything

**If it's repeatable, it's an agent's job. If it requires judgment, it's OpenClaw's job to escalate to you.**

Never let yourself fall into doing the repeatable work. That's a trap. The moment you catch yourself sending the same email twice → build an agent for it and hand it off.

---

## Files in the Project

```
the-driving-center-website/
├── SPEC.md                      ← Work order (Product Agent writes, you approve)
├── OPERATIONS_LOG.md           ← Daily standup (OpenClaw writes every morning)
├── WEEKLY_REVIEW.md            ← Every Monday (OpenClaw writes)
├── RESEARCH_TRACK_A_*.md       ← Research from OpenClaw agents
├── blast-phase-1/             ← Git branch for current build
└── src/                        ← Code (Coder Agent builds here)
```

---

## Key Contacts (Real Humans)

| Role | Name | Context |
|---|---|---|
| **Mentor — Technical** | Mark Martin | CS teacher, ORNL security analyst, Full Stack Open instructor |
| **Mentor — Industry** | Matt Reedy | Driving instructor, industry insider |
| **Customer archetype** | Oak Ridge Driving School | First call target |

---

## Success Metrics

| Goal | Timeline | What it looks like |
|---|---|---|
| First paying school | Month 3 | 1 school = $99/mo |
| 5 schools paying | Month 6 | $495/mo — proof the model works |
| 20 schools paying | Month 12 | $1,980/mo — replaces part-time job |
| 50 schools paying | Month 15 (18th birthday) | $4,950/mo — real business |

**By the time you're 18, you have a $60k ARR SaaS company that runs 24/7 while you sleep.**

---

*This document is Cayden Wilson's business blueprint. Agents execute. OpenClaw orchestrates. You approve.*
