# S.G.I.R. — Darouna Frontend

Système de Gestion Immobilière Résidentielle — Mobile-first PWA for residential building management in North Africa (Algeria/Morocco/France).

---

## Stack

- **React 18 + TypeScript** via Vite
- **Tailwind CSS** (configured with the exact Stitch design tokens below)
- **React Router v6** — role-based protected routes
- **Zustand** — auth & global state
- **Axios** — API client with JWT interceptors + refresh logic
- **react-i18next** — Arabic (RTL), French, English
- **Workbox** (via vite-plugin-pwa) — PWA service worker

---

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── TopAppBar.tsx          # Fixed top bar, blur glass, avatar + notif bell
│   │   ├── BottomNav.tsx          # Role-aware bottom nav (4 tabs per role)
│   │   └── DashboardLayout.tsx    # TopAppBar + BottomNav wrapper
│   └── ui/
│       ├── StatusBadge.tsx        # Tinted glass badges (pending/in-progress/etc.)
│       ├── MetricCard.tsx         # Ambient-depth stat card
│       ├── GradientButton.tsx     # Primary emerald gradient CTA
│       └── GlassCard.tsx         # Glass-morphism floating card
├── pages/
│   ├── auth/
│   │   ├── RoleSelect.tsx         # Role selection (Syndic / Resident / Gardien)
│   │   ├── Login.tsx              # Email + password login
│   │   └── Register.tsx          # Registration form
│   ├── syndic/
│   │   ├── Dashboard.tsx          # Collection rate hero + budget variance + tasks
│   │   ├── Units.tsx              # Buildings + apartments list
│   │   ├── Tasks.tsx              # Task approval list
│   │   └── Finance.tsx            # Charges + payments + reports
│   ├── resident/
│   │   ├── Dashboard.tsx          # Balance hero + bento grid + building feed
│   │   ├── Properties.tsx         # Apartment details
│   │   ├── Ledger.tsx             # Payment history
│   │   └── Support.tsx            # File complaint + view complaints
│   └── gardien/
│       ├── Dashboard.tsx          # Today's summary
│       ├── Tasks.tsx              # Task list + status updates
│       └── Finance.tsx            # Placeholder
├── lib/
│   ├── api.ts                     # Axios instance, base URL from VITE_API_URL
│   ├── auth.ts                    # Auth API calls (login/register/refresh/logout/me)
│   └── cn.ts                      # clsx + tailwind-merge
├── store/
│   └── authStore.ts               # Zustand: user, role, tokens, isAuthenticated
├── router/
│   └── index.tsx                  # Routes with role guards
└── i18n/
    ├── index.ts                   # i18next setup
    ├── ar.json                    # Arabic strings
    ├── fr.json                    # French strings
    └── en.json                    # English strings
