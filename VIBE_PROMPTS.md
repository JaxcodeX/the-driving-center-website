# Vibe Coding Prompts for OpenClaw — The Driving Center SaaS

## Why These Work

Every high-output prompt has the same 5 components. Miss one and the AI guesses:

| Component | What it is |
|-----------|-----------|
| **Role** | Who the AI is before it starts |
| **Context** | Your codebase, stack, what already exists |
| **Task** | What to build |
| **Constraints** | What NOT to do |
| **Output format** | How to respond |

---

## 5 Techniques That Work With Any AI

### 1 — Context Layering
Stack project context, file structure, and constraints so AI knows exactly where it's working.

**Use when:** Starting a feature from scratch or working in a complex codebase.

### 2 — Stepwise
Break the task into numbered steps. AI executes each one sequentially.

**Use when:** Multi-part features — auth flows, payment flows, onboarding.

### 3 — Role Assignment
Tell AI who it is before it writes. Role shapes the vocabulary, priorities, and trade-offs.

**Use when:** Code review, architecture decisions, security audits.

### 4 — Constraint Anchoring
Explicit DONT's stop AI from adding unwanted changes or breaking existing code.

**Use when:** Refactors, performance fixes.

### 5 — Chain-of-Thought
Ask AI to reason through the problem before implementing.

**Use when:** Complex queries, architecture choices, edge cases.

---

## Copy-Paste Prompts for The Driving Center SaaS

All prompts below are tuned for your stack: **Next.js 15 + Supabase + Stripe + Tailwind v4**.

---

### PROMPT 1: Bootstrap Your SaaS

```
You are a senior full-stack developer. I'm building a multi-tenant SaaS for driving schools.

Stack: Next.js 15 (App Router) + Supabase + Stripe + Tailwind v4 + TypeScript.

Current state: fresh project, nothing built yet.

Task: Build the core MVP loop:
1. Auth: signup, login, logout with Supabase Auth (magic link or email/password)
2. Dashboard shell: sidebar nav, main content area, user menu
3. Landing page: Hero (headline + CTA), Features (3-column grid), Pricing (3 tiers: Starter $99/mo, Growth $199/mo, Enterprise $399/mo), FAQ accordion
4. Multi-tenancy: organizations table, memberships table with role (owner/admin/instructor)
5. Stripe Checkout wired to /api/create-checkout and webhook at /api/webhooks/stripe

CONSTRAINTS:
- Do NOT touch auth migration — use Supabase auth.users directly
- Do NOT use pages router — App Router only
- All routes protected with Supabase middleware unless public
- Output clean folder structure with README

Respond with: folder tree + implementation plan as numbered steps.
```

---

### PROMPT 2: Add Student Management + Booking

```
You are a senior full-stack developer. I'm building a SaaS for driving schools on:

Stack: Next.js 15 + Supabase + Stripe + Tailwind v4 + TypeScript.

Context: Auth and multi-tenancy already wired. Organizations + memberships tables exist.

Task: Build the student management flow:
1. /dashboard/students — table of students (name, email, phone, status, enrolled date)
2. CSV import at /dashboard/students/import — upload CSV, parse with Papa Parse, upsert to students table, show preview before confirming
3. /book — public booking page where students pick a time slot (calendar view), enter name/email/phone
4. 48h + 4h SMS reminders — Supabase Edge Function triggered by cron, calls Twilio API
5. TCA compliance tracking — students table has classroom_hours (decimal) and driving_hours (decimal). Certificate issued when both >= 6.

CONSTRAINTS:
- Do NOT hardcode Stripe keys — use env vars
- Do NOT expose student PII in client components — use server actions
- SMS sending is fire-and-forget — no blocking on delivery
- Booking slots show instructor availability ( instructors table + schedule table )

Output: numbered step plan + key files to modify.
```

---

### PROMPT 3: Supabase Schema for Driving Schools

