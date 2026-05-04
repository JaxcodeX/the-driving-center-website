# SPEC — Dark Mode Premium Landing Page
# DesignJoy aesthetic on dark background

## Source References (7 screenshots)
- design1 (d1e87f6b): DesignJoy hero — warm mesh gradient "Join" card, 60/40 split
- design2 (fa9a1511): DesignJoy "How it Works" — yellow/blue/orange mesh gradient cards
- design3 (c4903130): DesignJoy Benefits — editorial serif italic, mesh gradient icons
- design4 (2c79a925): DesignJoy portfolio — white angled section on warm bg, pink/blue accents
- design5 (8283fe10): beatgig dark calendar — yellow glow bottom, pink status badges, glassmorphism
- design6 (5b570d1c): EASY-O light dashboard — blue active pills, KPI cards, area chart
- design7 (5eaaf6f9): Soft UI dashboard — large radii, white cards, sidebar pill active states

---

## Color Palette (Dark Mode)

```css
/* Page */
--bg-base: #09090B;           /* near-black zinc */
--bg-surface: #18181B;        /* dark zinc — card backgrounds */
--bg-elevated: #1F1F23;        /* slightly lighter for hover */

/* Text */
--text-primary: #FFFFFF;
--text-secondary: #A1A1AA;
--text-muted: #52525B;

/* Borders */
--border: rgba(255,255,255,0.08);
--border-hover: rgba(255,255,255,0.15);

/* Accents */
--accent-yellow: #FACC15;      /* primary CTA — electric yellow */
--accent-blue: #2563EB;        /* links, active states */
--accent-pink: #EC4899;         /* pink/magenta status */
--accent-purple: #A855F7;       /* purple accent */
--accent-cyan: #06B6D4;         /* cyan accent */

/* Mesh Gradient Colors (vibrant on dark) */
--mesh-pink: #EC4899;
--mesh-purple: #8B5CF6;
--mesh-blue: #3B82F6;
--mesh-cyan: #06B6D4;
--mesh-yellow: #FACC15;
--mesh-orange: #F97316;
--mesh-green: #10B981;

/* Glows */
--glow-yellow: rgba(250, 204, 21, 0.15);
--glow-blue: rgba(37, 99, 235, 0.2);
--glow-pink: rgba(236, 72, 153, 0.2);
--glow-purple: rgba(168, 85, 247, 0.2);

/* Shadows */
--shadow-card: 0 8px 40px rgba(0,0,0,0.5);
--shadow-glow-yellow: 0 0 60px rgba(250, 204, 21, 0.2);
```

---

## Typography

- **Font**: Inter only (no serif on dark — cleaner, more legible)
- **Display**: 800 weight, clamp(56px, 7vw, 88px), letter-spacing -0.03em, line-height 1.05
- **Section Headline**: 700 weight, clamp(36px, 4vw, 56px), line-height 1.15
- **Card Title**: 600 weight, 20px
- **Body**: 400 weight, 16px, line-height 1.75
- **Label/Eyebrow**: 600 weight, 11px, uppercase, letter-spacing 0.1em, text-muted
- **Button**: 600 weight, 15px

---

## Mesh Gradient Recipes (CSS layered radial gradients)

These go INSIDE dark cards — the gradients are the background, the card is dark zinc behind:

```css
/* Mesh Pink→Purple→Blue (Hero Join Card) */
background: 
  radial-gradient(ellipse 80% 60% at 20% 20%, #EC4899 0%, transparent 60%),
  radial-gradient(ellipse 60% 80% at 80% 80%, #3B82F6 0%, transparent 60%),
  radial-gradient(ellipse 60% 60% at 50% 50%, #8B5CF6 0%, transparent 70%),
  #18181B;

/* Mesh Yellow→Orange (Subscribe Card) */
background:
  radial-gradient(ellipse 70% 50% at 30% 30%, #FACC15 0%, transparent 55%),
  radial-gradient(ellipse 50% 70% at 70% 70%, #F97316 0%, transparent 60%),
  radial-gradient(ellipse 40% 40% at 60% 40%, #EF4444 0%, transparent 50%),
  #18181B;

/* Mesh Blue→Cyan (Request Card) */
background:
  radial-gradient(ellipse 60% 60% at 20% 80%, #06B6D4 0%, transparent 50%),
  radial-gradient(ellipse 70% 50% at 80% 20%, #3B82F6 0%, transparent 60%),
  radial-gradient(ellipse 50% 60% at 50% 50%, #8B5CF6 0%, transparent 65%),
  #18181B;

/* Mesh Green→Blue (Receive Card) */
background:
  radial-gradient(ellipse 60% 60% at 70% 30%, #10B981 0%, transparent 55%),
  radial-gradient(ellipse 60% 60% at 30% 70%, #3B82F6 0%, transparent 55%),
  radial-gradient(ellipse 50% 50% at 50% 50%, #06B6D4 0%, transparent 60%),
  #18181B;
```