```

---

## Design System — "Verdant Sanctuary / Emerald Zenith"

Source of truth: `_extracted/stitch/stitch_resident_mobile_view/`

### Color Tokens (exact Tailwind config values)

```ts
colors: {
  "primary":                   "#2b6954",
  "primary-container":         "#71af97",
  "primary-fixed":             "#b0f0d6",
  "primary-fixed-dim":         "#95d3ba",
  "on-primary":                "#ffffff",
  "on-primary-container":      "#004231",
  "on-primary-fixed":          "#002117",
  "on-primary-fixed-variant":  "#0b513d",
  "secondary":                 "#515f74",
  "secondary-container":       "#d5e3fc",
  "secondary-fixed":           "#d5e3fc",
  "secondary-fixed-dim":       "#b9c7df",
  "on-secondary":              "#ffffff",
  "on-secondary-container":    "#57657a",
  "on-secondary-fixed":        "#0d1c2e",
  "on-secondary-fixed-variant":"#3a485b",
  "tertiary":                  "#006b5f",
  "tertiary-container":        "#0db6a4",
  "tertiary-fixed":            "#71f8e4",
  "tertiary-fixed-dim":        "#4fdbc8",
  "on-tertiary":               "#ffffff",
  "on-tertiary-container":     "#004139",
  "on-tertiary-fixed":         "#00201c",
  "on-tertiary-fixed-variant": "#005048",
  "error":                     "#ba1a1a",
  "error-container":           "#ffdad6",
  "on-error":                  "#ffffff",
  "on-error-container":        "#93000a",
  "surface":                   "#faf9f6",
  "surface-bright":            "#faf9f6",
  "surface-dim":               "#dbdad7",
  "surface-variant":           "#e3e2e0",
  "surface-container-lowest":  "#ffffff",
  "surface-container-low":     "#f4f3f1",
  "surface-container":         "#efeeeb",
  "surface-container-high":    "#e9e8e5",
  "surface-container-highest": "#e3e2e0",
  "on-surface":                "#1a1c1a",
  "on-surface-variant":        "#3c4a42",
  "inverse-surface":           "#2f312f",
  "inverse-on-surface":        "#f2f1ee",
  "inverse-primary":           "#95d3ba",
  "surface-tint":              "#2b6954",
  "outline":                   "#6c7a71",
  "outline-variant":           "#bbcabf",
  "background":                "#faf9f6",
  "on-background":             "#1a1c1a",
}
```

### Typography

```ts
fontFamily: {
  "headline": ["Nunito Sans", "sans-serif"],   // Display + section headers
  "body":     ["Montserrat", "sans-serif"],    // Body text, labels, data
  "label":    ["Montserrat", "sans-serif"],    // Small caps, badges
}
// Google Fonts URL:
// https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@700;800;900&family=Montserrat:wght@400;500;600;700&display=swap
```

### Border Radius

```ts
borderRadius: {
  DEFAULT: "0.25rem",
  lg:      "0.5rem",
  xl:      "0.75rem",   // Primary card radius
  full:    "9999px",    // Badges, pills, avatars
}
```

### Custom CSS Classes (add to index.css)

```css
.glass-glow {
  box-shadow: inset 1px 1px 0px 0px rgba(255, 255, 255, 0.3);
}
.ambient-depth {
  box-shadow: 0 20px 40px rgba(43, 105, 84, 0.06);
}
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.4);
}
.gloss-button {
  background: linear-gradient(135deg, #064E3B 0%, #10B981 100%);
  box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.3), 0 10px 20px rgba(43, 105, 84, 0.1);
}
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
```

### Icons

Use **Material Symbols Outlined** exclusively.
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

### Design Rules

1. **No 1px solid borders** — use background color shifts for separation
2. **No pure black** — use `on-surface` (#1a1c1a)
3. **Primary emerald gradient** (`#064E3B` → `#10B981`) only for CTAs and active nav
4. Ambient shadow (not drop shadows) for floating cards
5. `backdrop-filter: blur(12px)` on floating glass elements
6. `backdrop-filter: blur(8px)` on secondary glass elements
7. Background organic blobs: fixed, -z-10, `rounded-full blur-[100px]`

### Primary Gradient

```css
background: linear-gradient(to bottom right, #064E3B, #10B981);
```

---

## Role Navigation

### Syndic
- **Dash** → `dashboard` icon
- **Units** → `domain` icon
- **Fix** → `build_circle` icon
- **Cash** → `payments` icon

### Resident
- **Home** → `dashboard` icon
- **Properties** → `domain` icon
- **Ledger** → `account_balance_wallet` icon
- **Support** → `support_agent` icon

### Gardien
- **Home** → `home` icon
- **Tasks** → `assignment` icon
- **Finance** → `account_balance_wallet` icon
- **Menu** → `menu` icon

Bottom nav pattern (active state):
```jsx
// Active
<a className="flex flex-col items-center bg-gradient-to-br from-[#064E3B] to-[#10B981] text-white rounded-xl px-4 py-2 shadow-lg shadow-emerald-900/20">
// Inactive
<a className="flex flex-col items-center text-emerald-900/50 px-4 py-2">
```