```
You are a senior database architect. Design a Supabase PostgreSQL schema for a multi-tenant driving school SaaS.

Tables needed:
- organizations (id, name, slug, settings jsonb, created_at)
- memberships (user_id, organization_id, role enum: owner|admin|instructor, created_at)
- instructors (id, organization_id, name, email, phone, created_at)
- students (id, organization_id, instructor_id, name, email, phone, classroom_hours decimal, driving_hours decimal, status enum, created_at)
- bookings (id, student_id, instructor_id, datetime, duration_minutes, status enum: pending|confirmed|completed|no_show, created_at)
- subscriptions (id, organization_id, stripe_subscription_id, stripe_customer_id, plan enum, status, current_period_end, created_at)
- usage_events (id, organization_id, event_type, event_data jsonb, created_at)

Requirements:
- Primary keys: uuid v4
- Foreign keys with cascade deletes
- created_at/updated_at on every table (use triggers)
- Indexes on: organization_id (all tables), student_id (bookings), email (students), stripe_subscription_id (subscriptions)
- RLS enabled on all tables — org owners see their org only
- Use the expand-contract pattern for migrations

Output: raw SQL, migration-ready.
```

---

### PROMPT 4: Stripe Subscription Webhook

```
You are a senior Stripe + Next.js developer. Build the Stripe webhook handler for a multi-tenant SaaS.

Stack: Next.js 15 Route Handler + Supabase + Stripe SDK.

Task: Create /app/api/webhooks/stripe/route.ts

Handle these events:
1. checkout.session.completed → upsert organization subscription in Supabase, set status = active
2. customer.subscription.updated → update plan and status in subscriptions table
3. customer.subscription.deleted → set status = canceled
4. invoice.payment_failed → set subscription status = past_due, send email via Resend

CONSTRAINTS:
- ALWAYS verify webhook signature with STRIPE_WEBHOOK_SECRET
- Store processed event IDs in a separate processed_events table to prevent replay attacks
- Never expose Stripe keys in responses
- Always return 200 to Stripe immediately, process async

Output: full route handler code + SQL for the subscriptions table.
```

---

### PROMPT 5: Landing Page — Driving Schools

```
You are a senior UI developer. Build a landing page for a SaaS targeting driving schools.

Stack: Next.js 15 + Tailwind v4 + Framer Motion (if available).

Task: Single page at / (root) with these sections:
1. Hero — headline: "Run your driving school without the chaos", subheadline, CTA: "Start Free Trial", trust badge: "No credit card required"
2. Features — 3-column grid: "Automated SMS reminders", "Online booking & scheduling", "TCA compliance tracking"
3. How It Works — 3-step horizontal: (1) Import your students, (2) Set your schedule, (3) Get paid automatically
4. Pricing — 3 tiers: Starter $99/mo (up to 3 instructors, 50 students), Growth $199/mo (up to 8 instructors, 200 students), Enterprise $399/mo (unlimited, multi-location)
5. FAQ — accordion with 5 real questions (no-show rate, TCA compliance, SMS costs, data security, cancellation)
6. Footer — links, copyright

Style: clean, trustworthy, slightly blue/green accent. No dark mode default.
Responsive: mobile-first.

Output: component structure + key Tailwind classes per section.
```

---

### PROMPT 6: Code Review — Security

```
You are a senior security engineer. Review this codebase for a driving school SaaS.

Stack: Next.js 15 + Supabase + Stripe + TypeScript.

Check for:
- SQL injection (raw SQL in supabase calls)
- XSS (dangerouslySetInnerHTML, unsanitized user input)
- Broken auth (middleware gaps, missing auth checks on API routes)
- Exposed secrets (console.log of env vars, hardcoded keys)
- Stripe webhook replay attacks
- RLS policy gaps (org users seeing other orgs data)
- SMS sending abuse (no rate limiting on /api/sms)

For each issue: severity (critical/high/medium/low) + exact file + fix.

Output: table of findings.
```

---

### PROMPT 7: Fix AI Hallucinations / Refactor

```
You are a Next.js 15 expert. I'm getting [ERROR HERE — paste your error message].

Context: my project uses App Router, Supabase, Stripe. The error happens at [where it fails].

Task: Find the cause and fix it without adding 'use client' to root layout.

CONSTRAINTS:
- Do NOT rewrite large portions of the codebase
- Preserve existing functionality
- If the fix requires a structural change, propose it first before implementing

Output: root cause + fix.
```

---

## The Pattern: How to Adapt Any Prompt for OpenClaw

The prompts above work because they follow this pattern:

```
[Role] → [Stack] → [Current State] → [Task] → [Constraints] → [Output]
```

When you need something custom, just fill in this template and send it to me:

---

**Template:**
> "You are a [role]. I'm building a [app type] with [stack]. [Current state]. Task: [what to build]. Constraints: [what not to do]. Output: [what you want back]."

---

That's it. Any of these prompts, send them to me and I'll execute them against your codebase. The more specific the context, the better the output.
