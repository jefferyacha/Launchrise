# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Deployment Rule — localhost first, push only on my say-so
- **Never push design or code changes to GitHub or Vercel automatically.** Not after a tweak, not after a "looks done" moment, not even if the change is small.
- Every change lands **on localhost only** first. Show me at `http://localhost:3000` (or the project's preview URL) and wait.
- I will review the change in the browser. When I'm satisfied I'll say something like "deploy", "push it", "looks good ship it", "commit and push", or similar explicit go-ahead.
- **Only after that explicit approval** do you run `git add` / `git commit` / `git push`. The push to `main` is what triggers the live Vercel deploy, so the push *is* the deploy — treat it that way.
- If I just say "save this" or "looks good", that is NOT a push instruction. Save = commit locally only (or don't commit at all). Push = a separate, explicit step I have to ask for.
- If you're ever unsure whether I'm asking you to deploy, ask. Don't guess in the direction of pushing.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- **Do NOT use the screenshot tool for animation work.** Screenshots are still frames — they can't capture motion, scroll-driven parallax, hover states, transitions, or anything time-based. If the change I'm asking for is animation, motion, easing, parallax, scroll behavior, or any kind of moving element, **write the code and ask me to look at it in my browser.** I'll tell you how it feels. Save Puppeteer for static work — layout, spacing, typography, color, hierarchy, contrast.
- Rule of thumb: if you can't reasonably evaluate the change from a single still image, don't screenshot. Ship the code, point me at localhost, wait for my read.
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/nateh/.cache/puppeteer/`.
- **When you do screenshot — always from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color

---

## LaunchRise — anti-AI-slop rulebook (lessons learned, May 2026)

Hard-won rules from three rebuilds of the LaunchRise landing page. Read before touching `index.html` or any LaunchRise creative work.

### Layout & composition
- **Never ship the left-text + right-device-mockup hero.** That's the Blotato / Lovable / generic-SaaS layout. The user has rejected it explicitly. Hero must be full-bleed cinematic, centered, with the 3D agent scene as the centerpiece.
- **7 content sections + a closer.** Not 14. Not 3. The current order is: Hero → Stack strip → Pain → Services → Process → Receipts → Pricing → Mastermind → (closer: Loom + FAQ + Final CTA + Footer). Adding a section means removing one.
- **First-section grid is mandatory.** The KPI 4-tile band beneath the 3D agent is the "grid in the first part of the site" the user asked for. Don't remove it.

### Aesthetic
- **Cold premium tech — never warm.** No cream, no burgundy, no Fraunces, no terracotta, no archival/journal feel. The `warm-ui` skill is **explicitly banned** on LaunchRise.
- **Palette is fixed:** `--void #050714`, `--ink #0A0E22`, `--cyan #5BE3FF` (AI / live state), `--gold #E5B864` (CTAs + KPI numerals). No purple, no magenta, no violet. Anywhere.
- **Glass aesthetic, 3D UI.** Every elevated surface uses `backdrop-filter: blur(20-28px) saturate(1.5)` with 1px rim highlights. Cards use `perspective(1200px)` with up to 4° rotateX/Y tilt on hover. Layered depth in four z-planes (base → glass-low → glass-mid → glass-high).

### Typography
- **Banned fonts on LaunchRise:** Plus Jakarta Sans, Space Mono. (They're the brand-guideline fonts but the user has overridden them.)
- **Required fonts:** Geist Sans (display + body), Geist Mono (codes / tickers / KPI units), Instrument Serif Italic (single accent word per headline). All Google Fonts. No Inter, no system fallback. One italic accent word maximum per headline.

### The brand mark
- **Big and noticeable.** 64 px tall in desktop nav, 48 px on mobile. Wordmark at ~28 px.
- **The "tic" gesture.** Once per section as the page scrolls into it, the cyan sand-bar at the base of the nav mark pulses cyan → gold → cyan over ≤ 1 s. Debounced — one tic per section per scroll-direction. This is the only animated tell on the page that the icon owns; nothing else gets a comparable gesture.
- **Watermark sentinel** in the Receipts section — the giant translucent mark at 6% opacity pinned to the right edge.

### Copy
- **Audience:** mid-technical operators (HubSpot users, never opened a terminal). Above the FAQ fold, no "eval suite", "VPC", "RAG", "observability", "context window". In the FAQ, those words are allowed because the technical buyer is looking for them.
- **Use the `copy-craft` skill** for every copy change. Run every headline through the AI-slop, jargon, and reading-level filters before commit.
- **Apply, don't book.** Every "Book a call" / "Get started" is "Apply for a 30-minute audit". Site-wide.
- **Headlines are 1 sentence, max 12 words.** Address the reader (you / your), not the agency (we / our).
- **Concrete real-world illustrations, not abstract sweep-bars.** The Pain section uses an inbox, a dashboard rebuilding, and an invoice filling out — these are the user-approved illustrations. Don't replace with abstract gradients.

### Tech-code restraint
- Tech codes (`R · 02 / TRAP`, `Build #LR-0014`) live only in: the top ticker, the footer index, and inside the hero case-card mock. Never on section headers. Saturated, they alienate the mid-tech audience.

### "Trusted by" strips
- **Don't use real brand logos as a trust strip** if the firms aren't actually clients. The current "THE STACK WE INTEGRATE INTO" strip uses stylised SVG icon approximations (not pixel-copies) and the framing line says "integrate into", not "trusted by". This sidesteps trademark issues.

### Ethics
- **No fake live data.** The visitor-counter chip and recent-activity notifications were dropped from the build — both read as fabricated real-time data and erode trust. Don't reintroduce them without permission.
- **Placeholder content is labelled.** The case-study card has a "Sample case" tag. The Ekemini Edet photo is a monogram circle until a real photo is uploaded. Never present a placeholder as real social proof.

### Deployment
- **Localhost first, always.** `node serve.mjs` on `http://localhost:3000`. The user reviews in the browser. Only push to `main` on explicit "deploy / ship / push it / commit and push" instruction. The push *is* the Vercel deploy. Treat it as production.

### v3 → v4 lessons (May 2026 round)
- **No em-dashes (`—`) in any rendered copy.** Ever. Use periods, semicolons, or sentence splits. The user has flagged this three times. It is the single biggest AI-slop signal.
- **No "the LaunchRise studio" or "in residency" eyebrow text.** The user rejected both. The brand mark + name speak for themselves. Section eyebrows are fine as long as they describe what the section is (e.g. "what good looks like", "three ways to start").
- **Logo colours must match the PNG exactly.** Use brand burgundy `#663333` for the outer triangle, pure white `#FFFFFF` for the inner flick, and sand `#D4A574` for the bar. Do NOT lighten them to fit the page palette. The mark stands out by being on-brand-exact.
- **Roboto Condensed is the label font on LaunchRise.** Not Cormorant Garamond. Not Instrument Serif italic. Not Geist Mono uppercase tracked. Use Roboto Condensed 500 for eyebrows / tags / KPI labels / pain stat pills / service tags / founder labels / mastermind text / FAQ numbers / guarantee line. Sentence case. No letter-spacing tricks. Keep headline accent words (`em` inside h1/h2) as Cormorant Garamond Bold cognac.
- **The 3D agent is ambient, not the hero.** Position it as a subtle backdrop behind the headline at ~40-50% opacity, or as a small accent off to the right. Never let it compete with the headline. The user said "I want it to be simple. I don't want it to be too much."
- **Background brand marks scroll with the page, with subtle parallax.** Marks live throughout the document (not fixed-viewport), positioned at ~10-15 vh intervals. JS adds light parallax via `transform: translateY(scrollY * -0.15)` so they drift slowly as you scroll. The whole page feels like brand wallpaper.
- **FAQ accordions open on hover, not just click.** `mouseenter` sets `details.open = true`. Click still toggles. The page feels alive without requiring action.
- **Case studies are a vertical stack of 4 (not one card + one testimonial).** Each row: client name + problem in one line + outcome number + "Read the build →". Staggered scroll reveal. No standalone testimonial avatar block. The numbers ARE the social proof.
- **Founder bio has NO years-of-experience claim.** Ryan does not have "five years" or any other number. Stick to scope ("AI agents and automations for ops teams across Lagos, London, and Dubai") and point of view.
- **Brand tagline is "an AI consulting firm".** Not "an AI consulting studio out of London & Dubai", not "AI Studio · UK · UAE", not anything longer. Short.
- **Navbar transparency/blur shifts on scroll.** Default state: 74% alpha + 18 px blur. Scrolled-past-hero state: 55% alpha + 32 px blur. Content shows through more as the user goes deeper. Implemented via `header.nav.scrolled` class toggled by a scroll listener at ~100 px.
- **The KPI grid below the hero is gone.** It was redundant with the Receipts stats. The user removed it.

### Assets reference
- `brand_assets/founder.jpg` — Ryan Acha photo, used in testimonial avatar and mastermind host slot.
- `brand_assets/signature.png` — dark-ink-on-white original; rendered white-on-dark via `filter: invert(1) brightness(1.35) contrast(1.15)` + `mix-blend-mode: screen`.
- `brand_assets/LaunchRise_Brand_Guidelines.svg` — original brand guideline (kept for reference but its colour and font picks are overridden for the web by the rules above).

### Self-review
- **4 mandatory passes** before reporting any rebuild complete: Layout & rhythm → Type & colour → Copy & feeling → Responsive & resilience. Each pass takes screenshots, reads them back, and rejects on first failure.
- **Never screenshot animation work** for review. Static layout/typography/colour only — the user has flagged this multiple times.

### v4 → v5 lessons (do not repeat)
- **Logo: never trace an SVG approximation of a user's brand mark.** If the source is a PNG, render the PNG with `<img>`. Pixel-exact beats "designable". A traced SVG will always lose precision against a raster. Inline SVG is only acceptable when the user supplies the `.svg` / `.ai` / `.eps` source.
- **Font scope creep is AI-slop.** When introducing a new label font, apply it to ONE narrow class. Never sweep a new font across nav links, brand tags, eyebrows, ticker pills, and KPI labels in the same pass. The user rejected Roboto Condensed in v5 for exactly this reason. Default rule: the site is Geist Sans + Cormorant Garamond accents. New fonts must earn their place one surface at a time.
- **No forced casing on labels or taglines.** No `text-transform: lowercase` on a tagline like "An AI consulting firm". No `text-transform: uppercase` on eyebrows, tier captions, KPI labels, ticker pills, mastermind meta, or any other small-text surface. Authors content in sentence case (capitalise first word + proper nouns). Tracked spacing for tiny micro-meta only.
- **FAQ accordions auto-close siblings.** If hover-to-open is the interaction, also close any other open item before opening the new one. Same for clicks. Otherwise panels accumulate and the page feels broken.
- **3D agent must track the cursor from `window.mousemove`**, not from canvas pointer-events. The agent sits behind text; if you bind on the canvas you lose tracking the moment the cursor crosses text. Listen on `window`, normalise cursor to the stage's center, smooth via lerp, drive `agentRoot.rotation.y` + `head.rotation.y/x`.
- **Background brand marks: two-layer transforms.** Outer wrapper gets JS scroll-parallax + base rotation. Inner wrapper gets the CSS idle-float animation. Marks fade in on viewport entry. Place along the page edges (left/right ≤ 6%) to avoid colliding with headlines. 18-20 marks across the full document height (6vh → 254vh) is the right density.

