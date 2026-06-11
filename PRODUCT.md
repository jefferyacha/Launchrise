# Product

## Register

brand

## Users

Owners and operators of services businesses with 10–200 employees: PPC agencies, dental practices, regional real-estate operators, logistics companies, creative/content agencies, education and hospitality groups. Many are in Lagos, London, and Dubai. They run lean teams that lose 30+ hours a week to inbox triage, manual quoting, weekly reporting, and follow-ups. They suspect AI can take that work but they have been burned by vendors who sold demos and shipped nothing, or who scoped six-month engagements when the actual job was six weeks. They want a fixed-price, founder-led team that will tell them in plain English what to build, ship it in production, and walk away.

The site exists to convert that visitor into a 30-minute Cal.com audit booking. Secondary: subscribe to the news archive so we stay in their inbox while they decide.

## Product Purpose

LaunchRise is an AI consulting firm that builds production AI agents and automations for services businesses. The website is a brand surface: it sells the engagement, not a product. Success looks like a qualified audit booking from a real operator, plus newsletter growth that compounds month over month. The site has to do three things in order: prove we understand the operator's actual problem (the Pain page), prove we have shipped this work before (Our Work, Numbers Don't Lie, Industries), and make the next step obvious (Get in Touch / Apply for a 30-minute audit, linking to Cal.com).

## Brand Personality

Three words: **confident, editorial, founder-led.**

Voice: short sentences, plain English, no marketing softeners. Periods, not em-dashes. UPPERCASE eyebrows, sentence case body. Serif accents (Cormorant Garamond) on the emotional words inside sans-serif headlines: "still doing", "busy work", "build with AI", "real engagements". The voice is closer to a respected operator's Substack than a SaaS landing page. Numbers are concrete: $90,000/month, 412 hours reclaimed, 6-week median ship time, 20+ industries. We never say "scale", "leverage", "synergy", or "unlock value".

Emotional goal: the visitor reads two headlines and feels seen. The visitor reads the Pain section and recognises their own week. The visitor reads the engagement pill ($5K → $10K–$50K) and feels relief that we said the number out loud.

## Anti-references

- **Generic SaaS purple-gradient landing pages.** No purple-to-pink gradients, no gradient text, no "AI-powered" headers, no isometric vector hero illustrations.
- **Bro-marketer Gumroad / agency-slop sites.** No "I made $1M with this one trick", no countdown timers, no urgency-manipulation copy, no animated pulse buttons (we removed those when they read as "unprofessional"), no stock-photo grinning-team hero.
- **AI-template landing pages.** No "Trusted by" logo wall of fake clients. No "10x your productivity". No em-dashes. No three-card "Why us / How it works / Get started" template. No identical-icon grids with identical-length text.
- **Big-consulting corporate (Accenture, Deloitte).** Not navy-and-grey, not stock photography of people pointing at screens, not "Industries we serve" as a pure dropdown.

## Design Principles

1. **Practice what you preach.** We build AI systems for operators who care about craft, so the site has to feel crafted. Bad animations, lazy typography, and ticker pills that wrap on mobile would all betray the pitch. Polish is part of the offer.
2. **Numbers over adjectives.** Anywhere there could be a vague benefit claim, replace it with a concrete number from a real engagement. $90,000/month beats "growing revenue". 412 hours beats "saves time".
3. **Show the human.** Founder-led means the founder shows up. Ryan's name, signature, and bio are not optional decoration: they are the differentiator against agencies that hide behind a logo.
4. **Editorial restraint over decorative density.** Generous typographic space. One accent colour (cognac), one cream, one near-black. Background triangles are decoration, not content. The page earns its visual moments (the 3D agent, the gold ring loader, the "AI" serif accent), it does not spend them everywhere.
5. **The next step is always Cal.com.** Every CTA goes to the same destination: `cal.com/launchrise/audit`. We do not split conversion goals.

## Accessibility & Inclusion

WCAG 2.1 AA floor. Specifics already wired:

- Light/dark theme toggle persisted in localStorage; default dark on first visit.
- `prefers-reduced-motion: reduce` honoured by the loader and reveal animations.
- Tap targets ≥44px on mobile (mobile nav links bumped to min-height 44px).
- `:focus-visible` rings on interactive elements, never just `:focus` (avoids mouse-click outlines).
- Single-scrollbar layout, no horizontal overflow at 360 / 768 / 1440.
- Alt text on every meaningful image, `aria-label` on icon-only controls.
- Theme toggle never coerces light-mode users into dark, and vice versa.

Known regional considerations: visitors from low-bandwidth networks in West Africa and parts of MENA. Therefore: lazy-loaded thumbnails, sub-300KB total page weight on news.html after the first load, `display=optional` Google Fonts so a slow first paint never blocks the headline.
