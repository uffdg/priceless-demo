# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Priceless Deal Orchestrator** — an interactive demo/prototype built by Qurable for Mastercard. It simulates a multi-actor loyalty deal management platform with three user roles:

1. **Benefit Creator** (Merchant/Partner) — creates promotional offers via a 6-step wizard
2. **Network Orchestrator** (Mastercard Admin) — reviews and approves deals against governance rules
3. **Issuer Publisher** (Bank) — activates and publishes approved deals to customers

## Running the App

No build step required. Serve the static files:

```bash
python3 -m http.server 8000
# or
npx http-server
```

Then open `http://localhost:8000`. The app also works by opening `index.html` directly in a browser.

## Architecture

**Single-file vanilla JS SPA** — no framework, no npm, no build toolchain.

| File | Purpose |
|------|---------|
| `index.html` | Minimal HTML shell, loads `app.js` and `styles.css` |
| `app.js` | All application logic (~1700 lines) |
| `styles.css` | All styles (~1382 lines) with CSS custom properties design system |
| `assets/` | Images and SVG assets |

**External dependencies** (CDN only):
- Phosphor Icons v2.1.1
- Google Fonts (Poppins, Plus Jakarta Sans)

### State Management

A single global `state` object is the source of truth for all UI. It persists to `localStorage` (version-controlled via `STATE_VERSION`).

Key state paths:
- `state.screen` — current route
- `state.wizardStep` — offer creation wizard step (0–5)
- `state.offer` — the demo Zappos deal data
- `state.workflow` — approval status across all actors
- `state.governance` — review timestamps and feedback
- `state.activation` — issuer activation details

State helpers: `getValue(path)` / `setValue(path, value)` use dot-notation. `setValue` automatically persists state and re-renders.

### Routing

Hash-based: `window.location.hash` → `parseHash()` → `state.screen`. `navigate(screen)` changes the screen, syncs the hash, and triggers a full re-render.

### Rendering

`render()` calls `renderScreen()` which dispatches to one of ~17 `render*()` functions based on `state.screen`. Every render is a full DOM replacement of `#app`. The `shell(content)` helper wraps content with the sidebar and topbar.

### Event Handling

All events are delegated on `document`. UI elements use `data-*` attributes:
- `data-nav` — navigation
- `data-action` — triggers workflow actions (register, submit, approve, reject, activate, etc.)
- `data-bind` — two-way form binding to state paths
- `data-open-modal` / `data-close-modal` — modal control

### Screens

| Actor | Screen keys |
|-------|-------------|
| Landing | `index` |
| Merchant | `merchant/home`, `merchant/auth`, `merchant/profile`, `merchant/wizard`, `merchant/review`, `merchant/deals` |
| Network | `network/queue`, `network/detail`, `network/ai`, `network/rules`, `network/library` |
| Issuer | `issuer/library`, `issuer/activation`, `issuer/redemption`, `issuer/analytics`, `issuer/lifecycle` |

### Styling

CSS custom properties define the full design system (typography scale, spacing, colors, radii). Brand colors: Mastercard Orange `#ff9e1b`, Red `#eb001b`. Semantic colors: success `#197a43`. All component styles are hand-written — no CSS framework.

## Demo Data

The hardcoded demo scenario is a Zappos Valentine's Day 2-for-1 Shoes offer. Personas:
- **Merchant:** Nina Watts (Zappos Merchant Admin)
- **Network:** Mastercard Governance (Network Admin)
- **Issuer:** Avery Coleman (Waltmart Offer Manager)