---

## Section Breakdown

### 1. Navbar
- Height: 68px
- Background: transparent → `rgba(9,9,11,0.8)` with `backdrop-filter: blur(16px)` on scroll
- Logo left: "DC" icon (minimal geometric) + "The Driving Center" in Inter 700 white
- Nav center: Features | Pricing | FAQ — 14px Inter 500, text-secondary, hover white
- Right: "Log in" (text link, text-secondary) + "Start free trial" (pill, `--accent-yellow` bg, black text, font-weight 700)
- Border bottom: 1px solid var(--border)

### 2. Hero Section
- **Background**: `--bg-base` `#09090B` with subtle bottom yellow glow (`radial-gradient(ellipse 60% 40% at 50% 100%, rgba(250,204,21,0.08) 0%, transparent 70%)`)
- **Layout**: Two-column, 55% text / 45% visual
- **Left column**:
  - Eyebrow pill: `background: rgba(250,204,21,0.1); color: #FACC15; border: 1px solid rgba(250,204,21,0.2)` — "SCHEDULING SOFTWARE FOR DRIVING SCHOOLS"
  - Headline: two lines, Inter 800, clamp(56px, 7vw, 88px), white, tight leading
  - Subheadline: 18px Inter 400, text-secondary, max-width 480px
  - CTA row: "Start free trial" pill (`background: #FACC15; color: #000; font-weight: 700; padding: 14px 28px; border-radius: 100px;`) + "Book a demo" ghost pill (`border: 1px solid var(--border); color: white;`)
  - Trust line: 13px text-muted, "Trusted by 50+ driving schools across Tennessee"
- **Right column**: Hero visual card
  - Large "Join" mesh gradient card (pink→purple→blue mesh, per recipe above)
  - Border-radius: 32px
  - Internal layout: top badge, title, pricing text, "See pricing" white button, avatar row
  - Sits on subtle yellow glow shadow
  - `box-shadow: 0 0 80px rgba(250,204,21,0.12), 0 32px 64px rgba(0,0,0,0.6)`
- **Spacing**: padding 140px top, 100px bottom

### 3. Trusted Logos Strip
- Background: `--bg-surface` `#18181B`
- 5-6 monochrome school/company logos in a horizontal row
- Label above: "Trusted by schools across Tennessee" — small caps, text-muted
- Logos: grayscale filter, opacity 0.5 → 1 on hover
- Padding: 48px top/bottom
- Section eyebrow: none

### 4. Features (Bento Grid)
- Background: `--bg-base` `#09090B`
- Section eyebrow: "FEATURES" — small caps label, text-muted, with blue accent line
- Section headline: Inter 700, clamp(36px, 4vw, 52px), white
- **Bento grid**: 3-column, gap 20px
  - Two large cards (span 2 cols): Online Booking, Automated Reminders
  - Four small cards: Student Tracking, Stripe Billing, Instructor Management, Multi-tenant Security
- **Large cards** (span 2):
  - Background: `#18181B`
  - Border-radius: 24px
  - Top: mesh gradient accent strip (80px tall, per appropriate mesh recipe)
  - Icon: Lucide, 28px, in accent color
  - Title: Inter 700, 22px, white
  - Description: Inter 400, 15px, text-secondary, line-height 1.7
  - Bottom: colored accent line (4px, full width, gradient matching the mesh above)
- **Small cards**:
  - Background: `#18181B`
  - Border-radius: 20px
  - Icon + title + 1-line description
  - Subtle hover: `--bg-elevated` background + border brightens
- **Spacing**: 100px top/bottom

### 5. How It Works (3 Step Cards)
- Background: `--bg-base` `#09090B`
- Section eyebrow: "HOW IT WORKS"
- Section headline: Inter 700, clamp(36px, 4vw, 52px), white, centered
- **3 step cards** in a row:
  - Card 1: yellow mesh gradient top half (Subscribe theme)
  - Card 2: blue/cyan mesh gradient top half (Request theme)
  - Card 3: green/blue mesh gradient top half (Receive theme)
  - Each card: dark `#18181B` bottom half with title + description
  - Huge muted step number (80px, `color: rgba(255,255,255,0.05)`) behind each card
  - Connecting dashed line with dot between cards
  - Border-radius: 28px
  - Top half: 180px with gradient + floating UI mockup elements
  - Bottom half: 120px with title + description
