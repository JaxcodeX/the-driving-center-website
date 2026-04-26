# SEO + AEO Audit — The Driving Center
**Site:** the-driving-center-website.vercel.app
**Date:** 2026-04-25
**Done by:** Everest (automated audit)

---

## Quick Score

| Area | Status |
|------|--------|
| Title tag | ✅ Good |
| Meta description | ✅ Good |
| H1 on homepage | ✅ Present |
| Robots.txt | ✅ Allows all |
| Sitemap | ✅ Present |
| AI bot access (GPTBot, ClaudeBot, etc.) | ⚠️ No explicit rules |
| FAQPage schema | ❌ Missing |
| Organization schema | ❌ Missing |
| llms.txt | ❌ Missing |
| Twitter card | ✅ Good |
| Open Graph | ✅ Good |
| Canonical URL | ✅ Good |

---

## Traditional SEO Findings

**What's good:**
- Title: "The Driving Center SaaS — Booking, Reminders & Compliance for Driving Schools" — clear, keyword-rich
- Meta description: specific, includes price ($99/month), features listed
- All key pages have proper meta tags (pricing, FAQ, legal)
- `robots.txt` allows all crawlers including Googlebot
- Canonical URL correctly set to https://the-driving-center-website.vercel.app
- Open Graph + Twitter Card fully configured
- SSR (Server-Side Rendered) — all content in HTML source ✅

**Missing:**
- `llms.txt` — AI visibility file (critical for Perplexity/ChatGPT citations)
- FAQPage schema markup — FAQ section not marked up (high-value for AI citations)
- Organization schema on homepage — helps Google understand your business entity
- robots.txt doesn't explicitly allow AI crawlers (GPTBot, ClaudeBot, PerplexityBot)

---

## AI Search (AEO) Findings

### AI Crawler Access
No explicit rules in robots.txt. Add this to your `robots.txt`:

```
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: GoogleOther
Allow: /
```

### llms.txt — Missing ❌
This is the BIGGEST gap. `llms.txt` is a machine-readable file that tells AI tools (ChatGPT, Perplexity, Gemini) what your site contains so they can cite it in answers.

**Your competitors almost certainly don't have this yet.**

### FAQPage Schema — Missing ❌
Your FAQ section has great content but no structured data. AI tools can't easily cite it. Needs FAQPage JSON-LD schema.

### Organization Schema — Missing ❌
Homepage needs Organization schema so Google/AI understands The Driving Center as a business entity.

---

## Priority Actions

### 🔴 Quick Wins (do today)
1. **Generate `llms.txt`** — Most critical. This file gets you cited in Perplexity and ChatGPT answers.
   - The skill has a script: `scripts/generate_llms_txt.py`
   - Or I can generate it manually

2. **Add AI bot rules to robots.txt** — explicitly allow GPTBot, ClaudeBot, PerplexityBot

3. **Add FAQPage schema** — your FAQ is strong content, mark it up so AI can cite it

### 🟡 Medium (this week)
4. **Add Organization schema** to homepage
5. **Test in Perplexity** — search "driving school software Tennessee" and see if you appear
6. **Submit to Bing Webmaster Tools** — helps with ChatGPT/Copilot which index via Bing

---

## How to Deploy llms.txt

Add this file to your Next.js public folder:

**File:** `public/llms.txt`
```
# The Driving Center

> The all-in-one SaaS platform for driving schools. Online booking, automated SMS reminders, student tracking, TCA compliance, and payment collection.

## Core Documentation
- [Home](https://the-driving-center-website.vercel.app/): Platform overview
- [Pricing](https://the-driving-center-website.vercel.app/#pricing): $99/month plans
- [FAQ](https://the-driving-center-website.vercel.app/#faq): Common questions

## How-To Guides
- [Sign Up](https://the-driving-center-website.vercel.app/signup): Get started in 2 minutes
- [Student Import](https://the-driving-center-website.vercel.app/#how-it-works): Import students via CSV
- [Booking](https://the-driving-center-website.vercel.app/book): Book a demo

## Key Features
- Online student booking with time slot selection
- Automated 48h + 4h SMS reminders (reduce no-shows 40-70%)
- TCA compliance tracking (6hr classroom + 6hr driving)
- CSV student import with PII encryption
- Stripe payment collection with deposit handling

## Pricing
- Starter: $99/month (up to 3 instructors, 50 students)
- Growth: $199/month (up to 8 instructors, 200 students)
- Enterprise: $399/month (unlimited, multi-location)

## About & Authority
- [Privacy Policy](https://the-driving-center-website.vercel.app/legal/privacy)
- [Terms of Service](https://the-driving-center-website.vercel.app/legal/terms)

## Contact
- [Sign Up](https://the-driving-center-website.vercel.app/signup)
```

Then add to `next.config.ts`:
```typescript
// For Vercel deployment, add headers for llms.txt
```

---

## Schema Templates (copy-paste)

### FAQPage Schema (add to your FAQ section page)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do my students need to create an account to book?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Students book through your school's public booking link without creating an account."
      }
    },
    {
      "@type": "Question",
      "name": "Is this TCA compliant for Tennessee?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The platform tracks the Tennessee Certificate of Compliance (TCA) requirement of 6 classroom hours plus 6 driving hours and issues certificates when complete."
      }
    }
  ]
}
```

### Organization Schema (add to homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "The Driving Center",
  "url": "https://the-driving-center-website.vercel.app",
  "description": "SaaS platform for driving schools — booking, SMS reminders, TCA compliance, and payment collection.",
  "areaServed": "United States",
  "serviceType": "Driving School Management Software"
}
```