Nav container:
```jsx
<nav className="fixed bottom-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-t border-emerald-900/5 shadow-[0_-10px_30px_rgba(43,105,84,0.04)] px-4 pb-6 pt-3 flex justify-around items-center rounded-t-[32px]">
```

---

## Backend API

**Base URL:** `VITE_API_URL` env variable (e.g., `http://localhost:5000`)

All requests: `Authorization: Bearer <accessToken>`

**Response envelope:**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Human readable message",
  "success": true,
  "timestamp": "2026-03-31T10:00:00Z"
}
```

### Auth Endpoints

```
POST   /api/auth/register         { name, email, password, phone, role }
POST   /api/auth/login            { email, password } → { accessToken, refreshToken, user }
POST   /api/auth/logout           { refreshToken }
POST   /api/auth/refresh-token    { refreshToken } → { accessToken }
GET    /api/auth/me               → { user }
POST   /api/auth/change-password  { currentPassword, newPassword }
```

**Token strategy:**
- Access token: 15 min, stored in memory (Zustand)
- Refresh token: 7 days, stored in `localStorage`
- On 401, auto-retry with `/api/auth/refresh-token`
- On logout, call `/api/auth/logout` to blacklist

### Key Endpoints by Feature

```
# Buildings (Syndic)
GET    /api/buildings
POST   /api/buildings
GET    /api/buildings/:id
PUT    /api/buildings/:id
DELETE /api/buildings/:id
POST   /api/buildings/:id/assign-gardien
GET    /api/buildings/:id/stats       → { totalUnits, occupancy%, revenue, openTasks }

# Apartments (Syndic)
GET    /api/apartments
POST   /api/apartments
GET    /api/apartments/:id
PUT    /api/apartments/:id
DELETE /api/apartments/:id
POST   /api/apartments/:id/assign-resident
DELETE /api/apartments/:id/unassign-resident

# Tasks
POST   /api/tasks                     (Syndic creates)
GET    /api/tasks                     (Syndic: all tasks)
GET    /api/tasks/gardien             (Gardien: my tasks)
GET    /api/tasks/stats
POST   /api/tasks/:id/assign          { gardienId }
PUT    /api/tasks/:id/status          { status }
POST   /api/tasks/:id/submit          (Gardien submits for approval)
POST   /api/tasks/:id/approve         { approved: bool, reason? }

# Charges (Syndic issues, Resident reads)
POST   /api/charges
GET    /api/charges
GET    /api/charges/:id
GET    /api/charges/apartment/:apartmentId
GET    /api/charges/overdue
PUT    /api/charges/:id
DELETE /api/charges/:id

# Payments
POST   /api/payments                  { chargeId, method, amount }
GET    /api/payments
GET    /api/payments/:id
POST   /api/payments/:id/confirm      (Syndic confirms offline)
GET    /api/payments/apartment/:apartmentId
GET    /api/payments/resident/history

# Announcements
GET    /api/announcements
POST   /api/announcements
GET    /api/announcements/:id
PUT    /api/announcements/:id
DELETE /api/announcements/:id
POST   /api/announcements/:id/like
POST   /api/announcements/:id/comment
POST   /api/announcements/:id/view

# Votes
GET    /api/votes
POST   /api/votes
GET    /api/votes/:id
POST   /api/votes/:id/cast            { optionId }
POST   /api/votes/:id/close
GET    /api/votes/building/:buildingId

# Complaints
POST   /api/complaints
GET    /api/complaints
GET    /api/complaints/:id
PUT    /api/complaints/:id
POST   /api/complaints/:id/response   { message }
POST   /api/complaints/:id/rate       { rating: 1-5 }
GET    /api/complaints/stats

