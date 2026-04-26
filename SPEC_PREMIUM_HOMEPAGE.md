# SPEC.md — The Driving Center SaaS Homepage Redesign

## Source
- Designjoy.co analysis (subagent)
- ScaleWithTeddy.com analysis (subagent)
- Linear/Stripe design token research (subagent)
- Linear Homepage Clone: `github.com/gauravxshukla/Linear-Homepage`

---

## 1. Concept & Vision

A premium dark-theme SaaS landing page for Tennessee driving school operators. The product speaks for itself — the design gets out of the way. Every section breathes. Every element has purpose. The feeling: "this was built by people who know what they're doing." NOT: "this was AI-generated in one shot." The key is **restraint** — restraint on effects, restraint on color, restraint on motion.

**Design direction:** Deep dark — inspired by ScaleWithTeddy's layered darks + Linear's precision.

---

## 2. Design Tokens

### Colors
```
--bg-base:       #050505   (deepest background — near black, NOT flat #000)
--bg-surface:    #0D0D0D   (card backgrounds — elevated)
--bg-elevated:   #18181b   (inputs, elevated elements)
--border:        #1A1A1A   (1px subtle borders)
--border-light:  #27272a   (slightly lighter borders)

--text-primary:  #FFFFFF   (headings, key text)
--text-secondary: #94A3B8  (body text, subheadlines)
--text-muted:    #52525B   (labels, meta, placeholders)

--accent-cyan:    #38BDF8  (primary accent — sky blue)
--accent-purple: #818CF8  (gradient partner)
--accent-green:  #10B981  (success states, chart glow)
--accent-gradient: linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)
```

### Typography
```
Font: Inter (next/font/google — already installed)
Leading: 1.5–1.7 for body, ~1.0–1.1 for headlines
Tracking: -0.03em to -0.04em on large headlines (premium tight tracking)

Scale:
  Hero H1:    clamp(3rem, 6vw, 4.5rem)  — weight 700
  H2:         clamp(2rem, 4vw, 3rem)  — weight 700
  H3:         text-xl                  — weight 600
  Body:       text-base               — weight 400
  Small/meta: text-sm                 — weight 500, uppercase, tracking-widest
  Dashboard:  text-2xl font-bold       — weight 700
```

### Spacing
```
Section padding:  py-24 md:py-32  (generous — premium sites breathe)
Container:        max-w-6xl       (1160px — centered)
Content width:   max-w-2xl       (560px — for text-heavy sections like FAQ)
Card padding:    p-8 md:p-10
Grid gap:         gap-6           (24px)
```

### Border Radius
```
Cards:       rounded-2xl  (16px)
Buttons:    rounded-xl   (12px) — primary, full-width CTAs
Pill CTAs:  rounded-full — for inline pill buttons
Large cards: rounded-3xl (24px) — for hero or pricing cards
Inputs:     rounded-xl   (12px)
```

### Shadows
```
Card shadow:  0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3) — subtle, not heavy
Elevated:    0 4px 16px rgba(0,0,0,0.5)
Glow:        0 0 40px rgba(56,189,248,0.2) — for CTAs, accent glows
Dashboard:   0 0 60px rgba(56,189,248,0.08) — very subtle ambient
```

### Motion
```
Page load: fade-in only — opacity 0→1, 400ms ease-out
Scroll:   IntersectionObserver fade-up — translateY(16px)→0, opacity 0→1, 400ms
Stagger:  75ms between sibling elements
Hover:    transition-all duration-200 — border color, shadow depth
NO: framer-motion dependency — use vanilla JS IntersectionObserver
```

---

## 3. Layout & Structure

Full-width page. Content centered in `max-w-6xl`. Dark bg `#050505`. Each major section separated by ~120–160px vertical space.