- **Steps**: 1. Create your school profile → 2. Add instructors & students → 3. Accept bookings online
- **Spacing**: 100px top/bottom

### 6. Stats Bar
- Background: `#18181B`
- 4 stats centered: "50+ Schools" / "10,000+ Sessions" / "$2M+ Processed" / "99.9% Uptime"
- Each: large number Inter 800 48px white + label 12px text-muted below
- Vertical dividers between stats
- Padding: 60px top/bottom

### 7. Pricing
- Background: `--bg-base` `#09090B`
- Section eyebrow: "PRICING"
- Section headline: centered, Inter 700, clamp(36px, 4vw, 52px)
- **3 pricing cards**:
  - All: `#18181B` bg, border-radius 24px, padding 32px
  - Left (Starter $99): standard card
  - Center (Professional $199): blue border glow (`box-shadow: 0 0 60px rgba(37,99,235,0.25); border: 1.5px solid #2563EB`)
  - Right (Enterprise $499): standard card
  - Each: plan name, price (huge Inter 800), feature list with checkmarks, CTA pill
  - Highlighted CTA: `#FACC15` yellow pill
  - Standard CTA: ghost pill
- **Spacing**: 100px top/bottom

### 8. FAQ
- Background: `#18181B`
- Section eyebrow: "FAQ"
- Centered accordion, max-width 680px
- Each item: bottom border `rgba(255,255,255,0.06)`, trigger hover shows blue text
- Content: text-secondary
- Padding: 80px top/bottom

### 9. CTA Section
- Background: `--bg-base` `#09090B`
- Centered, headline Inter 700 clamp(36px, 4vw, 52px)
- Subheadline: text-secondary
- CTA pill: `#FACC15`, black text, bold, `padding: 16px 36px`, border-radius 100px
- Subtle yellow glow behind CTA button
- **Spacing**: 100px top/bottom

### 10. Footer
- Background: border-top only
- Logo left + "The Driving Center" wordmark
- Links center: Privacy | Terms | Login
- Copyright right
- Text-muted, 13px
- Padding: 32px

---

## Global Rules
- **Border radii**: 32px for hero cards, 24px for feature cards, 20px for small cards, 100px for pills
- **Section padding**: 100-140px top, 80-100px bottom (no compress)
- **Max-width container**: 1200px, centered
- **Backdrop blur**: `backdrop-filter: blur(12px)` on glassmorphism elements
- **Card shadows**: `box-shadow: 0 8px 40px rgba(0,0,0,0.5)` on all dark cards
- **Hover states**: cards lift (`translateY(-4px)` + shadow intensifies)
- **Transitions**: `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`

---

## Implementation Notes

### Mesh Gradient Implementation
Use CSS `background` with 3-4 layered `radial-gradient` values. Each gradient has a different origin point (% % position) and color. The gradients are semi-transparent so the dark card background shows through, creating depth.

```css
/* Example — Pink/Purple/Blue mesh */
.card {
  background:
    radial-gradient(ellipse 80% 60% at 20% 20%, rgba(236,72,153,0.6) 0%, transparent 60%),
    radial-gradient(ellipse 60% 80% at 80% 80%, rgba(59,130,246,0.5) 0%, transparent 60%),
    radial-gradient(ellipse 60% 60% at 50% 50%, rgba(168,85,247,0.4) 0%, transparent 70%),
    #18181B;
}
```

### Dashboard Mockup (Hero visual)
The "Join" card on the right should show a mini admin dashboard mockup inside a mesh gradient card. Use the existing `DashboardMockup` component but style the outer container with:
- 32px border-radius
- Mesh gradient background
- `box-shadow: 0 0 80px rgba(250,204,21,0.12), 0 32px 64px rgba(0,0,0,0.6)`

### Favicon
Update favicon to match DC branding — dark background, yellow "DC" letters

### Build rules
- npm run build must pass
- Commit message: `feat: dark mesh redesign — DesignJoy on dark aesthetic [prov: deepseek]`
- Only modify `src/app/page.tsx` and `src/app/globals.css` if needed for utility classes
