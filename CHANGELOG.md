# CHANGELOG

## 2026-04-01 — Phase 2: Buildings & Apartments

### Added
- **`src/lib/buildings.ts`**: Typed API helper module — `buildingsApi` (list, get, create, update, remove, stats) and `apartmentsApi` (list, listByBuilding, create, update, remove, assignResident, unassignResident). Shared `Building`, `Apartment`, and `BuildingStats` TypeScript interfaces.
- **`src/pages/syndic/BuildingDetail.tsx`**: Full-screen slide-in detail panel for a selected building. Tabs: "Apartments" (live list with occupancy bar, assign/unassign resident, optimistic delete) and "Building Info" (editable form with save + danger-zone delete). Nested modals for adding apartments and assigning residents. Loading skeletons and error states throughout.
- **`src/pages/syndic/Units.tsx`** (replaced placeholder): Fully functional property directory — hero heading, 3 live stat cards (total units, active buildings, avg units per building), search bar with clear button, filter chips (All / Large / Small), building cards list with gradient manage button, FAB to add building, integrates BuildingDetail panel. Loading skeletons, empty state, and error+retry state.

### Design
- Matches Stitch `property_directory/code.html` — left-bordered stat cards, ambient-depth cards, emerald gradient CTAs, Material Symbols Outlined icons, Nunito Sans headlines, Montserrat body text
- Mobile-first at 390px with `pb-28` scroll clearance and fixed FAB above bottom nav

---

## 2026-04-01 — Phase 1 Complete

### Added
- **main.tsx / App.tsx**: Wired BrowserRouter + AppRouter; `initFromStorage` called on mount to restore session from refresh token
- **Login page** (`/login/:role`): Email/password form, role badge, error handling, navigate to dashboard on success
- **Register page** (`/register/:role`): Full name/email/phone/password form, auto-login after registration
- **Syndic Dashboard**: Live API-connected dashboard — collection rate hero with progress bar, budget variance cards (total units, open tasks), maintenance snapshot (latest 3 tasks), quick-action buttons, property card
- **Syndic Units** (Phase 2 placeholder): Feature-preview cards for property directory
- **Syndic Tasks** (Phase 2 placeholder): Feature-preview cards for task management
- **Syndic Finance** (Phase 2 placeholder): Feature-preview cards for financial control
- **Resident Dashboard**: Live API-connected — outstanding balance hero with Pay Now CTA, bento quick-insights grid, building announcements feed
- **Resident Properties** (Phase 2 placeholder)
- **Resident Ledger** (Phase 2 placeholder)
- **Resident Support** (Phase 2 placeholder)
- **Gardien Dashboard**: Live API-connected task stats (total/pending/in-progress/completed), CTA to tasks
- **Gardien Tasks**: Full live task list from `/api/tasks/gardien` — start task, submit task actions with optimistic UI
- **Gardien Finance** (Phase 2 placeholder)

### Design
- All screens match Stitch "Verdant Sanctuary / Emerald Zenith" design system
- Glass-morphism cards, ambient-depth shadows, emerald gradient CTAs, Material Symbols Outlined icons
