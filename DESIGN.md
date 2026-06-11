# Design

## Theme

Default **dark**. A founder reading the Pain section at 11pm on a Monday after a week of inbox-triage hell, on a 14" laptop in a dim home office. The headline glows in cream against near-black; the cognac accent reads as warmth, not alert. Light mode is supported (toggle persists in localStorage) but is the secondary state, not the default.

## Color Strategy

**Committed.** Cognac (`#A0623A` / `--gold`) is the single brand colour and carries roughly 30–40% of the surface across CTAs, eyebrows, serif accents, links, and ticker pills. The rest is a tinted-neutral scale toward warm-black, never pure `#000`. One serif-accent role uses cream (`#E8DCC4` / `--cyan`).

## Palette (dark theme)

| Token | Value | Role |
|---|---|---|
| `--void` | `#0C0C0C` | Page background, footer |
| `--ink` | `#161616` | Surface 1 (cards, modals) |
| `--ink-2` | `#1F1F1F` | Surface 2 (raised cards) |
| `--ink-3` | `#2A2A2A` | Surface 3 (inset wells) |
| `--rim` | `rgba(255,255,255,0.07)` | Subtle border |
| `--rim-2` | `rgba(255,255,255,0.13)` | Standard border |
| `--rim-3` | `rgba(255,255,255,0.20)` | Hover/emphasis border |
| `--text` | `#F2EEE6` | Primary text (warm white, never pure white) |
| `--text-soft` | `#B6B0A6` | Body/secondary text |
| `--text-mute` | `#8A8480` | Tertiary/metadata text |
| `--gold` | `#A0623A` | Brand accent (cognac), CTAs |
| `--gold-2` | `#7A4626` | Darker cognac (bottom of button gradients) |
| `--gold-3` | `#C58154` | Lighter cognac (links, eyebrow text, hover) |
| `--gold-soft` | `rgba(160,98,58,0.20)` | Accent backgrounds, soft borders |
| `--cyan` | `#E8DCC4` | Cream accent (serif emphasis, ticker dots) |
| `--cyan-2` | `#C5B596` | Darker cream |
| `--burg` | `#663333` | Brand mark burgundy (logo triangle) |
| `--sand` | `#D4A574` | Brand mark sand (logo base stripe) |

## Palette (light theme overrides)

| Token | Value | Role |
|---|---|---|
| `--void` | `#F4EFE6` | Warm cream background |
| `--text` | `#1A1614` | Deep ink |
| `--gold` | `#A0623A` | Cognac stays |
| Background-marks opacity dropped to ~0.06 so triangles don't dominate |

## Typography

- **Display + body sans:** Geist, 400/500/600/700/800. Fallback chain: `-apple-system, BlinkMacSystemFont, ui-sans-serif, system-ui, sans-serif`.
- **Serif accent (emotional words inside h1/h2):** Cormorant Garamond, 700, italicised optical feel via `font-style: normal; letter-spacing: -0.012em`. Used on words like "AI", "build with AI", "busy work", "real engagements".
- **Mono (eyebrows, dates, metadata):** Geist Mono, 500/700.
- `font-display: optional` on Google Fonts so a slow first paint never blocks render.

### Scale (hero h1 → body)

| Element | Size | Weight | Line height | Letter-spacing |
|---|---|---|---|---|
| Hero h1 (home) | `clamp(40px, 5vw, 72px)` | 800 | 1.05 | -0.035em |
| Sub-page hero h1 | `clamp(36px, 4.6vw, 64px)` | 800 | 1.08 | -0.032em |
| Section h2 (`.display`) | `clamp(34px, 4.6vw, 62px)` | 800 | 1.02 | -0.035em |
| Card title (h3) | 17–22px | 700 | 1.25–1.3 | -0.02em |
| Body | 14–18px | 400–500 | 1.55–1.7 | -0.011em |
| Eyebrow | 14px UPPERCASE | 700 | 1.2 | 0.18em |
| Metadata (mono) | 11–13px UPPERCASE | 500–700 | 1 | 0.06–0.12em |

`text-wrap: balance` on every hero h1. Body line length capped via `max-width: 56ch` on sub-paragraphs, `46ch` on hero h1.

## Spacing & Layout

- Wrap: `--max: 1180px`, `--gutter: clamp(20px, 4vw, 40px)`.
- Section rhythm token: `.sec { padding: 64px 0 }`, `.sec--hero { padding: 48px 0 32px }`, `.sec--tight { padding: 16px 0 64px }`. Tablet drops to 56px.
- Grid pattern: 3-col → 2-col @ 980px → 1-col @ 620px for industry/news cards.
- Body has `min-height: 100vh` plus `padding-bottom: 80px` on mobile to reserve space for the sticky mobile CTA.

## Elevation

