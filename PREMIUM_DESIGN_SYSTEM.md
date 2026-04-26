# PREMIUM DESIGN SYSTEM — The Driving Center SaaS

## Source: Vibe Coding Research + Linear/Vercel/Stripe Design Principles

---

## THE GOLDEN RULE
> "AI follows constraints better than vibes. Describe the rules of the design system, not the aesthetics." — r/vibecoding

---

## DESIGN TOKENS

### Colors (Premium Dark SaaS)
```
--bg:          #09090b    (near-black zinc-950)
--surface:     #18181b    (zinc-900)
--surface-2:   #27272a    (zinc-800)
--border:      #3f3f46    (zinc-700)
--text:        #fafafa    (zinc-50)
--text-muted:  #a1a1aa    (zinc-400)
--text-subtle: #52525b    (zinc-600)
--accent:      #3b82f6    (blue-500)  — primary CTA
--accent-2:    #8b5cf6    (violet-500) — secondary accent
--success:     #22c55e    (green-500)
--gradient:    linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)
```

### Typography
```
Font:     Inter (next/font/google — already configured)
Scale:
  Hero:    text-6xl md:text-7xl font-bold tracking-tight leading-tight
  H2:      text-4xl md:text-5xl font-bold tracking-tight
  H3:      text-xl font-semibold
  Body:    text-base leading-relaxed
  Small:   text-sm text-muted
  Mono:    font-mono text-xs (for code/badges)
Letter-spacing: -0.025em on large headings (tight, premium feel)
```

### Spacing System (8px base)
```
Section padding:    py-24 md:py-32 (generous — premium sites breathe)
Container max-width: max-w-6xl (1160px)
Content max-width:  max-w-2xl (for text-heavy sections like FAQ)
Card padding:      p-8 md:p-10
Gap between cards: gap-6 (24px)
```

### Border Radius
```
Buttons:     rounded-xl (12px)
Cards:       rounded-2xl (16px)
Badges:      rounded-full (pill)
Large cards: rounded-3xl (24px)
```

### Shadows (Premium Feel)
```
Card shadow:    0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)
Elevated:      0 10px 40px rgba(0,0,0,0.4)
CTA glow:      0 0 60px rgba(59,130,246,0.3) (accent color glow)
```

### Motion
```
Duration:   200ms (micro), 300ms (standard), 500ms (entrance)
Easing:    cubic-bezier(0.4, 0, 0.2, 1) — "ease-out" for everything
Stagger:   75ms between siblings
Hover:     scale(1.02) + shadow elevation on cards
Page load: fade-in + translateY(-8px) → 0
```

---

## SECTION-BY-SECTION RULES

### 1. NAVIGATION
```
- Full-width, sticky top-0
- Background: bg/80 backdrop-blur-xl
- Border-bottom: 1px solid border
- Height: h-16 (64px)
- Logo: left-aligned, icon + wordmark
- Nav links: center or right, gap-6, text-sm font-medium
- CTA button: right-aligned, gradient background, rounded-xl
- Mobile: hamburger menu with slide-down panel
```

### 2. HERO SECTION (Most Important)
```
LAYOUT: Two-column grid (60/40 split on desktop)
- LEFT (60%): Eyebrow badge → Headline → Subheadline → CTAs → Trust badges
- RIGHT (40%): Product UI mockup / app screenshot

EYEBROW:
- Pill badge: px-4 py-1.5 rounded-full
- Background: rgba(59,130,246,0.1)
- Border: 1px solid rgba(59,130,246,0.2)
- Text: text-xs font-semibold text-blue-400 uppercase tracking-widest
- Content: "Trusted by driving schools in Tennessee"

HEADLINE:
- text-6xl md:text-7xl font-bold tracking-tight leading-[0.95]
- White primary text
- Gradient text on key word: bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent
- Max 8 words total — punchy, not a sentence

SUBHEADLINE:
- text-lg md:text-xl text-zinc-400 max-w-lg
- leading-relaxed
- One sentence of real value, no fluff

CTAS:
- Primary: gradient bg (blue→violet), text-white, px-8 py-4, rounded-xl, font-semibold
- Secondary: bg-zinc-800 text-zinc-300, px-8 py-4, rounded-xl, border border-zinc-700
- Primary shadow: 0 0 40px rgba(59,130,246,0.35)
- Gap between CTAs: gap-3

TRUST BADGES:
- text-xs text-zinc-500
- Checkmark icon before each
- Horizontal row below CTAs

PRODUCT MOCKUP (RIGHT SIDE):
- Real-looking app UI in a browser chrome frame
- Or: dashboard card showing sessions/students
- Subtle floating shadow: 0 25px 50px rgba(0,0,0,0.5)
- Border: 1px border-zinc-800 rounded-2xl
- Slight tilt/angle optional: transform rotate(-1deg)
```