**Section order:**
1. Nav (sticky, blurs on scroll)
2. Hero (split — left copy, right dashboard mockup)
3. Logo bar (social proof)
4. Features (3-col grid, no borders — just colored icon boxes)
5. How it works (3-step, numbered)
6. Pricing (3 tiers, single page)
7. FAQ (accordion, centered, narrow)
8. Footer CTA (banner)
9. Footer

---

## 4. Section Specifications

### 4a. NAV
- Logo left: DC icon (gradient) + "The Driving Center" wordmark
- Right: "Log in" (text link) + "Start free trial" (pill button, white bg, black text)
- Sticky: `position: sticky; top: 0; z-50`
- Background on scroll: `bg/80 backdrop-blur-xl` + `border-b border-[#1A1A1A]`
- No hamburger on desktop. Mobile: simple overlay menu

### 4b. HERO
**Split layout: 55% left copy / 45% right dashboard mockup**

LEFT:
- Eyebrow: pill badge — "Built for Tennessee driving schools" — cyan text, subtle bg
- H1: "The platform that runs your driving school." — two lines, gradient on "driving school"
- Sub: text-base text-[#94A3B8] max-w-md, one sentence
- CTAs: [Start free trial] (pill, white bg, black text) + [See how it works] (outlined, dark bg)
- Trust badges below CTAs: 3 small checkmark items

RIGHT:
- Browser chrome frame containing a dark dashboard mockup
- Dashboard shows: sidebar nav (Dashboard/Students/Sessions/Calendar), top bar (greeting + date), stat cards row (Active Students, Sessions Today, Pending TCA), recent sessions list with status badges
- Perspective tilt: `transform: perspective(1000px) rotateY(-4deg) rotateX(2deg)`
- Subtle radial glow behind the mockup card
- Floating badge: "Certificate issued — Jordan K."

### 4c. LOGO BAR
- "Trusted by driving schools across Tennessee" — centered, text-xs uppercase muted
- School names in a horizontal row, opacity 0.4, centered
- Border-top + border-bottom thin dividers
- Very narrow vertical padding (py-10)

### 4d. FEATURES
- Section header: centered, eyebrow label + H2
- 3-column grid, NO card borders — clean colored icon containers
- Each feature: icon (Lucide, cyan bg box) + title + description
- Icons: Calendar, Bell, Shield, Users, CreditCard, BarChart3
- NO hover animations — just static clean grid

### 4e. HOW IT WORKS
- 3 steps: "Import your students" → "Set instructor availability" → "Get paid automatically"
- Numbered 01 / 02 / 03 in large faded text behind the step
- 3 columns on desktop, stacked on mobile
- Light connector lines between steps (gradient, very subtle)
- Clean section header above

### 4f. PRICING
- 3 tiers: Starter $99 / Growth $199 (HIGHLIGHTED — dark card, cyan border) / Enterprise $399
- Highlighted card: `#0D0D0D` bg, cyan border `2px`, "Most popular" badge
- Feature checklist with CheckCircle icons
- Full-width CTA per tier
- Single column on mobile, 3-col on desktop

### 4g. FAQ
- `max-w-2xl` centered (narrow = premium)
- Accordion with chevron-down icon (Lucide)
- Questions: no-shows, TCA compliance, SMS costs, data security, cancellation
- Open state: smooth height reveal

### 4h. FOOTER CTA
- Full-width card, rounded-3xl
- Dark bg (`#0D0D0D`) with subtle cyan radial glow
- "Ready to run your school better?" + sub + CTA button
- No mesh, no particles — just clean glow

### 4i. FOOTER
- Logo left + copyright + links (Privacy, Terms)
- Minimal, dark, single row

---

## 5. Component Inventory

### NavBar
- Default: transparent bg
- Scrolled: `bg-[#050505]/80 backdrop-blur-xl border-b border-[#1A1A1A]`
- CTA: white pill button, black text — `bg-white text-black`

### Button — Primary (pill)
```
bg-white text-black rounded-full px-8 py-3.5 text-sm font-semibold
box-shadow: 0 0 20px rgba(56,189,248,0.15)
hover: bg-gray-100
```

### Button — Secondary (outlined)
```
bg-transparent text-white border border-[#27272a] rounded-xl px-8 py-3.5 text-sm font-medium
hover: border-[#52525b]
```

### Feature Card
```
// NO card border, NO card shadow — just bg tint + colored icon
bg-transparent
Icon container: w-11 h-11 rounded-xl flex items-center justify-center
bg: [color]15 (e.g. bg-cyan-500/15), border: 1px solid [color]30
Icon: w-5 h-5 style={{ color: [color] }}
```

### Dashboard Mockup Card
```
bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl overflow-hidden
Browser chrome: bg-[#18181b] flex items-center gap-1.5 px-4 py-3
Chrome dots: red/yellow/green 2.5px circles + address bar pill
```

### Pricing Tier Card (normal)
```
bg-[#0D0D0D] border border-[#1A1A1A] rounded-3xl p-10
```

### Pricing Tier Card (highlighted)
```
bg-[#0D0D0D] border-2 border-cyan-500/50 rounded-3xl p-10
box-shadow: 0 0 60px rgba(56,189,248,0.12)
```

### FAQ Item
```
bg-transparent border-b border-[#1A1A1A]
Question: flex justify-between items-center py-4 px-6 text-sm font-medium text-white
Answer: px-6 pb-4 text-sm text-[#94A3B8]
Chevron: w-4 h-4 text-[#52525B] transition-transform duration-200 (rotate-180 when open)
```

---

## 6. Animations (Vanilla JS — No Framer Motion)

### IntersectionObserver Hook
```javascript
// useScrollReveal — fires once on entry
const observer = new IntersectionObserver(
  ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); observer.disconnect(); } },
  { threshold: 0.1 }
);
// CSS: .revealed { opacity: 1; transform: translateY(0); }
// Start: opacity: 0; transform: translateY(16px); transition: 400ms ease-out;
```

### Stagger on siblings
```javascript
// Add data-delay="0", data-delay="1", data-delay="2" to children
// CSS: [data-delay="0"] { transition-delay: 0ms } ...
```

---

## 7. Anti-Patterns (Never Do These)

| Wrong | Right |
|---|---|
| max-w-sm on content | max-w-2xl centered, or grid layout |
| py-12 section padding | py-24 md:py-32 minimum |
| rounded-lg on cards | rounded-2xl minimum |
| `bg-black` body | `bg-[#050505]` layered dark |
| Vivid cyan/blue as full bg | Use as accent only, muted tones elsewhere |
| Emojis as icons | Lucide React SVG icons only |
| Framer Motion dependency | Vanilla JS IntersectionObserver |
| "Make it look premium" prompt | Exact design tokens with hex values |
| Gradient bg on entire section | Flat bg, gradient on cards only |
| Hover scale + shadow on everything | Subtle border color change only |
| Glassmorphism | Dark solid cards only |
| Full-width hero layout | 55/45 split with product mockup right |

---

## 8. Stack Notes

- Next.js 15 App Router
- Tailwind CSS v4 (no custom config file — use inline style tokens)
- TypeScript
- Inter font via `next/font/google`
- Lucide React icons (already installed)
- No Framer Motion — vanilla JS for animations
- No external animation libraries

---

## 9. File to Produce

Single file: `src/app/page.tsx`

Structure:
```
'use client'
import { Inter } from 'next/font/google'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { LucideIcons } from 'lucide-react'
import { ...icons } from 'lucide-react'

// ── Scroll Reveal Hook ────────────────────────────
// ── Design Tokens (constants) ───────────────────
// ── Dashboard Mockup Component ──────────────────
// ── Nav, Hero, LogoBar, Features, HowItWorks, Pricing, FAQ, FooterCTA, Footer ──
// ── HomePage Default Export ──────────────────────
```

Build the full page in one clean file. No separate component files.
