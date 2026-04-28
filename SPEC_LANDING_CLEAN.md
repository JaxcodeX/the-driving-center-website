# SPEC — Landing Page Clean Rebuild

## What Makes Sites Look Like AI Slop (Anti-patterns to DELETE)

- ❌ Fake browser mockup with "Good morning, Mark" and fake revenue chart
- ❌ Gradient bento cards with checkmark icons
- ❌ Decorative circles / colorful overlapping blobs
- ❌ Glassmorphism (frosted glass effects)
- ❌ 72px hero headline
- ❌ Fake testimonials (real people, fabricated quotes)
- ❌ "Trusted by cities" social proof with no real companies
- ❌ Fade-up scroll animations
- ❌ Eyebrow text labels like "For driving schools across Tennessee"

## Reference Brand: Linear.app

Linear is the anti-AI-slop reference. Here's what it does right:
- Hero shows REAL product UI (actual issue tracker, real data)
- Social proof: real company NAMES (AnimABC, Vercel, Notion, etc.)
- No decorative blobs, no gradients, no glassmorphism
- Typography hierarchy: 72px Inter 800 for display, 18px body
- Color: white background (#FFFFFF), dark text (#0A0A0A), single blue accent (#1A56FF)
- Features section: text-based, no gradient cards, no bento grid
- Clean, high-contrast, credible

## Design Tokens

```
--bg-base: #FFFFFF
--bg-surface: #F5F5F3
--bg-dark: #0D1117
--text-primary: #0A0A0A
--text-secondary: #555555
--text-muted: #9B9B9B
--accent: #1A56FF
--accent-hover: #1447E6
--success: #16A34A
--border: #E5E5E3
--card-bg: #FFFFFF
--card-border: 1px solid #E5E5E3
--card-radius: 12px
--font: Inter, system-ui, sans-serif
```

## Typography Scale

- Hero headline: 56px / 800 weight / -0.02em tracking / #0A0A0A
- Section headline: 36px / 700 weight / -0.02em / #0A0A0A
- Sub-headline: 18px / 400 / #555555
- Body: 16px / 400 / #555555 / 1.6 line-height
- Label: 12px / 600 / uppercase / 0.08em tracking / #9B9B9B

## CTA Buttons

```
Primary: background #0A0A0A, color #fff, padding 12px 24px, radius 8px, font 15px 600
Primary hover: background #1A56FF
Ghost: border 1px solid #E5E5E3, color #0A0A0A, padding 12px 24px, radius 8px, font 15px 600
Ghost hover: border-color #0A0A0A
```

## Section Rhythm

- Section padding: 80px top/bottom
- Max content width: 1100px
- Content gap: 48px between elements
- Grid gap: 24px

## Layout

### Navbar
- Height: 56px
- Logo left: "DC" icon + "The Driving Center"
- Nav links center: Features, Pricing
- Auth right: Sign in (ghost link) + "Get started" (primary button)
- Border bottom: 1px solid #E5E5E3

### Section A — Hero
- Two-column grid (1fr 1fr), gap 64px, align center
- Left: Label ("Scheduling and payment software"), H1 ("The easier way to run your driving school"), body text, two CTAs
- Right: REAL screenshot of actual booking flow or dashboard — no fake browser chrome
- H1 max 56px, Inter 800, -0.02em, tight leading
- No decorative elements

### Section B — Logo strip (Social proof)
- White background with subtle top/bottom border
- Label: "Used by schools in Tennessee"
- School names in muted text (NO fake city names): "Reedy Driver Education, Oneida" etc OR just show partner logos
- If no real logos: use styled text wordmarks, max 6 names, credible

### Section C — Features
- Centered label + headline
- Three feature columns (text-based, NO gradient cards, NO bento grid)
- Each: number label (01, 02, 03), bold title, short description
- NO icons in circles, NO gradient backgrounds

### Section D — How It Works
- 3-step horizontal layout
- Each step: number, title, description
- Clean dividers between steps

### Section E — Pricing
- 3-column grid
- Each card: tier name, price (large), description, feature list, CTA button
- Middle card ("Growth") slightly elevated with subtle border highlight
- NO "Most popular" badge with accent color — use text label instead
- Prices: Starter $99, Growth $199, Enterprise $399

### Section F — FAQ
- Single-column accordion, max-width 680px
- NO glassmorphism, NO card wrapper
- Simple border-bottom dividers
- Clean open/close chevron

### Section G — Final CTA
- Centered, full-width dark band (#0A0A0A background, white text)
- H2 white, body muted (#9B9B9B), two ghost buttons

### Footer
- Minimal: logo left, links center, copyright right
- Border top only, #E5E5E3

## Dark Section (Booking CTA)
- Background: #0A0A0A
- White text
- Simple booking form (NOT the fake calendar widget with colorful pill buttons)
- If booking UI is too complex to show: use a clean form with name/email/phone fields + "Request demo" button
- NO colorful blobs, NO decorative circles, NO gradient pills