Three elevation steps. No drop-shadow-as-decoration; shadows always indicate hover or focus state.

| Step | Use | Style |
|---|---|---|
| Flat | Default surface | No shadow, `border: 1px solid var(--rim)` |
| Hover | Card lift on `:hover` | `transform: translateY(-4px to -5px)`, `box-shadow: 0 14px 32px -16px rgba(0,0,0,0.55)` |
| Modal | Paywall overlay | `box-shadow: 0 24px 60px -16px rgba(0,0,0,0.7)`, `var(--ink)` background |

## Components

### Buttons

- `.btn--gold` (primary): gold gradient, white text, `padding: 12–14px 18–28px`, `border-radius: 999px`, arrow SVG nudges +4px on `:hover`.
- `.btn--cyan-line` (secondary/ghost): cream border, transparent fill, same shape.
- `.btn-cta-pulse`: no-op class kept for HTML stability, animation removed per design.
- Mobile CTA: full-width inside `#stickyMobile`.

### Cards

- **`.ind-card`** (industries): 30px 28px padding, `border-radius: 18px`, hover lifts 5px + cognac glow via `::after` radial-gradient.
- **`.news-card`** (archive): aspect-ratio 16/10 thumbnail + 18px body padding, hover lifts 4px and border tints `--gold-soft`.
- **`.work-card`** (case studies): aspect-ratio 4/3 image area + 22px meta, hover same pattern.
- **`.svc`** (services tiles): 34px 28px padding, `min-height: 280px`, four-up at desktop, icon block with branded gradient backgrounds (cognac, sand, gold, burgundy).
- Gold CTA variants (`.ind-card--cta`, `.work-card--cta`): cognac-tinted gradient + `--gold-soft` border, used to close grids that would otherwise orphan.

### Navbar

- Fixed unified header: ticker strip (38px) + nav (88px).
- Backdrop blur: 6px idle, 10px scrolled. Lower than typical glass-mode, kept legible against any background.
- Mobile menu: full-screen overlay, `translateY(-100%)` to `translateY(0)`, 0.45s exponential ease-out.

### Paywall

- Article body has a `.paywall-gated` block that gets `filter: blur(8px); pointer-events: none; opacity: 0.5` until `body.is-subscribed` is set.
- `.paywall-modal` sits centered with `transform-origin: center` (correct exception per emil-design-eng: modals stay centered, popovers anchor to trigger).
- Subscribe stores `localStorage.lr-subscribed = '1'`, "Not now" stores `sessionStorage.lr-paywall-skipped`.

### Loader

- Single circle SVG ring (471 circumference) + LaunchRise triangle logo PNG centered.
- Spins continuously via CSS `@keyframes ptSpin 1.1s linear infinite`.
- Only fires on internal link clicks (departure), never on page load. Clears on `pageshow` (BFCache) and `pagehide`.

## Motion

- Easing tokens:
  - `--ease-out: cubic-bezier(0.22, 0.7, 0.2, 1)` (exponential-feel for everything entering or hovering).
  - `--ease-spring: cubic-bezier(0.34, 1.4, 0.64, 1)` (used sparingly on card hover-lift).
- Durations: 160–250ms for hover/press, 300–450ms for menu/modal entry, 1100ms continuous for loader spin.
- Only `transform` and `opacity` are animated. No layout-property transitions.
- `prefers-reduced-motion` adds `.reduced-motion` to `<html>` and the loader respects it.

## Background Decoration

Scattered triangle marks (`.bg-marks .bm`) drawn from `brand_assets/launchrise_logo.png` at 0.06–0.10 opacity across the full document. Parallax-shifted on scroll at varying factors per mark. `overflow: hidden` on the container prevents marks below the footer from extending document height.

## Iconography

Inline SVG only (no icon font, no library). 22–28px, `stroke-width: 2`, `stroke-linecap: round`. Currently 19 industry icons + 8 social brand icons + arrow/checkmark/close utilities. Currency toggle uses `$ £ €` glyphs, not images.

## Currency & Theme Toggles

- **Currency toggle:** USD / GBP / EUR three-way pill at top of pricing section. Persists in `localStorage.lr-currency`. Updates all `[data-usd]` price strings using fixed rates (`1 USD = 0.79 GBP = 0.92 EUR`).
- **Theme toggle:** Sun / moon two-way pill, `position: fixed; right: 20px; bottom: 20px`. Persists in `localStorage.lr-theme`.

## Sub-page Build

Sub-pages (`services.html`, `academy.html`, `pain.html`, `our-work.html`, `news.html`, and 6 individual article pages) are regenerated from `index.html`'s shell via `node build-subpages.mjs`. Edit `index.html` for shared shell changes (nav, footer, CSS); edit `build-subpages.mjs` for per-page content.