# Notifications
GET    /api/notifications
GET    /api/notifications/unread-count
PUT    /api/notifications/mark-all-read
PUT    /api/notifications/:id/read
PUT    /api/notifications/:id/archive
```

---

## Auth Store Shape (Zustand)

```ts
interface AuthState {
  user: User | null;
  role: 'syndic' | 'resident' | 'gardien' | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
}
```

Refresh token stored in `localStorage` under key `darouna_refresh_token`.

---

## i18n

Language detection order: `?lang=` param → localStorage → browser → fallback English.
RTL layout applies when `i18n.language === 'ar'`: set `dir="rtl"` on `<html>`.

Files: `src/i18n/en.json`, `fr.json`, `ar.json`

---

## PWA Config

From `_extracted/manifest/`:
```json
{
  "name": "Darouna",
  "short_name": "Darouna",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#faf9f6",
  "theme_color": "#2b6954",
  "icons": [ /* 48 to 512px */ ]
}
```
Note: Update `theme_color` from `#000000` to `#2b6954` (primary green).

---

## Stitch Reference Screens

Located at `_extracted/stitch/stitch_resident_mobile_view/`:

| Folder | Screen | Role |
|--------|--------|------|
| `login_role_selection/` | Role select + CTA | All |
| `refined_syndic_admin_dashboard_emerald/` | Syndic home | Syndic |
| `resident_dashboard_premium_emerald/` | Resident home | Resident |
| `gardien_task_list/` | Task list | Gardien |
| `resident_payment_ledger/` | Payment history | Resident |
| `file_a_complaint/` | New complaint form | Resident |
| `file_a_complaint_arabic/` | Arabic RTL complaint | Resident |
| `syndic_task_approval/` | Approve/reject tasks | Syndic |
| `evidence_capture/` | Photo upload | Gardien |
| `financial_control/` | Finance overview | Syndic |
| `property_directory/` | Building/unit browser | Syndic |

**Rule:** Always open the relevant Stitch `code.html` before building a screen. Match it pixel-for-pixel.

---

## Critical Rules

1. **Backend is read-only** — never modify files under `_extracted/backend/`
2. **Design is the law** — Stitch HTML files are the source of truth for every screen
3. **Mobile-first** — `min-h-screen pb-24` body, fixed bottom nav, fixed top bar
4. **No inline styles** unless they match exactly what Stitch uses (gradient widths, etc.)
5. **No raw borders** — use background shifts or `outline-variant/15` ghost borders
6. **VITE_API_URL** — never hardcode the API URL; always read from env
7. **Token refresh** — implement a single Axios interceptor that retries once on 401
8. **Role guards** — unauthenticated users → `/`, wrong role → redirect to own dashboard
9. **RTL** — `dir="rtl"` + `font-family: 'Noto Sans Arabic', sans-serif` when language is Arabic
10. **PWA** — manifest + icons from `_extracted/manifest/`, service worker via vite-plugin-pwa

---

## Environment Variables

```bash
# .env.local
VITE_API_URL=http://localhost:5000
```

---

## Commands

```bash
npm run dev      # Vite dev server
npm run build    # Production build
npm run preview  # Preview build
```

---

## Git Rules

- After every session: `git add -A && git commit -m "[descriptive summary of what was built]" && git push`
- Never leave uncommitted work at the end of a session
- Commit messages should describe **what was built**, not what files were changed
- Remote: `origin` → `https://github.com/Tsuyii/darouna-sgir-frontend`
- Always create or update CHANGELOG.md with today's date and a summary of what was built before the final commit

---

## Backend Status (Complete, 193 tests passing)

All features are fully implemented on the backend. Frontend only needs to call the APIs.

| Feature | Backend | Frontend (Phase 1) |
|---------|---------|-------------------|
| Auth (login, register, refresh, logout) | ✅ | Build |
| Role selection screen | — | Build |
| Syndic home dashboard | ✅ API | Build |
| Resident home dashboard | ✅ API | Placeholder |
| Gardien task list | ✅ API | Placeholder |
| Navigation shell (3 roles) | — | Build |
| Buildings & apartments | ✅ | Phase 2 |
| Task management | ✅ | Phase 2 |
| Charges & payments | ✅ | Phase 2 |
| Announcements | ✅ | Phase 2 |
| Votes | ✅ | Phase 2 |
| Complaints | ✅ | Phase 2 |
| Notifications | ✅ | Phase 2 |
| Budgets & reports | ✅ | Phase 3 |
