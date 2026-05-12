# SPEC: School Admin Dashboard — Glassmorphism Dark Mode

## Reference
Hourglass healthcare dashboard adapted for dark mode with color pop.

## Design Language

### Colors (Dark Mode + Color Pop)
- **Background**: `#0A0A0F` deep dark with subtle purple undertone
- **Glass surface**: `rgba(255,255,255,0.03-0.06)` with backdrop-blur
- **Glass border**: `rgba(255,255,255,0.08)`
- **Card glow**: subtle colored glow on hover
- **Text primary**: `#FFFFFF`
- **Text secondary**: `#9CA3AF`
- **Accent green**: `#4ADE80` (primary CTA, active states)
- **Accent cyan**: `#67E8F9` (secondary data)
- **Accent purple**: `#A78BFA` (tertiary)
- **Accent orange**: `#FB923C` (warnings, highlights)
- **Glass gradient**: `linear-gradient(135deg, rgba(74,222,128,0.05), rgba(103,232,249,0.05))`

### Glassmorphism Rules
- `background: rgba(255,255,255,0.04)`
- `backdrop-filter: blur(20px)`
- `border: 1px solid rgba(255,255,255,0.08)`
- `border-radius: 20px`
- Subtle inner glow on hover: `box-shadow: 0 0 20px rgba(74,222,128,0.1)`

### Layout
- **Sidebar**: 220px fixed, glass background, nav items with icon + label
- **Main content**: Fluid, 3-column KPI row, then 2-column content area
- **Right panel**: Utility column (quick actions, upcoming schedule)

### Typography
- Font: Outfit for headings, Inter for body
- KPI numbers: 40px Outfit 800
- Section headers: 14px Outfit 600 uppercase tracking-wide
- Body: 14px Inter 400

---

## Dashboard Components

### 1. Sidebar
- Logo + school name at top
- Nav items: Dashboard, Students, Sessions, Instructors, Calendar, Billing, Settings
- Active state: white pill background (`rgba(255,255,255,0.1)`) with green left border
- Bottom: demo mode indicator

### 2. Top Bar
- Greeting: "Good morning" + school name
- Today's date
- Notification bell (icon only)
- User avatar

### 3. KPI Cards (4 across)
Each card:
- Glass background with subtle gradient
- Icon in colored circle (top left)
- Large number (Outfit 800, 40px)
- Label below (text-secondary)
- Delta badge (green up / red down)

KPIs:
- Total Students
- Active Sessions
- Monthly Revenue
- Completion Rate

### 4. Main Content Area (2 columns)
**Left (wider):**
- Upcoming Sessions table/list
- Recent Student Activity

**Right:**
- Quick Actions (3 buttons)
- Completion Rate ring chart

### 5. Upcoming Sessions Card
- Glass card with session rows
- Each row: student name, session type, time, instructor, status pill
- Status pills: green=confirmed, yellow=pending, blue=scheduled

### 6. Quick Actions
- "Schedule Session" (green)
- "Add Student" (cyan)
- "Send Reminder" (purple)

### 7. Completion Rate Ring
- SVG ring, green fill
- Percentage in center (large)
- Label below

---

## Interactions
- Cards: subtle lift on hover (`translateY(-2px)`, glow)
- Nav items: smooth background transition
- Buttons: scale down slightly on press

---

## Implementation
- File: `src/app/school-admin/page.tsx`
- Demo mode data from `/api/demo/dashboard`
- Same data structure already used