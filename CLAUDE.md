# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Priceless Deal Orchestrator** — an interactive demo/prototype built by Qurable for Mastercard. It simulates a multi-actor loyalty deal management platform with three user roles:

1. **Benefit Creator** (Merchant/Partner) — creates promotional offers via a tabbed wizard
2. **Network Orchestrator** (Mastercard Admin) — reviews and approves deals against governance rules
3. **Issuer Publisher** (Bank) — activates and publishes approved deals to customers

## Running the App

No build step required. Serve the static files:

```bash
python3 -m http.server 8000
# or
npx http-server
```

Then open `http://localhost:8000`. Also works by opening `index.html` directly in a browser.

## Architecture

**Single-file vanilla JS SPA** — no framework, no npm, no build toolchain.

| File | Purpose |
|------|---------|
| `index.html` | Minimal HTML shell, loads `app.js` and `styles.css` |
| `app.js` | All application logic (~4000+ lines) |
| `styles.css` | All styles with CSS custom properties design system |
| `design-system.html` | Standalone design system reference (not part of the app flow) |
| `assets/` | Images and SVG assets |

**External dependencies** (CDN only):
- Phosphor Icons v2.1.1
- Google Fonts (Poppins, Plus Jakarta Sans)

### State Management

A single global `state` object is the source of truth. Persists to `localStorage` under key `"priceless-demo-v4"` (version-controlled via `STATE_VERSION = 4` — bump when making breaking state changes).

Key state paths:
- `state.screen` — current route (use `S.*` constants, never raw strings)
- `state.wizardTab` — active tab in the offer creation wizard (`basic` | `offer` | `targeting` | `validity` | `funding` | `media` | `review`)
- `state.benefit` — current wizard draft (shape defined by `defaultBenefitDraft()`)
- `state.benefits` — list of all merchant benefit drafts
- `state.workflow` — cross-actor approval status (`submitted`, `orchestratorDecision`, `issuerActivated`)
- `state.network` — network actor sub-state (`queueView`, `selectedDealId`, `aiView`, `selectedLibraryDealId`)
- `state.issuer` — issuer actor sub-state (`libraryView`, `activationStep`)
- `state.merchantOnboarded` — whether the merchant has completed onboarding

State helpers: `getValue(path)` / `setValue(path, value)` use dot-notation. `setValue` auto-persists and re-renders. To reset all state, use the **Reset demo** button (action `reset-demo`) in the sidebar.

### Routing

All screen identifiers live in the `S` constant object (never use raw strings). Hash-based: `window.location.hash` → `parseHash()` → `state.screen`. `navigate(screen)` changes screen, syncs hash, triggers full re-render.

Shortcut nav actions for jumping mid-flow: `flow-submitted`, `flow-approved`, `flow-activated` (skips actors to reach a specific state).

### Rendering

`render()` → `renderScreen()` dispatches to one of ~20 `render*()` functions based on `state.screen`. Every render is a full DOM replacement of `#app`. The `shell(content)` helper wraps content with the sidebar and topbar.

### Event Handling

All events are delegated on `document`. UI elements use `data-*` attributes:
- `data-nav` — sidebar navigation (maps to `S.*` via nav action strings)
- `data-action` — triggers actions handled in `handleAction()`
- `data-bind` — two-way form binding to state paths
- `data-open-modal` / `data-close-modal` — modal control

### Screens

| Actor | Screen keys (`S.*`) |
|-------|-------------|
| Landing | `index` |
| Merchant | `merchant/invite`, `merchant/join`, `merchant/register`, `merchant/otp`, `merchant/onboard`, `merchant/dashboard`, `merchant/benefits`, `merchant/new`, `merchant/partnerships` |
| Network | `network/queue`, `network/detail`, `network/ai`, `network/rules`, `network/library` |
| Issuer | `issuer/library`, `issuer/activation`, `issuer/analytics`, `issuer/lifecycle` |

The merchant flow has a full onboarding sequence: invite → join → register → otp → onboard → dashboard. The offer creation wizard lives at `merchant/new` and uses `state.wizardTab` for its tabs.

### Styling

CSS custom properties define the full design system. Brand colors: Mastercard Orange `#ff9e1b`, Red `#eb001b`. Semantic colors: success `#197a43`. All component styles are hand-written — no CSS framework. Refer to `design-system.html` for the visual token reference.

## Demo Data

The hardcoded demo scenario is a Zappos Valentine's Day 2-for-1 Shoes offer. Personas:
- **Merchant:** Nina Watts (Zappos Merchant Admin)
- **Network:** Mastercard Governance (Network Admin)
- **Issuer:** Avery Coleman (Waltmart Offer Manager)

Benefit list seeded in `DEMO_BENEFITS`; the active Zappos deal in `DEMO_BENEFIT_DETAIL`. Wizard form shape is defined by `defaultBenefitDraft()` and `defaultFundingDraft()`.