### 3. LOGO BAR (Social Proof)
```
- Full-width of container
- py-12 (breathing room)
- Border top + border bottom (subtle)
- "Trusted by schools across Tennessee" — centered, text-xs uppercase tracking-widest text-zinc-500
- Logo/name grid: 5-6 school names or city names
- Opacity: 0.4 (muted, not distracting)
- Center the whole row
```

### 4. FEATURES SECTION
```
LAYOUT: 3-column grid on desktop

SECTION HEADER:
- Centered, max-w-xl
- Eyebrow: text-xs uppercase tracking-widest text-blue-400/70 font-semibold
- H2: text-4xl font-bold tracking-tight
- Subtext: text-zinc-400 mt-3

EACH FEATURE CARD:
- bg-zinc-900 border border-zinc-800 rounded-2xl p-8
- Hover: border-zinc-700 + translateY(-2px) + shadow elevation
- Icon: Lucide icon, w-10 h-10, bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-5
- Title: text-base font-semibold text-white mb-2
- Description: text-sm text-zinc-400 leading-relaxed
- Gap between cards: gap-6

NO EMOJIS. EVER. Use Lucide React icons only.
```

### 5. HOW IT WORKS
```
LAYOUT: Numbered steps in a row (desktop) / stack (mobile)

STEP NUMBER:
- Large: text-7xl font-bold text-zinc-800
- Position: absolute top-0 left-0
- Or: circular badge with number, gradient background

STEP CONTENT:
- Title: text-lg font-semibold text-white
- Description: text-sm text-zinc-400

CONNECTOR:
- Subtle gradient line between steps on desktop
- bg-gradient-to-r from-blue-500/30 to-violet-500/30 h-px
```

### 6. PRICING SECTION
```
LAYOUT: 3-column, centered, items-start

SECTION HEADER: same pattern as Features

TIER CARD:
- bg-zinc-900 border border-zinc-800 rounded-3xl p-10
- POPULAR TIER: border-blue-500/50, subtle blue glow
- Popular badge: px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold

PLAN NAME: text-sm font-semibold text-zinc-300 uppercase tracking-wider
PRICE:
- text-6xl font-bold text-white
- Period: text-zinc-500 text-sm
FEATURE LIST:
- Each item: flex items-center gap-3 text-sm
- Icon: CheckCircle, w-4 h-4, text-green-400
- Text: text-zinc-300
CTA BUTTON:
- Full-width
- Popular: gradient bg
- Others: bg-zinc-800 text-zinc-300 border border-zinc-700
```

### 7. FAQ SECTION
```
LAYOUT: max-w-2xl centered (narrower = more premium feel)

QUESTION:
- text-sm font-medium text-zinc-200
- chevron-down icon right-aligned, rotates 180° on open
- py-4 px-6

ANSWER (when open):
- text-sm text-zinc-400 leading-relaxed
- border-t border-zinc-800 pt-4
- px-6 pb-5

WRAPPER:
- bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden
- divide-y divide-zinc-800 between items
```

### 8. FOOTER CTA BANNER
```
- Full-width, centered
- bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl
- OR: bg-zinc-900 with gradient border
- py-20 md:py-24
- H2: text-4xl font-bold text-white
- Sub: text-zinc-300 text-lg
- CTA button: bg-white text-zinc-900 px-8 py-4 rounded-xl font-semibold
- Subtle dot grid or mesh background pattern
```

### 9. FOOTER
```
- py-8 border-t border-zinc-800
- Logo left, links right
- text-zinc-500 text-sm
```

---

## ICON SYSTEM
```
Use ONLY Lucide React icons (already installed):
import { Calendar, Users, Shield, Bell, Clock, CheckCircle, ArrowRight, Menu, X,
         CreditCard, TrendingUp, BarChart3, Settings, Star, ChevronDown } from 'lucide-react'

Sizing rules:
- Nav icons: w-5 h-5
- Feature icons: w-10 h-10 in bg container
- List check icons: w-4 h-4
- Arrow icons: w-4 h-4
```

---

## ANIMATION RULES
```
Entrance: fade-in (opacity 0→1) + translateY(16px→0), 500ms ease-out
Stagger siblings: 75ms delay between items
Hover cards: transition-all duration-200, translateY(-2px) + shadow
CTA hover: scale(1.02) + brighter shadow
FAQ chevron: transition-transform duration-200
Mobile menu: transition-all duration-300 for height/opacity
```

---

## ANTI-PATTERNS (Never Do These)
```
❌ Emojis as icons — instant cheap look
❌ max-w-sm on content — causes cramped-narrow look
❌ py-12 on sections — too compressed, needs py-24+
❌ Text directly on dark bg without hierarchy
❌ Flat shadows (no depth)
❌ Single-column layout on desktop
❌ Rounded-lg on cards (too small, need rounded-2xl minimum)
❌ "Make it look premium" as a prompt — specify exact tokens
```
