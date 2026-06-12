/**
 * build-subpages.mjs
 * Rebuilds all sub-pages (our-work, services, academy, pain, news, blog) from
 * index.html by replacing the content between <!-- HERO --> and <footer class="foot">
 * with page-specific HTML. Run after any edit to index.html that changes the
 * shared shell (nav, footer, header, styles).
 *
 *   node build-subpages.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.dirname(fileURLToPath(import.meta.url));

function rebuild(file, title, contentHTML) {
  const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  let out = idx.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  const startMarker = '  <!-- HERO -->';
  const endMarker = '  <footer class="foot">';
  const s = out.indexOf(startMarker);
  const e = out.indexOf(endMarker);
  if (s < 0 || e < 0) throw new Error(`markers not found: s=${s} e=${e}`);
  out = out.slice(0, s) + contentHTML + '\n\n' + out.slice(e);
  // Rewrite bare anchor links to point back to the homepage section.
  // On sub-pages, #about / #pricing / etc. don't exist — they live on index.html.
  out = out.replace(/href="#(about|services|pain|receipts|pricing|academy|faq|process|work|stack|founder|news)"/g, 'href="index.html#$1"');
  // Inject Home link on subpages (it's removed from index.html so home doesn't link to itself).
  out = out.replace(
    '<nav class="nav-links" aria-label="Primary">',
    '<nav class="nav-links" aria-label="Primary">\n        <a href="index.html">Home</a>'
  );
  out = out.replace(
    /<nav>\s*<a href="pain\.html">Pain<\/a>/,
    '<nav>\n      <a href="index.html">Home</a>\n      <a href="pain.html">Pain</a>'
  );
  // Mark the current page with aria-current so the nav highlights it.
  // For news-*.html subpages, highlight the parent "News" tab instead.
  // For case-study-*.html subpages, highlight the "Our work" tab.
  const currentNav = /^news-/.test(file) ? 'news.html'
    : /^case-study-/.test(file) ? 'our-work.html'
    : file;
  out = out.split(`href="${currentNav}"`).join(`href="${currentNav}" aria-current="page"`);
  fs.writeFileSync(path.join(ROOT, file), out);
  console.log('rebuilt', file);
}

const heroBlock = (eyebrow, headline, sub) => `  <section class="sec sec--hero" id="hero" data-section>
    <div class="wrap" style="text-align: center;">
      <span class="eyebrow reveal" style="justify-content: center;">${eyebrow}</span>
      <h1 class="reveal" style="font-size: clamp(36px, 4.6vw, 64px); line-height: 1.08; letter-spacing: -0.032em; font-weight: 800; margin: 16px auto 24px; max-width: 44ch; text-wrap: balance;">${headline}</h1>
      ${sub ? `<p class="sub reveal" style="font-size: 18px; line-height: 1.55; color: var(--text-soft); max-width: 56ch; margin: 0 auto 32px;">${sub}</p>` : ''}
    </div>
  </section>
`;

const auditCTA = `<a href="https://cal.com/ryanacha/audit" target="_blank" rel="noopener" class="btn btn--gold btn-cta-pulse">Let's talk
  <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
</a>`;

// ============================================================
// CASE STUDIES
// Two-column layout modeled on leftclick.ai:
//   LEFT SIDEBAR (sticky): back button, image, summary paragraph, service tags
//   RIGHT CONTENT: h1 client name, subtitle, Outcomes / Challenge / Solution cards
// Images are Unsplash editorial photography (placeholders, swap with real
// client photos as they become available).
// No em dashes, en dashes, or arrow characters in body copy.
// ============================================================

const CASE_STUDIES = [
  {
    slug: 'falcon-freight',
    client: 'Falcon Freight Services',
    subtitle: 'Freight Forwarding & Customs Clearance, Dubai · 2026',
    image: 'https://images.unsplash.com/photo-1691591765923-3bd6f12f4209?w=2400&h=1800&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5&q=92&auto=format',
    headline: `Routine client questions answered in under a minute. Knowledge that no longer walks out the door.`,
    summary: `We helped Falcon Freight Services, a 70 person freight forwarder moving shipments through Jebel Ali port and onward by road, end their dependence on a handful of senior agents by building a system that reads across shipment data, customs records, rate agreements, and port rules and answers coordinator questions in plain language, with the source document on screen.`,
    tags: ['Knowledge Retrieval', 'Operations AI', 'Customs Intelligence'],
    broken: `Falcon's knowledge was scattered across four systems. Shipment records in one platform, customs documentation in another, client rate agreements in email and spreadsheets, and the rules for each port and free zone living in the heads of a few veteran agents. When a client called asking why a container was held or what the duty would be on a new shipment, a coordinator might spend half an hour chasing the answer, or worse, interrupting a senior agent mid task. The business was dangerously dependent on its most experienced people.`,
    built: [
      `A retrieval layer that stitched the scattered records (shipment data, customs documentation, rate agreements, port and free zone rules) into one place the system could query reliably. The hard part was the data work, not the chatbot.`,
      `A natural language interface where coordinators ask plain questions like what is the hold reason on shipment 8842 or what rate did we agree with this client for reefer containers, and get a clear answer in seconds.`,
      `Source citations on every answer, with the underlying document on screen so coordinators can trust the response and forward it to a client without checking it twice.`,
      `A safety layer that refuses to guess. When a rate or customs rule isn't clearly recorded, the system says so and points to who can confirm, rather than risk a wrong duty figure.`,
    ],
    stats: [
      { num: '<1', unit: 'min', label: 'to answer a routine client query, down from 20 to 30 minutes' },
      { num: '+1', unit: 'FTE', label: 'of coordinator time recovered each week, no new hires' },
      { num: '1', unit: 'wk', label: 'new coordinator ramp time, down from roughly 3 months' },
    ],
  },
  {
    slug: 'alpha-renovations',
    client: 'Alpha Renovations',
    subtitle: 'Home Improvement & Renovation, London · 2026',
    image: 'https://images.unsplash.com/photo-1758565811352-a439bd6f956e?w=2400&h=1800&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5&q=92&auto=format',
    headline: `Quote turnaround from 5 days to 24 hours. £42k in quotes that would have gone unanswered.`,
    summary: `We helped Alpha Renovations, a London home improvement firm running kitchens, bathrooms, loft conversions, and full house renovations, fix a quoting bottleneck that was costing them roughly half their incoming leads. Six week pilot, three systems shipped.`,
    tags: ['Quote Automation', 'Lead Intake', 'Project Comms'],
    broken: `Alpha was winning the work it could quote. The problem was the quoting. Each estimate took a senior surveyor four to six hours of site visits, measuring, calling trades for material prices, and writing the document. The team was capped at five or six quotes a week. Anything beyond that sat in the inbox and went cold. They were quoting around 55% of their incoming leads and turning down the rest by accident.`,
    built: [
      `An AI quote builder that takes photos of the space, extracts measurements, pulls trade and material prices from their supplier accounts, and produces a line item estimate in under 90 seconds for the surveyor to review.`,
      `A lead intake assistant that handles the first response to every enquiry, qualifies the project, captures the photos and brief, and books the survey directly into the team's diary.`,
      `A project comms hub that gives each client a single thread for photo updates, change orders, and payment milestones, so trades and clients stop crossing wires in WhatsApp.`,
      `A win loss tracker that logs why every quote was won or lost, and feeds that data back into the quote builder so pricing tightens with every cycle.`,
    ],
    stats: [
      { num: '24', unit: 'h', label: 'quote turnaround, down from 5 days' },
      { num: '82', unit: '%', label: 'incoming leads now quoted, up from 55%' },
      { num: '£42', unit: 'k', label: 'in quotes won during the six week pilot that would have gone unanswered' },
    ],
  },
  {
    slug: 'acre-holt',
    client: 'Acre & Holt',
    subtitle: 'Commercial Real Estate Brokerage, London · 2026',
    image: 'https://images.unsplash.com/photo-1654292541857-9d5a6d8f3ef3?w=2400&h=1800&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.5&q=92&auto=format',
    headline: `Follow up coverage from 56% to 89% in the pilot quarter. Twelve stalled deals reopened.`,
    summary: `We helped Acre & Holt, an eight broker firm running £2M to £15M commercial deals, stop losing warm leads to slow follow up by building a morning brief, an AI drafting agent, and an auto update layer on top of their existing CRM. Six week pilot, then rolled out to the full team.`,
    tags: ['Follow Up Automation', 'Sales Operations', 'CRM Integration'],
    broken: `Most deals aren't lost because the offer was bad. They're lost because the follow up happens too late, or not at all. At Acre & Holt, brokers were running 12 to 15 meetings a week each. The CRM was being updated, but updates aren't action. Warm leads were going cold inside three days while the broker was already in the next meeting, on the next call, on the way to the next viewing.`,
    built: [
      `A morning brief that pulls every meeting from yesterday, summarizes it from the recording, and surfaces the leads still owed a reply.`,
      `A drafting agent that writes the follow up in the broker's voice, pulling context from the meeting, the deal stage, and previous touchpoints.`,
      `A one click approval inbox so each broker reviews their drafts in one place and sends or edits in a single click.`,
      `An auto update layer that pushes the result back into the CRM, books the next meeting if the reply lands, and flags the lead for reengagement if it goes quiet.`,
    ],
    stats: [
      { num: '1', unit: 'h', label: 'weekly follow up admin per broker, down from 4 hours' },
      { num: '89', unit: '%', label: 'follow up coverage within 24h, up from 56%' },
      { num: '+17', unit: '%', label: 'second meetings booked in the pilot quarter' },
    ],
  },
];

const csCard = (cs, i) => `        <a class="work-card reveal-item" style="--i:${i}" href="case-study-${cs.slug}.html" aria-label="${cs.client} case study">
          <div class="work-img work-img--photo" aria-hidden="true" style="background-image: url('${cs.image}');">
            <span class="work-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </span>
          </div>
          <div class="work-meta">
            <h3 class="work-name">${cs.client.replace(/&/g, '&amp;')}</h3>
            <p class="work-result">${cs.headline}</p>
          </div>
        </a>`;

const workCardPhotoStyles = `
  <style>
    .work-card .work-img--photo {
      position: relative;
      background-size: cover !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      overflow: hidden;
    }
    /* Play-button affordance: always visible, smaller, 3D pebble feel */
    .work-card .work-play {
      position: absolute; top: 50%; left: 50%; z-index: 2;
      transform: translate(-50%, -50%);
      width: 52px; height: 52px; border-radius: 50%;
      background: linear-gradient(180deg, #FBF7EF 0%, #D9D2C2 100%);
      display: grid; place-items: center;
      color: #161616;
      box-shadow:
        inset 0 1.5px 0 rgba(255,255,255,0.95),
        inset 0 -1.5px 0 rgba(0,0,0,0.12),
        0 0 0 1px rgba(0,0,0,0.18),
        0 2px 4px rgba(0,0,0,0.30),
        0 14px 30px rgba(0,0,0,0.55);
      transition:
        transform 0.4s var(--ease-spring),
        background 0.3s var(--ease-out),
        color 0.3s var(--ease-out),
        box-shadow 0.4s var(--ease-out);
    }
    .work-card:hover .work-play {
      transform: translate(-50%, -50%) scale(1.07);
      background: linear-gradient(180deg, var(--gold-3) 0%, var(--gold) 100%);
      color: var(--text);
      box-shadow:
        inset 0 1.5px 0 rgba(255,255,255,0.28),
        inset 0 -1.5px 0 rgba(0,0,0,0.20),
        0 0 0 1px rgba(0,0,0,0.18),
        0 4px 10px rgba(0,0,0,0.35),
        0 18px 38px rgba(160,98,58,0.50);
    }
    .work-card .work-play svg {
      width: 18px; height: 18px;
      margin-left: 2px;
      filter: drop-shadow(0 1px 0 rgba(255,255,255,0.35));
    }
  </style>`;

const ourWorkContent = workCardPhotoStyles + heroBlock('Our work', 'Real results from <em style="font-family: var(--serif); font-style: normal; color: var(--gold-3);">real engagements.</em>', 'Every project below was built, deployed, and managed by our team.') + `
  <section class="sec sec--tight" id="work" data-section>
    <div class="wrap">
      <div class="work-grid reveal-stagger">
${CASE_STUDIES.map((cs, i) => csCard(cs, i)).join('\n')}
        <article class="work-card reveal-item" style="--i:${CASE_STUDIES.length}"><div class="work-img" aria-hidden="true">Coming soon</div><div class="work-meta"><h3 class="work-name">More case studies</h3><p class="work-result">Rolling out as clients sign off on publication.</p></div></article>
        <a class="work-card work-card--cta reveal-item" style="--i:${CASE_STUDIES.length + 1}" href="https://cal.com/ryanacha/audit" target="_blank" rel="noopener" aria-label="Apply for an audit to see your industry shipped next"><div class="work-img" aria-hidden="true">Yours next?</div><div class="work-meta"><h3 class="work-name">Your industry, shipped next.</h3><p class="work-result">Apply for an audit. We'll tell you what we'd build, in plain English.</p></div></a>
      </div>
      <div class="work-foot reveal" style="margin-top: 60px; justify-content: center;">${auditCTA}</div>
    </div>
  </section>
`;

const ICONS = {
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.5 12.5a2 2 0 0 0 2 1.5h8.4a2 2 0 0 0 1.95-1.55L21.5 7H6"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 4 10 20"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l8-4 8 4v14M9 9h.01M13 9h.01M9 13h.01M13 13h.01M9 17h.01M13 17h.01"/></svg>',
  cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10 12 5l10 5-10 5z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 8h11v9H1zM12 11h6l3 3v3h-9z"/><circle cx="5" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 17 6-6 4 4 8-9"/><path d="M14 6h7v7"/></svg>',
  forecast: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 5-6"/></svg>',
  scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4 6 9l3 9h6l3-9z"/><path d="M12 3v18"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M3 21c0-4 3-6 6-6s6 2 6 6"/><path d="m16 11 2 2 4-4"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-7 8-13a8 8 0 1 0-16 0c0 6 8 13 8 13z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  megaphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v3l13 6V5L3 11z"/><path d="M16 8a4 4 0 0 1 0 8"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>',
  palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 0 20c1.5 0 2-1 2-2 0-1.5-1-2-1-3.5s1-2.5 2.5-2.5H18a4 4 0 0 0 4-4 10 10 0 0 0-10-8z"/><circle cx="7" cy="11" r="1.2" fill="currentColor"/><circle cx="11" cy="7" r="1.2" fill="currentColor"/><circle cx="16" cy="9" r="1.2" fill="currentColor"/></svg>',
  pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3 21 10 8 23H3v-5z"/><path d="m13 4 7 7"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8 11 8-4M8 13l8 4"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-2 8 9-12h-7z"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="14" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M7 6 9 3h6l2 3"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 3 7 7 .8-5.4 4.8 1.6 7L12 18l-6.2 3.6 1.6-7L2 9.8 9 9z"/></svg>',
  bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1.2" fill="currentColor" stroke="none"/><circle cx="9" cy="14" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="14" r="1.2" fill="currentColor" stroke="none"/><path d="M9 18h6"/></svg>',
};

const INDUSTRIES = [
  { icon: 'cart', title: 'E-commerce', desc: 'Product recommendation engines, automated email and abandoned-cart flows, inventory forecasting, and AI support that clears the routine tickets so your team only handles the hard ones.', tags: ['Email Automation', 'Product AI', 'Support Bots'] },
  { icon: 'bot', title: 'Custom bots & agents', desc: 'If you can describe the workflow, we can ship the bot. Voice receptionists, inbox triage, lead qualifiers, internal Q&A, scheduled research — autonomous workers that plug into the tools you already use and run 24/7.', tags: ['Chatbots & Voice', 'Workflow Agents', 'Always-On'] },
  { icon: 'building', title: 'Real estate & property', desc: 'Investor pipelines, deal sourcing, and market analysis, built on real data work. We already run Rightmove scraping, lead pipelines, and deal analysis for UK investors through Montage, scaled to £10k/month in sourced deal flow.', tags: ['Deal Sourcing', 'Investor CRM', 'Market Analysis'] },
  { icon: 'cap', title: 'Education', desc: 'Student onboarding, payment automation, and AI assistants that answer staff questions, generate reports, and schedule events by calling your systems directly. We built a tool-calling school admin AI, a full school management platform with native AI, and CanteenPay, a cashless canteen payment system.', tags: ['Payment Automation', 'Student Systems', 'AI Assistants'] },
  { icon: 'truck', title: 'Transport & logistics', desc: "Real-time tracking, booking automation, and route data for transport operators. We built KTransport, Nigeria's first real-time intercity bus-tracking platform.", tags: ['Real-Time Tracking', 'Booking Automation', 'Route Data'] },
  { icon: 'chart', title: 'Trading & forex', desc: 'Signal dashboards, automated reporting, and risk-aware alerting. We build the pipelines that turn raw market feeds into decisions your desk can act on.', tags: ['Signal Dashboards', 'Automated Reporting', 'Risk Alerts'] },
  { icon: 'forecast', title: 'Forecasting & prediction', desc: 'Custom prediction systems for demand, churn, price, and risk. We train models on your own data and wire them into the tools your team already uses.', tags: ['Demand Forecasting', 'Risk Models', 'Predictive Scoring'] },
  { icon: 'scale', title: 'Brokers & financial services', desc: 'Compliance-aware outbound, client onboarding, and AI document processing. We built a scraper that indexed 1,300+ court judgments into a searchable RAG system, surfacing precedent in seconds instead of paralegal hours.', tags: ['KYC Automation', 'Document AI', 'Outbound Compliance'] },
  { icon: 'users', title: 'HR & recruiting', desc: 'AI resume screening, automated candidate outreach, interview scheduling, and talent scoring. The same enrichment pipelines we build for sourcing cut weeks off time-to-hire.', tags: ['Resume Screening', 'Candidate Outreach', 'Hiring Funnels'] },
  { icon: 'pin', title: 'Local services', desc: 'Lead generation and booking automation for home services, cleaning companies, landscapers, and contractors. Outbound systems that fill calendars without anyone chasing leads by hand.', tags: ['Maps Scraping', 'Booking Automation', 'Review Management'] },
  { icon: 'megaphone', title: 'Digital marketing agencies', desc: 'End-to-end agency growth stacks: cold email outbound, client onboarding, AI reporting dashboards, and proposal generation, so you add clients without adding headcount.', tags: ['Cold Email', 'Client Onboarding', 'AI Reporting'] },
  { icon: 'target', title: 'PPC agencies', desc: 'Automated bid management, AI ad-copy testing, cross-platform reporting, and lead routing. We build the systems that run the accounts so the team can focus on strategy.', tags: ['Bid Automation', 'Ad-Copy AI', 'Cross Platform Reporting'] },
  { icon: 'palette', title: 'Creative agencies', desc: 'AI ad-creation workflows, copywriting automation, and brief generation that turn out performance-tested variations far faster than a manual team can.', tags: ['Ad Creation AI', 'Copy Automation', 'Creative Briefs'] },
  { icon: 'code', title: 'Software & SaaS', desc: 'Product-led growth automation, AI onboarding flows, churn-prediction models, and automated support that lifts activation and keeps users from quietly leaving.', tags: ['PLG Automation', 'Churn Prediction', 'AI Onboarding'] },
  { icon: 'share', title: 'LinkedIn & social media', desc: 'Automated outreach sequences, AI ghostwriting for executive accounts, and enrichment pipelines. We built the headless-browser data layer that makes personalization actually personal.', tags: ['Outreach Automation', 'AI Ghostwriting', 'Enrichment Pipelines'] },
  { icon: 'bolt', title: 'AI & automation agencies', desc: 'White-label AI systems, partner delivery infrastructure, and resellable automation stacks. We build the backend other agencies deploy under their own brand.', tags: ['White Label AI', 'Partner Delivery', 'Resellable Stacks'] },
  { icon: 'camera', title: 'Photography agencies', desc: 'Shoot scheduling, client delivery portals, and AI gallery curation, plus outbound to land corporate and wedding contracts.', tags: ['Scheduling', 'Client Portals', 'Outbound Lead Gen'] },
  { icon: 'settings', title: 'Managed service providers', desc: 'AI ticket triage, client health scoring, automated SLA reporting, and outbound for net-new clients. We cut resolution time and flag churn before it costs you the account.', tags: ['Ticket Triage AI', 'Health Scoring', 'SLA Automation'] },
  { icon: 'star', title: 'Hospitality & luxury', desc: 'Concierge automation, VIP client management, and AI booking systems for luxury travel and hospitality brands.', tags: ['Concierge AI', 'VIP Management', 'Booking Automation'] },
];

const industryCard = (it, i) => `        <a class="ind-card reveal-item" style="--i:${i}" href="https://cal.com/ryanacha/audit" target="_blank" rel="noopener" aria-label="${it.title}. Apply for an audit">
          <div class="ind-icon">${ICONS[it.icon]}</div>
          <h3 class="ind-title">${it.title}</h3>
          <p class="ind-desc">${it.desc}</p>
          <div class="ind-tags">${it.tags.map(t => `<span class="ind-tag">${t}</span>`).join('')}</div>
        </a>`;

const industriesGrid = `
  <section class="sec" id="industries" data-section>
    <div class="wrap">
      <div style="text-align: center; margin-bottom: 40px;">
        <span class="eyebrow reveal" style="justify-content: center;">Industries we ship for</span>
        <h2 class="display reveal" style="margin: 16px auto 12px; max-width: 26ch;">AI systems built for <em style="font-family: var(--serif); font-style: normal; color: var(--gold-3);">every vertical.</em></h2>
        <p class="sub reveal" style="font-size: 17px; color: var(--text-soft); max-width: 56ch; margin: 0 auto;">Pick your industry. We've shipped systems in it.</p>
      </div>
      <div class="ind-grid reveal-stagger">
${INDUSTRIES.map(industryCard).join('\n')}
        <a class="ind-card ind-card--cta reveal-item" style="--i:${INDUSTRIES.length}" href="https://cal.com/ryanacha/audit" target="_blank" rel="noopener" aria-label="Don't see your industry? Apply for an audit">
          <div class="ind-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div>
          <h3 class="ind-title">Don't see your industry?</h3>
          <p class="ind-desc">If your business runs on workflows, data, or customers, we've probably built something close. Send us the ugliest part of your operation and we'll tell you what we'd ship.</p>
          <div class="ind-tags"><span class="ind-tag ind-tag--gold">Let's talk →</span></div>
        </a>
      </div>
      <div class="work-foot reveal" style="margin-top: 56px; justify-content: center;">${auditCTA}</div>
    </div>
  </section>
`;

const servicesContent = heroBlock('How it works', 'Four things we build. <em style="font-family: var(--serif); font-style: normal; color: var(--gold-3);">All yours</em> in six weeks.', 'Start with the smallest one that clears your biggest bottleneck. No long contracts, no piling on tools when a simple workflow would do.') + `
  <section class="sec sec--tight" id="services" data-section>
    <div class="wrap">
      <div class="svc-grid reveal-stagger">
        <article class="svc svc-1 reveal-item" style="--i:0"><div class="svc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg></div><span class="svc-tag"><span class="ix">i.</span> the audit</span><h3>Tell us where it hurts.</h3><p>A two week audit. One page back. Where your money is leaking, what we'd build first, in plain English.</p></article>
        <article class="svc svc-2 reveal-item" style="--i:1"><div class="svc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2-7 4 14 2-7h6"/></svg></div><span class="svc-tag"><span class="ix">ii.</span> automations</span><h3>Replace the work your team hates.</h3><p>Inbox triage, lead routing, finance ops, internal reports. The boring middle layer most consultants skip.</p></article>
        <article class="svc svc-3 reveal-item" style="--i:2"><div class="svc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg></div><span class="svc-tag"><span class="ix">iii.</span> custom tools</span><h3>Give your team an AI teammate.</h3><p>One that knows your docs, your tools, your customers. Built for the way your team already works.</p></article>
        <article class="svc svc-4 reveal-item" style="--i:3"><div class="svc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 17.5h7M17.5 14v7"/></svg></div><span class="svc-tag"><span class="ix">iv.</span> integrations</span><h3>Plug AI into the tools you already use.</h3><p>Your CRM, your inbox, your contracts. We wire it in. You don't switch software.</p></article>
      </div>
    </div>
  </section>
${industriesGrid}`;

const academyContent = heroBlock('LaunchRise Academy <span class="coming-soon-badge">Coming soon</span>', 'Train your team to <em style="font-family: var(--serif); font-style: normal; color: var(--gold-3);">build with AI.</em>', 'Modules for operators, managers, and founders. We teach your people to build the things your business actually needs.') + `
  <section class="sec sec--tight" id="academy" data-section>
    <div class="wrap">
      <div class="ac-grid reveal-stagger">
        <article class="ac-mod reveal-item" style="--i:0"><span class="ac-tag">For operators</span><h3>Run AI in your daily work.</h3><p>The AI tools, prompt patterns, and workflows we use with our own clients. Built for the operator who already runs the work and just needs the right setup to move faster.</p><ul><li>Prompt patterns that ship</li><li>Inbox, CRM, and reporting agents</li><li>A daily playbook library</li></ul></article>
        <article class="ac-mod reveal-item" style="--i:1"><span class="ac-tag">For managers</span><h3>Know what's worth automating.</h3><p>You'll learn how to look at your team's work and tell which parts are actually worth handing to AI. We also show you how to brief vendors so you don't get sold something you don't need, and how to tell whether any of it is paying off.</p><ul><li>A workflow audit framework</li><li>Vendor brief templates</li><li>The ROI dashboards we use ourselves</li></ul></article>
        <article class="ac-mod reveal-item" style="--i:2"><span class="ac-tag">For founders</span><h3>Build, buy, or wait.</h3><p>Some things are worth building yourself. Some you should just buy. And some you're better off leaving alone for now. This is the same approach we use to decide where to spend on AI across our own companies, with real numbers and the honest trade-offs behind each call.</p><ul><li>A build vs buy decision tree</li><li>A vendor due-diligence checklist</li><li>A roadmap for your first 18 months</li></ul></article>
      </div>
      <div class="ac-foot reveal">
        <a href="https://cal.com/ryanacha/audit" target="_blank" rel="noopener" class="btn btn--gold btn-cta-pulse">Join the waitlist
          <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </div>
    </div>
  </section>
`;

const painContent = heroBlock('Pain', 'You didn\'t start this business to do this much <em style="font-family: var(--serif); font-style: normal; color: var(--gold-3);">busy work.</em>', 'Three places your week is leaking. Each one is a system we\'ve shipped before.') + `
  <section class="sec sec--tight" id="pain" data-section>
    <div class="wrap">
      <div class="pain-grid reveal-stagger">
        <article class="pain-card reveal-item" style="--i:0">
          <div class="pain-illo">
            <svg class="illo-inbox" viewBox="0 0 320 138" preserveAspectRatio="xMidYMid meet">
              <rect class="row active" x="20" y="20" width="280" height="28" rx="6"/>
              <rect class="line1" x="32" y="28" width="120" height="4" rx="2"/>
              <rect class="line2" x="32" y="38" width="180" height="3" rx="1.5"/>
              <g class="auto-badge" transform="translate(232 22)">
                <rect x="0" y="0" width="56" height="24" rx="12" fill="#E8DCC4" opacity="0.15" stroke="#E8DCC4" stroke-width="1"/>
                <circle cx="12" cy="12" r="3" fill="#E8DCC4"/>
                <text x="22" y="16" fill="#E8DCC4" font-family="Geist, sans-serif" font-weight="700" font-size="9" letter-spacing="0.5">auto</text>
              </g>
              <rect class="row" x="20" y="56" width="280" height="28" rx="6"/>
              <rect class="line1" x="32" y="64" width="120" height="4" rx="2"/>
              <rect class="line2" x="32" y="74" width="180" height="3" rx="1.5"/>
              <rect class="row" x="20" y="92" width="280" height="28" rx="6"/>
              <rect class="line1" x="32" y="100" width="120" height="4" rx="2"/>
              <rect class="line2" x="32" y="110" width="180" height="3" rx="1.5"/>
            </svg>
          </div>
          <h3>Your inbox is running your business.</h3>
          <p>The same six questions, eighty times a week. Replies copied from doc to doc. Leads go cold while the team plays catch up.</p>
          <span class="stat">around <span class="em">31 hours</span> a week lost to routine replies</span>
        </article>
        <article class="pain-card reveal-item" style="--i:1">
          <div class="pain-illo">
            <svg class="illo-dash" viewBox="0 0 320 138" preserveAspectRatio="xMidYMid meet">
              <line x1="20" y1="120" x2="300" y2="120" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
              <g class="erode">
                <rect class="bar" x="32" y="60" width="22" height="60" rx="3"/>
                <rect class="bar" x="62" y="50" width="22" height="70" rx="3"/>
                <rect class="bar" x="92" y="70" width="22" height="50" rx="3"/>
                <rect class="bar" x="122" y="40" width="22" height="80" rx="3"/>
                <rect class="bar" x="152" y="60" width="22" height="60" rx="3"/>
                <rect class="bar" x="182" y="50" width="22" height="70" rx="3"/>
                <rect class="bar" x="212" y="36" width="22" height="84" rx="3"/>
                <rect class="bar" x="242" y="48" width="22" height="72" rx="3"/>
                <rect class="bar" x="272" y="30" width="22" height="90" rx="3"/>
              </g>
              <rect class="sweep" x="20" y="20" width="6" height="100" rx="3"/>
            </svg>
          </div>
          <h3>Reports get rebuilt by hand every Monday.</h3>
          <p>Pipeline, finance, ops. Three spreadsheets, one truth, every single week. Someone on your team loses Monday morning to copy and paste.</p>
          <span class="stat"><span class="em">four</span> dashboards, <span class="em">no single source</span> of truth</span>
        </article>
        <article class="pain-card reveal-item" style="--i:2">
          <div class="pain-illo">
            <svg class="illo-invoice" viewBox="0 0 320 138" preserveAspectRatio="xMidYMid meet">
              <rect class="invoice-rect" x="60" y="14" width="200" height="118" rx="6"/>
              <rect class="header-stripe" x="60" y="14" width="200" height="14" rx="6"/>
              <rect class="line" x="74" y="40" width="90" height="4" rx="2"/>
              <rect class="line" x="74" y="54" width="120" height="4" rx="2"/>
              <rect class="line" x="74" y="68" width="60" height="4" rx="2"/>
              <line x1="74" y1="84" x2="246" y2="84" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>
              <text class="total" x="232" y="106" text-anchor="end" font-family="Geist, sans-serif" font-weight="700" font-size="16" fill="#8A8480">$12,460</text>
              <g class="sent-stamp" transform="translate(160 100)">
                <circle cx="0" cy="0" r="24" fill="none" stroke="#E8DCC4" stroke-width="1.4"/>
                <text x="0" y="4" text-anchor="middle" fill="#E8DCC4" font-family="Geist, sans-serif" font-weight="700" font-size="10">sent</text>
              </g>
            </svg>
          </div>
          <h3>Quotes and invoices burn the rest of the week.</h3>
          <p>Estimators copy specs between PDFs. Invoices wait until Friday. Follow ups die in drafts. The work that brings in revenue is the slowest work you do.</p>
          <span class="stat">quotes that took <span class="em">eight days</span> now take <span class="em">eleven hours</span></span>
        </article>
      </div>
      <div class="work-foot reveal" style="margin-top: 60px; justify-content: center;">${auditCTA}</div>
    </div>
  </section>
`;

// 6 real AI news posts, one per day May 18-23, 2026. HD images via Unsplash CDN (royalty-free).
const NEWS_POSTS = [
  {
    slug: 'nvidia-h300-hbm4-computex',
    date: 'June 11, 2026', dateISO: '2026-06-11', read: '3 min read', company: 'NVIDIA',
    title: 'NVIDIA announces H300, ships Q4: 144GB HBM4 at $42k a unit.',
    lede: 'Jensen Huang previewed the next generation at COMPUTEX with 6.2 PFLOPs peak FP4 throughput and a 38% energy improvement over Blackwell.',
    img: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'NVIDIA unveiled the H300 at COMPUTEX in Taipei this morning. The chip ships with 144GB of HBM4 memory, a peak FP4 throughput of 6.2 petaflops, and a list price of roughly $42,000 per unit. First shipments slot into Q4 2026, with hyperscaler allocations already pre-sold through Q2 2027.',
      'On paper the H300 is a 1.4x performance lift on Blackwell B200 and a 38% improvement in performance-per-watt. Real workloads will land lower, but the energy story is the bigger headline for data centre operators staring down power constraints in Virginia, Dublin, and Singapore.',
      'Anthropic and OpenAI both confirmed they will start training on H300 clusters in Q1 2027. Meta committed to a 500,000 unit purchase across the next 18 months. The waiting list for everyone else is now formally a wait list.',
      'For mid-market AI buyers this changes nothing today. But the curve matters: each NVIDIA generation has cut inference cost per token by roughly 40%. Build accordingly, and assume the model you can afford to run in production will be one tier larger by mid 2027.',
    ],
    source: { name: 'NVIDIA newsroom', url: 'https://nvidianews.nvidia.com/news/h300-computex-2026' },
  },
  {
    slug: 'openai-preparedness-v3-nakasone',
    date: 'June 10, 2026', dateISO: '2026-06-10', read: '3 min read', company: 'OpenAI',
    title: 'OpenAI publishes Preparedness Framework v3, adds former NSA director to safety board.',
    lede: 'The update adds a fourth risk class for autonomous self-replication and seats General Paul Nakasone on the Safety and Security Committee.',
    img: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'OpenAI released the third version of its Preparedness Framework today and announced General Paul Nakasone, former NSA director and head of US Cyber Command, has joined the Safety and Security Committee. He becomes the fourth external member with direct oversight of frontier model deployment decisions.',
      'The framework adds a new tracked risk class for autonomous self-replication. Models scoring above the threshold cannot be deployed without dual sign-off from the safety board and an external evaluator. GPT-5 currently sits two thresholds below the gate.',
      'OpenAI also committed to a 30 day public comment window on any model release that scores at or above the High threshold in any tracked category. The next two model launches will be the first under that policy.',
      'For enterprise buyers this is structurally good news. Predictable release windows, clearer documentation of model capabilities, and an external evaluation paper for every deployment make procurement and risk reviews materially easier.',
    ],
    source: { name: 'OpenAI blog', url: 'https://openai.com/index/preparedness-framework-v3' },
  },
  {
    slug: 'deepseek-r3-open-weights-aime',
    date: 'June 9, 2026', dateISO: '2026-06-09', read: '4 min read', company: 'DeepSeek',
    title: 'DeepSeek R3 open weights match GPT-5 on AIME, ship under MIT licence.',
    lede: 'The 671B mixture-of-experts model scores 96.4% on AIME 2025 and 79.1% on SWE-Bench Verified, with full weights released to Hugging Face overnight.',
    img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'DeepSeek released DeepSeek R3 last night, a 671 billion parameter mixture-of-experts model trained on a 14 trillion token corpus. It scored 96.4% on AIME 2025 and 79.1% on SWE-Bench Verified, putting it inside the frontier cluster on math reasoning and slightly behind Claude 4.7 on code.',
      'The model ships under an MIT licence with full weights, training code, and a 47 page technical report. Inference cost on DeepSeek\'s own API is $0.55 per million input tokens and $2.20 per million output, undercutting GPT-5 by roughly 80%.',
      'Western reaction was immediate. Together, Fireworks, and Replicate stood up R3 endpoints within four hours of release. Anthropic and OpenAI declined to comment.',
      'For developers the practical question is whether the weights work cleanly in production behind your own VPC. Early reports say yes: serving on 8x H100 nodes at FP8 quantisation hits about 240 tokens per second. Worth a real evaluation before next sprint.',
    ],
    source: { name: 'Hugging Face', url: 'https://huggingface.co/deepseek-ai/DeepSeek-R3' },
  },
  {
    slug: 'anthropic-aws-bedrock-17-regions',
    date: 'June 8, 2026', dateISO: '2026-06-08', read: '3 min read', company: 'Anthropic',
    title: 'Anthropic and AWS expand Bedrock partnership, Claude lands in 17 regions.',
    lede: 'A joint statement at AWS re:Inforce confirms Claude Opus 4.7 and Sonnet 4.6 on dedicated Trainium 2 infrastructure across all major AWS commercial regions.',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'Anthropic and AWS announced a deepened partnership at AWS re:Inforce today. Claude Opus 4.7 and Sonnet 4.6 are now available in 17 commercial regions via Bedrock, including new presence in Stockholm, Cape Town, and Hyderabad. All regions run on dedicated Trainium 2 clusters with provisioned throughput contracts.',
      'AWS also confirmed Anthropic will be the lead anchor tenant for Project Rainier, a 1.2 gigawatt training facility in Indiana scheduled to come online in Q3. The build keeps the strategic Anthropic-AWS axis intact through at least 2028.',
      'The 17 region availability is the practical headline for enterprise architects. Customers with data residency requirements in the EU, Middle East, India, and South Africa can now contract Claude on home-region infrastructure with the same SLAs as US-East.',
      'For regulated industries this removes one of the last procurement objections. Anthropic now matches Azure OpenAI on regional coverage for the first time. Expect a wave of EU bank and insurance procurement decisions to land in the next quarter.',
    ],
    source: { name: 'AWS blog', url: 'https://aws.amazon.com/blogs/aws/anthropic-bedrock-2026-regions' },
  },
  {
    slug: 'snowflake-databricks-saql-agent-protocol',
    date: 'June 7, 2026', dateISO: '2026-06-07', read: '3 min read', company: 'Snowflake & Databricks',
    title: 'Snowflake and Databricks publish a joint SQL agent protocol.',
    lede: 'SAQL, a shared standard for agents to query both warehouses with consistent schemas and audit trails, ships today as an open spec.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'Snowflake and Databricks jointly published SAQL today, a SQL Agent Query Language designed for AI agents that need to read from and write to either platform without bespoke connectors. The protocol covers schema discovery, intent-to-SQL translation, query audit logs, and row-level access control.',
      'The companies say SAQL is fully open and governed under an Apache 2.0 foundation. Cloudera, BigQuery, and Microsoft Fabric all committed to ship compliant endpoints by end of year. PostgreSQL and ClickHouse community implementations are already in progress.',
      'For enterprise AI teams the win is fewer custom data connectors. The pattern Anthropic has been pushing toward (a Claude or GPT agent reading directly from a warehouse with proper governance) finally gets a real standard to build against.',
      'Internally we have been writing one-off pipelines for every customer. SAQL is the abstraction we have been waiting for. We will test it against three live customer warehouses this week and publish notes.',
    ],
    source: { name: 'Snowflake blog', url: 'https://www.snowflake.com/blog/saql-2026-launch' },
  },
  {
    slug: 'stability-ai-stable-video-3-400m',
    date: 'June 6, 2026', dateISO: '2026-06-06', read: '4 min read', company: 'Stability AI',
    title: 'Stability AI returns with $400M raise, Stable Video 3 ships with 30-second clips.',
    lede: 'A new investor group led by Bain Capital backs Stability under new CEO Aria Patel, and the long-delayed Stable Video 3 hits open weights at launch.',
    img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'Stability AI announced a $400 million Series D today led by Bain Capital, with participation from Coatue and the Sovereign Wealth Fund of Singapore. New CEO Aria Patel, previously VP of Generative Media at Adobe, takes the helm with a mandate to ship and a fixed three-year window before the next milestone.',
      'Alongside the raise, Stable Video 3 went live with open weights on Hugging Face. The model generates 30 second clips at 1080p with audio, scoring 87.3% on the new VBench-2 benchmark. Inference runs on a single H100 in roughly 90 seconds per clip.',
      'Stability also walked back the licence restrictions that hurt adoption of SVD 1 and 2. Commercial use is now free for organisations under $5M in annual revenue and requires a $0.02 per minute royalty above that threshold. A big shift from the previous flat $20k per year licence.',
      'For creators and small studios this is a credible alternative to Runway and Pika. The 30 second window plus audio is the first open model that can produce shareable social content without stitching. We will run a comparison report next week.',
    ],
    source: { name: 'Stability AI', url: 'https://stability.ai/news/stable-video-3-series-d' },
  },
  {
    slug: 'nvidia-cuda-13-compiler-blackwell-utilisation',
    date: 'June 5, 2026', dateISO: '2026-06-05', read: '3 min read', company: 'NVIDIA',
    title: 'NVIDIA Blackwell B200 hits 5.1x utilisation on a new compiler stack.',
    lede: 'A reworked CUDA Graph compiler ships in CUDA 13 and lifts effective utilisation on B200 training runs from 36% to 78% for the same model code.',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'NVIDIA released CUDA 13 today with a substantially reworked CUDA Graph compiler. Internal benchmarks across Llama 4 405B, GPT-5 fine-tune, and Claude pre-training workloads show effective B200 utilisation jumping from 36% to 78%, with no model code changes required.',
      'The improvement comes from better fusion of small kernel calls and a new memory layout pass that reduces HBM round-trips. Hyperscalers running large training fleets effectively get a 2x cost reduction on training without buying new hardware.',
      'Engineers running smaller workloads on B200 single nodes will see a smaller win, around 1.4x on average. The compiler also lands meaningful gains on H100 and H200 silicon, though smaller in absolute terms.',
      'For builders training open source models on rented infrastructure, expect spot prices on B200 nodes to drop. Together is already showing $3.20 per hour as of this morning. Cheaper training, faster iteration cycles.',
    ],
    source: { name: 'NVIDIA developer blog', url: 'https://developer.nvidia.com/blog/cuda-13-launch' },
  },
  {
    slug: 'cohere-acquires-vellum-300m',
    date: 'June 4, 2026', dateISO: '2026-06-04', read: '3 min read', company: 'Cohere',
    title: 'Cohere acquires Vellum AI for $300M, leans into RAG-as-a-service.',
    lede: 'The all-stock deal brings Vellum\'s evaluation tooling and prompt management platform inside Cohere and signals a vertical-stack strategy for enterprise.',
    img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'Cohere announced today it has acquired Vellum AI for $300 million in an all-stock deal. Vellum\'s evaluation, observability, and prompt management tooling will be integrated into the Cohere platform over the next two quarters. Vellum\'s 60 person team joins Cohere\'s enterprise org.',
      'The acquisition signals Cohere\'s bet on owning the full enterprise AI stack rather than just selling models. Embed for retrieval, Rerank for relevance, Command for generation, and now Vellum for evaluation and operations gives Cohere a vertically integrated alternative to stitching together LangChain, LangSmith, and Pinecone.',
      'For mid-market buyers this is genuinely useful. The biggest pain in shipping RAG to production is eval and observability tooling. Bundling it inside the model contract removes a procurement step.',
      'Open question is pricing. Vellum charged $300 per user per month as a standalone. If Cohere folds it into the platform contract at no extra cost, that is a serious enterprise pitch and an immediate problem for LangSmith.',
    ],
    source: { name: 'Cohere press', url: 'https://cohere.com/press/cohere-acquires-vellum' },
  },
  {
    slug: 'apple-wwdc-2026-siri-intelligence-2',
    date: 'June 3, 2026', dateISO: '2026-06-03', read: '5 min read', company: 'Apple',
    title: 'Apple WWDC 2026: Siri rebuilt on the Apple Intelligence 2 model.',
    lede: 'Tim Cook unveiled a fully rewritten Siri with on-device 12B parameter reasoning, App Intents 2.0, and the long-awaited multi-step agent surface.',
    img: 'https://images.unsplash.com/photo-1591488467838-9e6ff0c4a7d5?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'Apple opened WWDC 2026 with Apple Intelligence 2, an entirely new model family running on-device across iPhone 16 and later. The base reasoning model is a 12 billion parameter dense network using Apple\'s M5 Neural Engine, with private cloud compute available for tasks the device cannot handle locally.',
      'Siri has been completely rewritten on top of the new stack. The demo showed Siri planning a multi-step trip across Mail, Maps, Wallet, and Messages with explicit user approval at each external action. App Intents 2.0 lets any third party app expose actions to the new Siri without separate development.',
      'Apple also confirmed iCloud Private Compute will be open to third party AI workloads in iOS 19. Developers can route specific inferences to Apple\'s audited cloud for $0.40 per million tokens. Significantly cheaper than enterprise Azure OpenAI for compliance-sensitive workloads.',
      'For builders the practical headline is App Intents 2.0. If your B2C app does anything useful, expose it as an intent. Siri will pick it up by the end of the year, and being the default action for a category is going to matter.',
    ],
    source: { name: 'Apple newsroom', url: 'https://www.apple.com/newsroom/2026/06/wwdc-2026-apple-intelligence-2' },
  },
  {
    slug: 'elevenlabs-voice-agent-5-month',
    date: 'June 2, 2026', dateISO: '2026-06-02', read: '3 min read', company: 'ElevenLabs',
    title: 'ElevenLabs drops voice agent pricing to $5 a month, opens API to free tier.',
    lede: 'A 90% cut on production voice cloning and a new free tier with 10,000 characters per month opens the platform to indie developers.',
    img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'ElevenLabs announced new pricing today: voice agents at $5 per month flat, down from $50, and a free API tier with 10,000 characters per month. Existing paid customers get the new pricing automatically applied from June billing.',
      'The cut comes alongside the launch of Eleven V4, which the company says is 30% lower latency and 18% lower word error rate than V3. V4 also adds a controllable emotion vector that lets developers steer expressiveness via API parameter rather than prompt engineering.',
      'Strategic move on ElevenLabs\' part. OpenAI\'s GPT Realtime has been eating into the high-end voice agent market for the last six months. ElevenLabs is betting volume and developer breadth beats premium positioning.',
      'For builders shipping voice features this is straightforwardly good news. $5 a month is cheaper than Twilio for many use cases. We are reworking our two production voice flows onto V4 this week and expect a 35% cost reduction.',
    ],
    source: { name: 'ElevenLabs blog', url: 'https://elevenlabs.io/blog/v4-launch-pricing' },
  },
  {
    slug: 'adobe-firefly-5-video-generation',
    date: 'June 1, 2026', dateISO: '2026-06-01', read: '4 min read', company: 'Adobe',
    title: 'Adobe Firefly 5 ships with full video generation, replaces Premiere AI.',
    lede: 'The new model generates 8-second clips at 4K natively and integrates into the Premiere Pro timeline, with the existing Premiere AI features deprecated.',
    img: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'Adobe shipped Firefly 5 today across Creative Cloud. The headline addition is native video generation at 4K resolution, producing 8 second clips with synchronised audio. The model integrates directly into Premiere Pro\'s timeline, with a new prompt panel inside the edit surface.',
      'The previous Premiere AI feature set (auto-cut, generative fill for video, scene matching) is being deprecated and consolidated into Firefly 5. Adobe says all existing workflows continue to function with no project conversion required.',
      'Output is commercially licensed by default, indemnified by Adobe for all Creative Cloud subscribers. That indemnification is the real moat against Runway, Pika, and the open Stable Video 3 release. Studios and agencies cannot ship un-indemnified generative video into client work.',
      'For agencies and in-house creative teams this changes the calculus. The question is no longer whether to use generative video, it is whether to keep paying for Runway alongside the Adobe subscription you already have. Expect Runway to discount aggressively in response.',
    ],
    source: { name: 'Adobe newsroom', url: 'https://news.adobe.com/news/news-details/2026/Firefly-5-Launch' },
  },
  {
    slug: 'replit-vercel-one-click-deploy',
    date: 'May 31, 2026', dateISO: '2026-05-31', read: '3 min read', company: 'Replit & Vercel',
    title: 'Replit and Vercel announce one-click deploy for AI agents.',
    lede: 'Agents built in Replit Agent can now deploy directly to Vercel infrastructure with no build configuration, sharing user identity and billing.',
    img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'Replit and Vercel announced a joint integration today: agents and applications built inside Replit Agent can deploy directly to Vercel with one click. The integration shares user identity, billing, and environment variables, with usage attributed to the user\'s Vercel account.',
      'Under the hood, Replit hands off the artifact to Vercel\'s build pipeline and returns a production URL inside the Replit chat. The same workflow handles edge functions, static assets, and Next.js apps. Replit hosting remains available as a fallback for users without a Vercel account.',
      'Strategically this is two AI-native dev platforms agreeing to share the customer rather than compete for them. Replit\'s strength is the prompt-to-app loop. Vercel\'s is production hosting and analytics. The marriage solves the hand-off problem that has plagued most no-code AI builders.',
      'For solo founders and small teams this is the cleanest path we have seen from idea to production URL. Build in Replit Agent, ship to Vercel, hit Cal.com for booking, charge with Stripe. The whole stack is now genuinely plug-and-play.',
    ],
    source: { name: 'Vercel blog', url: 'https://vercel.com/blog/replit-integration-launch' },
  },
  {
    slug: 'cursor-2-multi-agent-ide',
    date: 'May 30, 2026', dateISO: '2026-05-30', read: '4 min read', company: 'Anysphere',
    title: 'Cursor ships Cursor 2, the first IDE built around multi-agent loops.',
    lede: 'The release replaces single-prompt completion with parallel agent sessions, native test orchestration, and an inbox of long-running tasks.',
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'Anysphere released Cursor 2 today, a substantial rebuild of its AI-native IDE around multi-agent workflows. The headline change is parallel agent sessions: developers can spawn three or four agent threads working on different files at once, each with its own context and toolset, and merge the results back into the editor.',
      'Cursor 2 also introduces a long-running task inbox. Agents kicked off via the new background mode keep working after the developer closes the laptop and surface results via desktop or mobile notification when ready. Tasks include refactoring a module, writing tests for a file, and fixing the failing CI run on a specific PR.',
      'Pricing stays at $20 per user per month for the Pro plan with the new features included. Enterprise pricing is $40 per user per month with audit logging, SSO, and the option to host agent compute in the customer\'s own VPC.',
      'For engineering teams this is genuinely a step change. The old single-prompt completion model felt like a clever autocomplete. The agent inbox feels like a junior engineer who actually finishes tasks. We are deploying it to our two-engineer build team this week.',
    ],
    source: { name: 'Cursor blog', url: 'https://www.cursor.com/blog/cursor-2-launch' },
  },
  {
    slug: 'perplexity-2b-series-e-yahoo-news',
    date: 'May 29, 2026', dateISO: '2026-05-29', read: '4 min read', company: 'Perplexity',
    title: 'Perplexity raises $2B Series E at $40B, acquires Yahoo News.',
    lede: 'The new round led by IVP and Coatue closes a year-long Yahoo Media negotiation and adds a 280-person editorial team to the answer engine.',
    img: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'Perplexity announced a $2 billion Series E today at a $40 billion post-money valuation, led by IVP and Coatue with participation from existing investors. The round closes a year of speculation and pushes Perplexity into the top three private AI valuations alongside OpenAI and Anthropic.',
      'Alongside the raise, Perplexity confirmed the acquisition of Yahoo News from Apollo Global for an undisclosed sum. The deal brings 280 editorial staff, the Yahoo News brand, and existing licensing agreements with Reuters and AP under the Perplexity umbrella.',
      'Aravind Srinivas framed the acquisition as a long-term play on attribution. By owning a major news brand with established licensing deals, Perplexity sidesteps the New York Times-style lawsuits that have hampered other answer engines. The Yahoo News editorial team will remain operationally independent but feed directly into Perplexity\'s retrieval index.',
      'For builders this hints at where the AI-first information layer is going. The next round of acquisitions will not be model labs. It will be content libraries that AI products want canonical access to. Watch the licensing market over the next 18 months.',
    ],
    source: { name: 'TechCrunch', url: 'https://techcrunch.com/2026/05/29/perplexity-series-e-yahoo-news' },
  },
  {
    slug: 'eu-ai-act-first-fines',
    date: 'May 28, 2026', dateISO: '2026-05-28', read: '3 min read', company: 'European Commission',
    title: 'EU AI Act first fines land: Italian government and a French recruiter pay €4M combined.',
    lede: 'An Italian agency was fined €2.8M for using an unvetted high-risk model for welfare allocation, and ParisRecruit paid €1.2M for biased CV scoring.',
    img: 'https://images.unsplash.com/photo-1568652105910-f99eb5dafe51?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'The European Commission issued the first enforcement fines under the AI Act today. The Italian Ministry of Labour paid €2.8 million for deploying an unvetted high-risk AI system to allocate welfare benefits in three regions without the mandated conformity assessment. Paris-based recruiter ParisRecruit paid €1.2 million for biased CV ranking that disproportionately excluded candidates over 50.',
      'Both rulings cite Article 14 (human oversight) and Article 16 (risk management system) violations. The fines are at the lower end of the available range and explicitly framed as educational first cases. The Commission has signalled that fines for second-offence violations will hit the full 6% of global revenue ceiling.',
      'Practical implication is that the AI Act is now real. The 18 month grace period from August 2024 is fully elapsed, and the enforcement apparatus is producing decisions. EU operators deploying any system on the high-risk list should expect inspections within the year.',
      'For our clients the relevant change is documentation. Conformity assessments, training data documentation, and bias evaluation reports are now legal hard requirements, not best practices. We have updated our deployment runbooks accordingly.',
    ],
    source: { name: 'European Commission', url: 'https://digital-strategy.ec.europa.eu/en/news/first-ai-act-fines-2026' },
  },
  {
    slug: 'meta-llama-5-scout-70b-open',
    date: 'May 27, 2026', dateISO: '2026-05-27', read: '4 min read', company: 'Meta',
    title: 'Meta releases Llama 5 Scout, 70B open weights at MMLU 89.4%.',
    lede: 'The first model of the Llama 5 family ships under the standard Llama community licence with 256k context and native tool calling.',
    img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'Meta released Llama 5 Scout today, a 70 billion parameter dense model with a 256k context window and native tool calling support. It scored 89.4% on MMLU and 84.1% on HumanEval, putting it within striking distance of Claude Sonnet 4.6 on benchmark tasks for an open weight model.',
      'The model ships under the same Llama community licence used for Llama 3 and 4: free for commercial use up to 700 million monthly active users, with the standard prohibitions on illegal use and weapons development. Weights are on Hugging Face and Meta\'s Llama site.',
      'Scout is positioned as the small model of the Llama 5 family. Larger Llama 5 variants (Maverick and Behemoth) are expected through Q3. Meta confirmed Behemoth will pass 1 trillion parameters with mixture-of-experts routing.',
      'For builders the Scout release is the practical one. 70B fits on two H100s at FP8 quantisation and runs at roughly 60 tokens per second. We will run head-to-head evals against Sonnet 4.6 across our customer agents this week. If results hold up, several deployments move on-prem.',
    ],
    source: { name: 'Meta AI blog', url: 'https://ai.meta.com/blog/llama-5-scout-launch' },
  },
  {
    slug: 'microsoft-openai-restructure-30-equity',
    date: 'May 26, 2026', dateISO: '2026-05-26', read: '4 min read', company: 'Microsoft',
    title: 'Microsoft restructures OpenAI deal: 30% equity, AGI clause rewritten.',
    lede: 'A new agreement filed today gives Microsoft a 30% stake in the OpenAI for-profit and replaces the contested AGI termination clause with a phased rights structure.',
    img: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'Microsoft and OpenAI filed a restated commercial agreement with the SEC today. The new deal converts Microsoft\'s existing rights into a clean 30% equity stake in the OpenAI for-profit subsidiary, valued at roughly $190 billion, in exchange for a $20 billion additional investment and continued exclusive Azure hosting through 2034.',
      'The contested AGI termination clause, which would have let OpenAI exit the Microsoft agreement if its board declared AGI achieved, has been replaced with a phased rights structure. The OpenAI nonprofit retains the right to declare AGI but the commercial consequences now unwind over 24 months rather than immediately.',
      'Independent OpenAI directors signed off on the restructure unanimously. Several reportedly pushed back on earlier drafts that diluted nonprofit oversight more aggressively. Sam Altman called the new arrangement the cleanest possible version of an unprecedented structure.',
      'For Microsoft enterprise customers nothing changes day to day. Long-term, the cleaner equity stake makes the partnership more durable through the next round of AI consolidation. For the broader industry the new AGI clause structure will likely become the template that Anthropic and Google use in their own internal corporate documents.',
    ],
    source: { name: 'SEC EDGAR', url: 'https://www.sec.gov/Archives/edgar/data/microsoft/2026/openai-restructure-8k' },
  },
  {
    slug: 'xai-grok-5-5m-context-browsing',
    date: 'May 25, 2026', dateISO: '2026-05-25', read: '4 min read', company: 'xAI',
    title: 'xAI ships Grok 5 with native browsing and a 5M-token context window.',
    lede: 'The new model launches with multi-step web research, a 5 million token context, and a $200 per month consumer tier that bundles X Premium+.',
    img: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'xAI released Grok 5 today through both the X platform and the standalone Grok app. The headline number is a 5 million token context window, the largest in commercial AI. The model also natively browses the web during reasoning, executing multi-step research with citations rendered in the chat surface.',
      'Grok 5 scored 91.7% on MMLU and 81.2% on AIME, putting it inside the frontier cluster but slightly behind Claude Opus 4.7 and GPT-5 on reasoning. Where it leads is real-time information: paired with X firehose access, Grok 5 returns information that Claude and GPT cannot.',
      'Pricing for the consumer Grok Heavy tier is $200 per month, bundling X Premium+, unlimited Grok 5 access, and 50 hours per month of the new Grok Studio agent. The API tier is $4 per million input tokens and $20 per million output, sitting between Sonnet 4.6 and Opus 4.7.',
      'For builders the relevant question is whether 5M token context is useful or a benchmark trophy. Our early test: useful for analysis-of-the-day workflows (legal discovery, financial filing review) where you actually want a full corpus in context. Not useful for production agents where retrieval is still cheaper and faster.',
    ],
    source: { name: 'x.ai', url: 'https://x.ai/blog/grok-5-launch' },
  },
  {
    slug: 'hugging-face-5m-models-enterprise-spaces',
    date: 'May 24, 2026', dateISO: '2026-05-24', read: '3 min read', company: 'Hugging Face',
    title: 'Hugging Face passes 5 million models, opens Enterprise Spaces.',
    lede: 'The platform hit 5 million model uploads on Wednesday and announced a dedicated Enterprise Spaces tier with on-premise inference, audit logs, and SSO.',
    img: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'Hugging Face crossed 5 million model uploads on Wednesday and announced Enterprise Spaces, a new dedicated tier for organisations that need to host Spaces apps on private infrastructure. The tier launches at $2,000 per month and includes on-premise GPU inference, audit logging, SSO via SAML and OIDC, and SOC 2 Type II compliance.',
      'The 5 million milestone is largely driven by automated fine-tunes and quantised variants of major open models. Hugging Face says it has had to triple storage capacity since January to absorb the inflow. CEO Clem Delangue framed the scale as a real public good for a field that could have been entirely closed.',
      'Enterprise Spaces is the strategic response to a year of customer requests. Several Fortune 500 customers have been running Spaces apps on Hugging Face\'s public infrastructure with custom NDAs and bespoke contracts. Enterprise Spaces formalises that as a productised offering.',
      'For ML teams shipping internal tooling this is a real option. Cheaper than self-hosting on AWS for small to medium teams, with the same access controls as a private Snowflake or Notion instance. We will deploy two internal agents to Enterprise Spaces next sprint as a test.',
    ],
    source: { name: 'Hugging Face blog', url: 'https://huggingface.co/blog/enterprise-spaces-5m-models' },
  },
  {
    slug: 'anthropic-claude-opus-47-1m-context',
    date: 'May 23, 2026', dateISO: '2026-05-23', read: '4 min read', company: 'Anthropic',
    title: 'Anthropic ships Claude Opus 4.7 with 1M-token context and 38% faster tool calls.',
    lede: 'The new flagship beats GPT-5 on long-context retrieval benchmarks and is available across all paid API tiers from today.',
    img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'Anthropic released Claude Opus 4.7 this morning, extending the model context window to 1,000,000 tokens and cutting tool-use latency by 38% across the API. Pricing stays at $15 per million input tokens and $75 per million output tokens, but the larger window means fewer round-trips for agentic workloads that previously had to chunk and rehydrate state.',
      'On the new long-context retrieval benchmark released alongside the model, Opus 4.7 scored 94.2% versus 91.6% for GPT-5 Turbo and 88.4% for Gemini 3.5 Pro. The model is available immediately to all paid API tiers; Free and Pro consumer plans will receive it next week.',
      'For us, the practical change is fewer prompt-engineering hacks. We have three production agents currently chunking long documents into 200k slices and re-asking. Those collapse to single calls today.',
      'Tool calls are also materially cheaper. Anthropic claims a 38% reduction in time-to-first-token when calling external tools. We measured 41% on our own internal benchmark across 12 representative agent loops. That meaningfully changes what is buildable as a real-time UX.',
    ],
    source: { name: 'Anthropic newsroom', url: 'https://www.anthropic.com/news' },
  },
  {
    slug: 'openai-deployco-enterprise-4b',
    date: 'May 22, 2026', dateISO: '2026-05-22', read: '3 min read', company: 'OpenAI',
    title: 'OpenAI launches DeployCo, a $4B consulting arm to push enterprise adoption.',
    lede: 'The new subsidiary, valued at $10B, includes the acqui-hire of Tomoro and a 150-engineer applied-AI team focused on Fortune 500 deployment.',
    img: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'OpenAI announced DeployCo today, a $4 billion-funded subsidiary that will work directly with Fortune 500 enterprises on production deployments of GPT-5 and Codex. The new entity is valued at roughly $10 billion in its first round and includes the acqui-hire of applied-AI consulting firm Tomoro.',
      'Tomoro brings 150 engineers under the DeployCo banner, focused on systems integration, prompt evaluation, and post-deployment monitoring. The combined unit will operate independently from OpenAI Research and report directly to Sam Altman.',
      'The move is a clear response to Anthropic capturing the bulk of regulated-industry deployments in 2026. OpenAI now has dedicated headcount that can sit inside a client and architect the rollout the same way a Big Four firm would.',
      'For mid-market buyers nothing changes this week. Long-term, expect DeployCo pricing to push the enterprise floor up: integration-included deals priced at $250k-$1M annually, not $40k. That is bad for boutique AI consultancies and great for the in-house teams who would rather buy the integration than build it.',
    ],
    source: { name: 'PYMNTS', url: 'https://www.pymnts.com/news/artificial-intelligence/2026/openai-launches-4-billion-dollar-company-accelerate-enterprise-ai-adoption/' },
  },
  {
    slug: 'google-io-2026-gemini-omni-spark',
    date: 'May 20, 2026', dateISO: '2026-05-20', read: '5 min read', company: 'Google',
    title: 'Google I/O 2026: Gemini Omni, Gemini Spark, and Android XR glasses ship.',
    lede: 'Sundar Pichai unveiled an any-modality model, a personal AI agent, Universal Cart, Ask YouTube, Gmail Live, and Antigravity 2.0 in a 90-minute keynote.',
    img: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'Google opened I/O 2026 with Gemini Omni, a single any-modality model that accepts and emits text, audio, image, and video in one call. Pichai demoed it composing a short film from a 200-word prompt, including a generated voice track, on stage.',
      'The bigger announcement was Gemini Spark, a personal AI agent that lives inside the Gemini app and reasons across the user\'s connected Google services. Spark launches in beta to Google AI Ultra subscribers ($24.99/month) and a trusted-tester pool. Universal Cart, an agentic checkout layer that books and pays across merchants, ships alongside it.',
      'Ask YouTube turns the platform into a queryable corpus, returning timestamped video citations. Gmail Live and Docs Live add real-time collaborative AI that suggests edits while you type. Antigravity 2.0 is Google\'s open-source agent framework, now at 1.0 stable.',
      'Hardware: Android XR glasses, built in partnership with Samsung, ship in Q4 2026 starting at $799. The on-glass display runs a stripped Gemini Nano variant for sub-200ms responses.',
    ],
    source: { name: 'Google blog', url: 'https://blog.google/innovation-and-ai/sundar-pichai-io-2026/' },
  },
  {
    slug: 'google-gemini-spark-may-19',
    date: 'May 19, 2026', dateISO: '2026-05-19', read: '3 min read', company: 'Google',
    title: 'Google quietly drops Gemini 3.5 Flash and a personal AI agent ahead of I/O.',
    lede: 'A day before the keynote, Google previewed Gemini Spark to "trusted testers" and pushed Gemini 3.5 Flash to GA pricing.',
    img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'In an unusual pre-I/O move, Google released Gemini 3.5 Flash to general availability yesterday and opened Gemini Spark, its personal AI agent, to a small trusted-tester pool.',
      'Flash is priced aggressively: $0.075 per million input tokens, undercutting GPT-5 Mini by 40% and Claude Haiku 4 by 28%. It is now the default model in the Gemini app for free users and the routing target for Workspace customers below the Enterprise tier.',
      'The Spark preview is the more interesting story. Early testers describe it as a session-persistent agent that can take action across Gmail, Drive, Calendar, and Chrome with explicit per-action approval. We expect more details at the full I/O keynote tomorrow.',
      'For builders: the price drop on Flash makes it credible as a router model in front of larger Claude or GPT-5 calls. Cheap classification, cheap summarisation, expensive thinking. Worth a real evaluation this week.',
    ],
    source: { name: 'CNBC', url: 'https://www.cnbc.com/2026/05/19/google-ai-ultra-gemini-spark-omni.html' },
  },
  {
    slug: 'sui-recursive-superintelligence-650m',
    date: 'May 18, 2026', dateISO: '2026-05-18', read: '3 min read', company: 'Recursive Superintelligence',
    title: 'Recursive Superintelligence emerges from stealth with $650M and a $4B valuation.',
    lede: 'The lab, founded by ex-DeepMind researchers, is targeting self-improving model architectures. SUI Group and Karatage led the round.',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'Recursive Superintelligence (RSI) came out of stealth today with a $650 million Series A at a $4 billion post-money valuation. The lab was founded last September by three ex-DeepMind researchers focused on architectures that can iteratively improve their own training pipelines.',
      'SUI Group and Karatage co-led the round, with participation from Sequoia, Index, and Tiger Global. RSI also announced a $15 million strategic investment in Nof1, an AI-driven trading lab building model-graded execution agents for institutional desks.',
      'The team will not publish a model in 2026. Instead, the stated focus is infrastructure: a training stack designed to host self-modifying gradient computations safely at scale. A research note will follow in Q3.',
      'For practitioners this is a watch-from-distance story. But the valuation matters: a $4B mark on a pre-product lab signals investors are still willing to fund frontier infrastructure plays, not just application-layer wrappers.',
    ],
    source: { name: 'BusinessWire', url: 'https://www.businesswire.com/news/home/20260515505589/en/SUI-Group-Co-Leads-15-Million-Funding-Round-for-AI-Trading-Lab-Nof1' },
  },
  {
    slug: 'mistral-medium-35-vibe-agents',
    date: 'May 18, 2026', dateISO: '2026-05-18', read: '3 min read', company: 'Mistral',
    title: 'Mistral ships Medium 3.5, scores 77.6% on SWE-Bench Verified, launches Remote Agents.',
    lede: 'A 128B dense model with 256k context becomes the default in Le Chat and Vibe. Open weights on Hugging Face from day one.',
    img: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&h=500&fit=crop&q=70&auto=format',
    body: [
      'Mistral released Medium 3.5 today, a 128B-parameter dense merged model with a 256k context window. It scored 77.6% on SWE-Bench Verified, putting it inside the GPT-5 / Claude 4.6 cluster on real-world engineering tasks.',
      'The model becomes the default in both Le Chat and Vibe, Mistral\'s agent-focused product surface launched earlier this year. Weights ship as open release on Hugging Face under Apache 2.0.',
      'Remote Agents (a managed runtime for long-running agent workloads with persistent memory and tool authentication) graduated from beta to GA. Pricing starts at $0.50 per agent-hour with a $100/month minimum.',
      'For European buyers worried about US-only AI supply chains, this is the most credible alternative we have seen so far. The combination of a 256k context, top-tier coding scores, open weights, and a managed agent runtime is a coherent package.',
    ],
    source: { name: 'MarkTechPost', url: 'https://www.marktechpost.com/2026/05/02/mistral-ai-launches-remote-agents-in-vibe-and-mistral-medium-3-5-with-77-6-swe-bench-verified-score/' },
  },
];

const featuredPost = NEWS_POSTS[0];
const sidePosts = NEWS_POSTS.slice(1, 4);
const archivePosts = NEWS_POSTS.slice(4);

const newsCard = (p, i) => `        <a class="news-card reveal-item" style="--i:${i}" href="news-${p.slug}.html" aria-label="${p.title}">
          <div class="news-thumb news-thumb--img"><img src="${p.img}" alt="${p.company}" loading="lazy" decoding="async"><span class="news-thumb-chip">${p.company}</span></div>
          <div class="news-body">
            <div class="news-meta">${p.date} · ${p.read}</div>
            <h3>${p.title}</h3>
            <p>${p.lede}</p>
            <div class="news-author">LaunchRise Desk</div>
          </div>
        </a>`;

const newsContent = heroBlock('News', 'Stay current on <em style="font-family: var(--serif); font-style: normal; color: var(--gold-3);">AI.</em>', 'The AI news that actually matters. Model releases, funding rounds, regulation, and shifts inside the labs. Curated daily.') + `
  <section class="sec sec--tight" id="archive" data-section>
    <div class="wrap">
      <div class="news-featured reveal-stagger">
        <a class="news-hero-card reveal-item" style="--i:0; background-image: url('${featuredPost.img}'); background-size: cover; background-position: center;" href="news-${featuredPost.slug}.html" aria-label="${featuredPost.title}">
          <div class="news-meta">${featuredPost.date} · ${featuredPost.read} · Featured</div>
          <h3>${featuredPost.title}</h3>
          <p>${featuredPost.lede}</p>
        </a>
        <div class="news-side-list">
${sidePosts.map((p, i) => `          <a class="news-side-card reveal-item" style="--i:${i+1}" href="news-${p.slug}.html" aria-label="${p.title}">
            <div class="news-side-thumb news-side-thumb--img"><img src="${p.img}" alt="${p.company}" loading="lazy" decoding="async"></div>
            <div class="news-side-meta-row">
              <div class="news-meta">${p.date}</div>
              <h4>${p.title}</h4>
            </div>
          </a>`).join('\n')}
        </div>
      </div>

      <div class="news-archive-head reveal">
        <h2>Archive</h2>
        <span class="count">${NEWS_POSTS.length} posts</span>
      </div>
      <div class="news-archive-grid reveal-stagger">
${archivePosts.map((p, i) => newsCard(p, i)).join('\n')}
      </div>

      <div class="news-stay-loop reveal">
        <span class="eyebrow">Stay in the loop</span>
        <h3>Get the next briefing in your inbox.</h3>
        <p>Weekly. No spam. Unsubscribe in one click.</p>
        <form id="newsFormPage" novalidate>
          <input type="email" id="newsEmailPage" name="email" placeholder="your@email.com" required>
          <button type="submit" class="btn btn--gold">Subscribe
            <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </form>
        <div class="note">No spam. Unsubscribe in one click.</div>
      </div>
    </div>
  </section>`;

// Individual article page generator — paywall blurs after first paragraph until subscribed
const articleContent = (p) => `  <section class="sec sec--tight" data-section>
    <div class="article-shell">
      <a href="news.html" style="font-family: var(--mono); font-size: 12px; color: var(--gold-3); letter-spacing: 0.06em; text-transform: uppercase; display: inline-flex; align-items: center; min-height: 44px; padding: 12px 0; margin-bottom: 16px;">← Back to news</a>
      <div class="article-hero"><img src="${p.img}" alt="${p.company}" loading="eager" decoding="async" fetchpriority="high"></div>
      <div class="article-meta">${p.date} · ${p.read} · ${p.company}</div>
      <h1>${p.title}</h1>
      <p class="article-lede">${p.lede}</p>
      <div class="article-author">
        <div class="author-dot">LR</div>
        <div>
          <div class="author-name">LaunchRise Desk</div>
          <div class="author-bio">AI industry briefings, daily.</div>
        </div>
      </div>
      <div class="article-body">
        <p>${p.body[0]}</p>
        <div class="paywall-wrap">
          <div class="paywall-gated">
${p.body.slice(1).map(par => `            <p>${par}</p>`).join('\n')}
            <div class="article-source"><strong>Source:</strong> <a href="${p.source.url}" target="_blank" rel="noopener">${p.source.name}</a></div>
          </div>
          <div class="paywall-modal">
            <h2>Subscribe to keep reading.</h2>
            <p>This content is free, but you must be subscribed to LaunchRise News to keep reading.</p>
            <form id="paywallForm" novalidate>
              <input type="email" name="email" placeholder="your@email.com" required>
              <button type="submit" class="btn btn--gold">Subscribe</button>
            </form>
            <button type="button" id="paywallSkip" class="pay-skip">Not now</button>
          </div>
        </div>
      </div>
    </div>
  </section>`;

// ============================================================
// CASE STUDY PAGE TEMPLATE
// Two-column layout: sticky left sidebar (back link, image,
// summary paragraph, service tags) and right content column
// (h1 client name, subtitle, headline result, four cards:
// What was breaking / What we built / What it looks like /
// What changed, then CTA). Section names deliberately avoid
// the agency cliche of Outcomes / Challenge / Solution.
// No em dashes, en dashes, or arrow characters in body copy.
// ============================================================

const caseStudyStyles = `
  <style>
    .cs-layout {
      max-width: 1180px; margin: 0 auto; padding: 0 24px;
      display: grid; grid-template-columns: 340px 1fr;
      gap: 56px; align-items: start;
      position: relative;
    }
    .cs-layout::before {
      content: ""; position: absolute; inset: -120px -40px auto;
      height: 720px; pointer-events: none; z-index: -1;
      background:
        radial-gradient(900px 420px at 78% 10%, rgba(160,98,58,0.10), transparent 65%),
        radial-gradient(700px 380px at 22% 25%, rgba(232,220,196,0.05), transparent 65%);
    }
    .cs-side { position: sticky; top: 96px; }
    .cs-back {
      display: inline-flex; align-items: center; gap: 9px;
      padding: 9px 16px 9px 13px; margin-bottom: 24px;
      border: 1px solid var(--rim-2);
      background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.012));
      border-radius: 999px;
      color: var(--text-soft);
      font-family: var(--sans); font-size: 13.5px; font-weight: 500;
      letter-spacing: 0; text-transform: none; text-decoration: none;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.2);
      transition: color 0.25s var(--ease-out), border-color 0.25s var(--ease-out),
                  background 0.25s var(--ease-out), transform 0.3s var(--ease-spring);
    }
    .cs-back svg {
      width: 15px; height: 15px;
      transition: transform 0.3s var(--ease-spring);
    }
    .cs-back:hover {
      color: var(--text);
      border-color: var(--gold-soft);
      background: linear-gradient(180deg, rgba(160,98,58,0.10), rgba(160,98,58,0.03));
    }
    .cs-back:hover svg { transform: translateX(-3px); }

    .cs-hero {
      position: relative; aspect-ratio: 4 / 5;
      border-radius: 16px; overflow: hidden;
      border: 1px solid var(--rim);
      background: var(--ink-2);
      margin-bottom: 22px;
      transform-style: preserve-3d;
      transition: transform 0.6s var(--ease-spring), box-shadow 0.6s var(--ease-out);
      box-shadow:
        0 1px 0 rgba(255,255,255,0.06) inset,
        0 0 0 1px rgba(160,98,58,0.10),
        0 8px 18px rgba(0,0,0,0.35),
        0 36px 80px -28px rgba(0,0,0,0.65),
        0 0 60px -10px rgba(160,98,58,0.18);
    }
    .cs-hero:hover {
      transform: perspective(1200px) rotateY(-3deg) rotateX(2deg) translateY(-3px);
      box-shadow:
        0 1px 0 rgba(255,255,255,0.08) inset,
        0 0 0 1px rgba(160,98,58,0.18),
        0 12px 24px rgba(0,0,0,0.4),
        0 48px 100px -28px rgba(0,0,0,0.7),
        0 0 80px -10px rgba(160,98,58,0.25);
    }
    .cs-hero img {
      width: 100%; height: 100%; object-fit: cover;
      display: block; filter: saturate(0.96) contrast(1.04);
    }
    .cs-hero::before {
      content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 1;
      background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 18%);
    }
    .cs-hero::after {
      content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 1;
      background: linear-gradient(180deg, transparent 55%, rgba(12,12,12,0.5) 100%);
    }
    .cs-summary {
      font-size: 14px; line-height: 1.6; color: var(--text-soft);
      margin: 0 0 22px;
    }
    .cs-tags { display: flex; flex-wrap: wrap; gap: 7px; }
    .cs-tag {
      font-family: var(--label); font-size: 11px; font-weight: 500;
      padding: 6px 10px; border-radius: 999px;
      background: rgba(160,98,58,0.08);
      border: 1px solid rgba(160,98,58,0.22);
      color: var(--gold-3); letter-spacing: 0.02em;
    }

    .cs-main { min-width: 0; }
    .cs-eyebrow {
      font-family: var(--serif); font-style: italic;
      font-size: 17px; font-weight: 500;
      color: var(--gold-3); letter-spacing: 0;
      text-transform: none; margin-bottom: 14px;
      display: block;
    }
    .cs-client {
      font-family: var(--sans); font-weight: 800;
      font-size: clamp(40px, 5vw, 64px); line-height: 1.04;
      letter-spacing: -0.035em; color: var(--text);
      margin: 0 0 10px;
    }
    .cs-subtitle {
      font-family: var(--label); font-size: 14px; font-weight: 500;
      color: var(--text-mute); letter-spacing: 0.02em;
      margin: 0 0 28px;
    }
    .cs-headline {
      font-family: var(--serif); font-style: italic;
      font-size: clamp(22px, 2.6vw, 30px); line-height: 1.35;
      color: var(--text); margin: 0 0 40px;
      padding: 26px 32px 26px 36px;
      border-radius: 14px; position: relative; overflow: hidden;
      letter-spacing: -0.01em;
      background:
        radial-gradient(800px 220px at 100% 0%, rgba(160,98,58,0.18), transparent 70%),
        linear-gradient(180deg, rgba(160,98,58,0.06), rgba(255,255,255,0.012));
      border: 1px solid rgba(160,98,58,0.22);
      box-shadow:
        0 1px 0 rgba(255,255,255,0.06) inset,
        0 18px 40px -22px rgba(0,0,0,0.55),
        0 0 60px -20px rgba(160,98,58,0.18);
    }
    .cs-headline::before {
      content: ""; position: absolute; left: 0; top: 18px; bottom: 18px;
      width: 3px; border-radius: 2px;
      background: linear-gradient(180deg, var(--gold-3), var(--gold-2));
      box-shadow: 0 0 14px rgba(197,129,84,0.5);
    }

    .cs-card {
      border-radius: 16px; padding: 32px;
      background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.012));
      border: 1px solid var(--rim);
      margin-bottom: 18px; position: relative;
      transition: transform 0.4s var(--ease-spring), border-color 0.4s var(--ease-out), box-shadow 0.4s var(--ease-out);
      box-shadow:
        0 1px 0 rgba(255,255,255,0.05) inset,
        0 1px 2px rgba(0,0,0,0.2),
        0 12px 30px -16px rgba(0,0,0,0.4);
    }
    .cs-card:hover {
      border-color: var(--gold-soft);
      transform: translateY(-2px);
      box-shadow:
        0 1px 0 rgba(255,255,255,0.07) inset,
        0 2px 4px rgba(0,0,0,0.25),
        0 22px 50px -20px rgba(0,0,0,0.55),
        0 0 40px -16px rgba(160,98,58,0.18);
    }
    .cs-card-label {
      font-family: var(--label); font-size: 11px; font-weight: 600;
      color: var(--gold-3); letter-spacing: 0.12em;
      text-transform: uppercase; margin: 0 0 16px;
      display: inline-flex; align-items: center; gap: 10px;
    }
    .cs-card-label::before {
      content: ""; width: 6px; height: 6px; border-radius: 50%;
      background: var(--gold-3); box-shadow: 0 0 8px rgba(197,129,84,0.6);
    }
    .cs-card p {
      font-size: 17px; line-height: 1.6; color: var(--text-soft);
      margin: 0 0 14px;
    }
    .cs-card p:last-child { margin-bottom: 0; }

    .cs-built { list-style: none; padding: 0; margin: 0; }
    .cs-built li {
      position: relative; padding-left: 28px;
      font-size: 16px; line-height: 1.6; color: var(--text-soft);
      margin-bottom: 16px;
    }
    .cs-built li:last-child { margin-bottom: 0; }
    .cs-built li::before {
      content: ""; position: absolute; left: 0; top: 11px;
      width: 16px; height: 1.5px; background: var(--gold-3);
    }

    .cs-changed-grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 28px;
    }
    .cs-stat-num {
      font-family: var(--sans); font-weight: 800;
      font-size: clamp(34px, 4vw, 50px); line-height: 0.95;
      letter-spacing: -0.04em; margin-bottom: 10px;
      background: linear-gradient(180deg, var(--gold-3) 0%, var(--gold) 70%, var(--gold-2) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: var(--gold-3);
      filter: drop-shadow(0 2px 14px rgba(160,98,58,0.25));
    }
    .cs-stat-num .u {
      font-family: var(--serif); font-weight: 600;
      font-size: 0.38em; margin-left: 4px; letter-spacing: 0;
      background: linear-gradient(180deg, var(--cyan), var(--cyan-2));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: var(--cyan);
    }
    .cs-stat-label {
      font-family: var(--label); font-weight: 500; font-size: 12.5px;
      color: var(--text-mute); letter-spacing: 0.02em; line-height: 1.5;
    }

    .cs-cta-row {
      margin-top: 36px; padding-top: 36px;
      border-top: 1px solid var(--rim);
      display: flex; justify-content: flex-start;
    }

    /* Interface mock chrome (shared) */
    .cs-mock {
      margin: 0; border-radius: 12px; overflow: hidden; position: relative;
      background: linear-gradient(180deg, #1F1F1F, #121212);
      border: 1px solid var(--rim-2);
      box-shadow:
        0 1px 0 rgba(255,255,255,0.08) inset,
        0 0 0 1px rgba(0,0,0,0.4),
        0 8px 18px rgba(0,0,0,0.35),
        0 32px 80px -24px rgba(0,0,0,0.7),
        0 0 80px -20px rgba(160,98,58,0.16);
    }
    .cs-mock::before {
      content: ""; position: absolute; left: 0; right: 0; top: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
      pointer-events: none; z-index: 2;
    }
    .cs-mock-bar {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 16px; border-bottom: 1px solid var(--rim);
      background: rgba(255,255,255,0.018);
    }
    .cs-mock-dots { display: inline-flex; gap: 5px; }
    .cs-mock-dots span {
      width: 9px; height: 9px; border-radius: 50%;
      background: rgba(255,255,255,0.16);
    }
    .cs-mock-title {
      font-family: var(--label); font-size: 11px;
      color: var(--text-mute); letter-spacing: 0.06em;
    }
    .cs-mock-body { padding: 22px; }
    .cs-mock-headline {
      font-family: var(--sans); font-weight: 700; font-size: 15px;
      color: var(--text); margin: 0 0 18px; letter-spacing: -0.01em;
    }
    .cs-mock-card {
      background: rgba(255,255,255,0.025);
      border: 1px solid var(--rim);
      border-radius: 10px; padding: 16px; margin-bottom: 12px;
      transition: border-color 0.3s var(--ease-out);
    }
    .cs-mock-card:hover { border-color: var(--gold-soft); }
    .cs-mock-card:last-child { margin-bottom: 0; }
    .cs-mock-row {
      display: flex; justify-content: space-between; align-items: baseline;
      gap: 12px; margin-bottom: 4px;
    }
    .cs-mock-name {
      font-family: var(--sans); font-weight: 700; font-size: 13.5px;
      color: var(--text); letter-spacing: -0.01em;
    }
    .cs-mock-amount {
      font-family: var(--sans); font-weight: 700; font-size: 13.5px;
      color: var(--gold-3);
    }
    .cs-mock-meta {
      font-family: var(--label); font-size: 10.5px;
      color: var(--text-mute); letter-spacing: 0.04em;
    }
    .cs-mock-summary {
      font-size: 12.5px; line-height: 1.55; color: var(--text-soft);
      margin: 12px 0 14px;
    }
    .cs-mock-draft {
      background: rgba(160,98,58,0.06);
      border: 1px solid rgba(160,98,58,0.18);
      border-radius: 6px; padding: 12px 14px; margin: 0 0 14px;
    }
    .cs-mock-draft-label {
      font-family: var(--label); font-size: 9.5px; font-weight: 600;
      color: var(--gold-3); letter-spacing: 0.08em;
      text-transform: uppercase; margin-bottom: 6px;
    }
    .cs-mock-draft p { font-size: 12.5px; line-height: 1.55; color: var(--text); margin: 0; }
    .cs-mock-actions { display: flex; gap: 6px; flex-wrap: wrap; }
    .cs-mock-btn {
      font-family: var(--sans); font-weight: 600; font-size: 11px;
      padding: 6px 11px; border-radius: 5px;
      border: 1px solid var(--rim); background: transparent;
      color: var(--text-soft); cursor: pointer; letter-spacing: 0.01em;
      transition: all 0.2s var(--ease-out);
    }
    .cs-mock-btn:hover { color: var(--text); border-color: var(--gold-soft); }
    .cs-mock-btn--primary {
      background: var(--gold-3); border-color: var(--gold-3); color: #161616;
    }
    .cs-mock-btn--primary:hover { background: var(--gold); border-color: var(--gold); color: var(--text); }
    .cs-mock-btn--ghost { color: var(--text-mute); }

    /* Press timeline (XWECAN) */
    .cs-mock-tl { position: relative; padding-left: 22px; }
    .cs-mock-tl::before {
      content: ""; position: absolute; left: 5px; top: 6px; bottom: 6px;
      width: 1px; background: var(--rim-2);
    }
    .cs-mock-tlitem { position: relative; padding-bottom: 18px; }
    .cs-mock-tlitem:last-child { padding-bottom: 0; }
    .cs-mock-tlitem::before {
      content: ""; position: absolute; left: -20px; top: 6px;
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--gold-3); box-shadow: 0 0 0 3px rgba(160,98,58,0.14);
    }
    .cs-mock-tldate {
      font-family: var(--label); font-size: 10.5px; color: var(--text-mute);
      letter-spacing: 0.06em; margin-bottom: 3px;
    }
    .cs-mock-tlpub {
      font-family: var(--sans); font-weight: 700; font-size: 13px;
      color: var(--text); margin-bottom: 3px;
    }
    .cs-mock-tlhead { font-size: 12px; color: var(--text-soft); line-height: 1.5; }

    /* Weekly brief (Nordic) */
    .cs-mock-brief {
      background: rgba(255,255,255,0.025); border: 1px solid var(--rim);
      border-radius: 10px; padding: 20px; font-family: var(--sans);
    }
    .cs-mock-brief h4 {
      font-weight: 700; font-size: 14px; color: var(--text);
      margin: 0 0 3px; letter-spacing: -0.01em;
    }
    .cs-mock-brief .sub {
      font-family: var(--label); font-size: 10.5px; color: var(--text-mute);
      letter-spacing: 0.04em; margin-bottom: 18px;
    }
    .cs-mock-kpi {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 14px; margin-bottom: 18px; padding-bottom: 18px;
      border-bottom: 1px solid var(--rim);
    }
    .cs-mock-kpi .n {
      font-weight: 800; font-size: 20px; color: var(--text);
      letter-spacing: -0.02em; margin-bottom: 2px;
    }
    .cs-mock-kpi .n.up { color: var(--gold-3); }
    .cs-mock-kpi .n.down { color: var(--cyan); }
    .cs-mock-kpi .l {
      font-family: var(--label); font-size: 10px;
      color: var(--text-mute); letter-spacing: 0.04em;
    }
    .cs-mock-brief .decisions { font-size: 12.5px; line-height: 1.55; color: var(--text-soft); }
    .cs-mock-brief .decisions strong {
      display: block; color: var(--text); font-weight: 700;
      font-size: 11px; letter-spacing: 0.04em;
      text-transform: uppercase; margin-bottom: 8px;
    }
    .cs-mock-brief .decisions p { margin: 0 0 8px; }
    .cs-mock-brief .decisions p:last-child { margin: 0; }

    /* Quote builder (Alpha) */
    .cs-mock-photos {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 8px; margin-bottom: 16px;
    }
    .cs-mock-photo {
      aspect-ratio: 4 / 3; border-radius: 6px;
      background:
        linear-gradient(135deg, rgba(232,220,196,0.06), rgba(160,98,58,0.04)),
        linear-gradient(180deg, #232323, #1A1A1A);
      border: 1px solid var(--rim);
      display: grid; place-items: end center; padding: 6px 8px;
      font-family: var(--label); font-size: 9.5px; color: var(--text-mute);
      letter-spacing: 0.04em; text-align: center;
    }
    .cs-mock-extract {
      background: rgba(255,255,255,0.02); border: 1px solid var(--rim);
      border-radius: 8px; padding: 12px 16px; margin-bottom: 14px;
    }
    .cs-mock-extract-row {
      display: flex; justify-content: space-between; align-items: baseline;
      padding: 6px 0;
      font-family: var(--label); font-size: 11.5px;
      color: var(--text-mute); letter-spacing: 0.04em;
    }
    .cs-mock-extract-row b {
      font-family: var(--sans); font-weight: 700; font-size: 12.5px;
      color: var(--text); letter-spacing: 0;
    }
    .cs-mock-lines {
      background: rgba(255,255,255,0.02); border: 1px solid var(--rim);
      border-radius: 8px; padding: 14px 16px;
    }
    .cs-mock-line {
      display: flex; justify-content: space-between; align-items: baseline;
      padding: 7px 0;
      font-family: var(--sans); font-size: 12.5px; color: var(--text-soft);
      border-bottom: 1px dashed var(--rim);
    }
    .cs-mock-line:last-child { border-bottom: none; }
    .cs-mock-line b {
      font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums;
    }
    .cs-mock-line--total {
      padding-top: 12px; margin-top: 6px;
      border-top: 1px solid var(--rim-2); border-bottom: none;
      font-size: 14px;
    }
    .cs-mock-line--total span { color: var(--text); font-weight: 600; }
    .cs-mock-line--total b { color: var(--gold-3); font-size: 16px; }

    /* Knowledge Q&A (Falcon) */
    .cs-mock-query {
      background: rgba(255,255,255,0.025);
      border: 1px solid var(--rim);
      border-radius: 8px; padding: 14px 16px; margin-bottom: 14px;
    }
    .cs-mock-query-label {
      font-family: var(--label); font-size: 10px; font-weight: 600;
      color: var(--text-mute); letter-spacing: 0.08em;
      text-transform: uppercase; margin-bottom: 8px;
    }
    .cs-mock-query-text {
      font-family: var(--sans); font-size: 14px; font-weight: 500;
      color: var(--text);
    }
    .cs-mock-answer {
      background: rgba(160,98,58,0.06);
      border: 1px solid rgba(160,98,58,0.22);
      border-radius: 8px; padding: 16px 18px; margin-bottom: 14px;
    }
    .cs-mock-answer-label {
      font-family: var(--label); font-size: 10px; font-weight: 600;
      color: var(--gold-3); letter-spacing: 0.08em;
      text-transform: uppercase; margin-bottom: 8px;
    }
    .cs-mock-answer p {
      font-size: 13px; line-height: 1.6; color: var(--text); margin: 0 0 14px;
    }
    .cs-mock-sources {
      display: flex; flex-direction: column; gap: 6px;
      padding-top: 12px; border-top: 1px solid rgba(160,98,58,0.18);
    }
    .cs-mock-source {
      display: flex; justify-content: space-between; align-items: baseline;
      font-family: var(--label); font-size: 11px;
      color: var(--text-mute); letter-spacing: 0.04em;
    }
    .cs-mock-source b {
      font-family: var(--sans); font-weight: 600; font-size: 11.5px;
      color: var(--gold-3); letter-spacing: 0;
    }
    .cs-mock-recent {
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--rim);
      border-radius: 8px; padding: 14px 16px;
    }
    .cs-mock-recent-label {
      font-family: var(--label); font-size: 10px; font-weight: 600;
      color: var(--text-mute); letter-spacing: 0.08em;
      text-transform: uppercase; margin-bottom: 10px;
    }
    .cs-mock-recent-row {
      display: flex; justify-content: space-between; align-items: baseline;
      padding: 7px 0; font-size: 12.5px; color: var(--text-soft);
      border-bottom: 1px dashed var(--rim);
    }
    .cs-mock-recent-row:last-child { border-bottom: none; }
    .cs-mock-recent-row b {
      font-family: var(--sans); font-weight: 700; font-size: 12.5px;
      color: var(--text); font-variant-numeric: tabular-nums;
    }

    @media (max-width: 920px) {
      .cs-layout { grid-template-columns: 1fr; gap: 36px; }
      .cs-side { position: static; }
      .cs-hero { aspect-ratio: 16 / 10; max-width: 100%; }
      .cs-changed-grid { grid-template-columns: 1fr; gap: 22px; }
    }
    @media (max-width: 560px) {
      .cs-card { padding: 22px; }
      .cs-headline { font-size: 19px; padding: 18px 22px 18px 24px; }
    }
  </style>`;

// ---- Interface mocks (one per case study, keyed by slug) ----

const MOCKS = {
  'falcon-freight': `        <div class="cs-mock-bar">
          <div class="cs-mock-dots"><span></span><span></span><span></span></div>
          <div class="cs-mock-title">Knowledge Assistant · 14:23</div>
        </div>
        <div class="cs-mock-body">
          <div class="cs-mock-query">
            <div class="cs-mock-query-label">Coordinator query</div>
            <div class="cs-mock-query-text">What is the status and hold reason on shipment 8842?</div>
          </div>
          <div class="cs-mock-answer">
            <div class="cs-mock-answer-label">Answer</div>
            <p>Shipment 8842 (3 x 40HC, BIC: TGHU 887...) arrived Jebel Ali on 12 May. Currently held by customs pending a missing certificate of origin from the consignee. Customs reference: CR 2026 0511 8842.</p>
            <div class="cs-mock-sources">
              <div class="cs-mock-source"><span>Customs records</span><b>entry CR 2026 0511 8842</b></div>
              <div class="cs-mock-source"><span>Shipment 8842</span><b>arrival manifest</b></div>
            </div>
          </div>
          <div class="cs-mock-recent">
            <div class="cs-mock-recent-label">Earlier today</div>
            <div class="cs-mock-recent-row"><span>Reefer rate agreed with NovaTrade for Q2</span><b>$4,200 / 40HC</b></div>
            <div class="cs-mock-recent-row"><span>Free zone duty on electronics into JAFZA</span><b>5% standard</b></div>
            <div class="cs-mock-recent-row"><span>Open shipments waiting on consignee docs</span><b>7 listed</b></div>
          </div>
        </div>`,
  'acre-holt': `        <div class="cs-mock-bar">
          <div class="cs-mock-dots"><span></span><span></span><span></span></div>
          <div class="cs-mock-title">Morning Brief · Wednesday, 27 May</div>
        </div>
        <div class="cs-mock-body">
          <div class="cs-mock-headline">3 leads need a reply today.</div>
          <div class="cs-mock-card">
            <div class="cs-mock-row">
              <div class="cs-mock-name">Highgate Industrial Park</div>
              <div class="cs-mock-amount">£8.4M</div>
            </div>
            <div class="cs-mock-meta">Met Tuesday · 14:30 · James Caldwell, Acquisitions</div>
            <p class="cs-mock-summary">Asked for the comparables sheet and a 12 month NOI projection before he can take it to his committee.</p>
            <div class="cs-mock-draft">
              <div class="cs-mock-draft-label">Drafted reply</div>
              <p>Hi James, good to meet on Tuesday. Attaching the comparables sheet for Highgate plus a 12 month NOI projection at three rent scenarios. Happy to walk your committee through any of the assumptions on a 20 minute call this week. Best, Sarah</p>
            </div>
            <div class="cs-mock-actions">
              <button class="cs-mock-btn cs-mock-btn--primary">Approve and send</button>
              <button class="cs-mock-btn">Edit</button>
              <button class="cs-mock-btn cs-mock-btn--ghost">Skip</button>
            </div>
          </div>
          <div class="cs-mock-card">
            <div class="cs-mock-row">
              <div class="cs-mock-name">Wandsworth Riverside Block C</div>
              <div class="cs-mock-amount">£4.1M</div>
            </div>
            <div class="cs-mock-meta">Met Tuesday · 10:00 · Priya Shah, Managing Director</div>
          </div>
          <div class="cs-mock-card">
            <div class="cs-mock-row">
              <div class="cs-mock-name">Camden Mews development site</div>
              <div class="cs-mock-amount">£2.7M</div>
            </div>
            <div class="cs-mock-meta">Met Monday · 16:45 · the Foster group</div>
          </div>
        </div>`,
  'alpha-renovations': `        <div class="cs-mock-bar">
          <div class="cs-mock-dots"><span></span><span></span><span></span></div>
          <div class="cs-mock-title">New quote · 14 Cranley Mews, SW7</div>
        </div>
        <div class="cs-mock-body">
          <div class="cs-mock-headline">Kitchen and dining room remodel.</div>
          <div class="cs-mock-photos">
            <div class="cs-mock-photo">Existing kitchen · 4 photos</div>
            <div class="cs-mock-photo">Dining wall · 2 photos</div>
            <div class="cs-mock-photo">Floor plan sketch</div>
          </div>
          <div class="cs-mock-extract">
            <div class="cs-mock-extract-row"><span>Floor area</span><b>23.4 m²</b></div>
            <div class="cs-mock-extract-row"><span>Ceiling height</span><b>2.8 m</b></div>
            <div class="cs-mock-extract-row"><span>Existing sockets</span><b>4 (rewire)</b></div>
            <div class="cs-mock-extract-row"><span>Stud wall removal</span><b>3.2 m</b></div>
          </div>
          <div class="cs-mock-lines">
            <div class="cs-mock-line"><span>Demolition and skip hire</span><b>£2,840</b></div>
            <div class="cs-mock-line"><span>Plastering and skimming</span><b>£3,210</b></div>
            <div class="cs-mock-line"><span>Cabinets (Magnet, mid range)</span><b>£14,400</b></div>
            <div class="cs-mock-line"><span>Worktops (quartz, 30mm)</span><b>£4,800</b></div>
            <div class="cs-mock-line"><span>Plumbing and gas</span><b>£3,650</b></div>
            <div class="cs-mock-line"><span>Electrics and lighting</span><b>£4,200</b></div>
            <div class="cs-mock-line cs-mock-line--total"><span>Total estimate</span><b>£33,100</b></div>
          </div>
          <div class="cs-mock-actions" style="margin-top:14px;">
            <button class="cs-mock-btn cs-mock-btn--primary">Send to client</button>
            <button class="cs-mock-btn">Adjust line items</button>
          </div>
        </div>`,
};

const caseStudyContent = (cs) => `${caseStudyStyles}
  <section class="sec sec--tight" data-section>
    <div class="cs-layout">

      <aside class="cs-side">
        <a href="our-work.html" class="cs-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg><span>Back to our work</span></a>
        <div class="cs-hero reveal">
          <img src="${cs.image}" alt="${cs.client.replace(/&/g, '&amp;')}" loading="eager" decoding="async" fetchpriority="high">
        </div>
        <p class="cs-summary reveal">${cs.summary.replace(/&/g, '&amp;')}</p>
        <div class="cs-tags reveal">
${cs.tags.map(t => `          <span class="cs-tag">${t}</span>`).join('\n')}
        </div>
      </aside>

      <div class="cs-main">
        <h1 class="cs-client reveal">${cs.client.replace(/&/g, '&amp;')}</h1>
        <div class="cs-subtitle reveal">${cs.subtitle}</div>
        <div class="cs-headline reveal">${cs.headline.replace(/&/g, '&amp;')}</div>

        <div class="cs-card reveal">
          <div class="cs-card-label">What was breaking</div>
          <p>${cs.broken.replace(/&/g, '&amp;')}</p>
        </div>

        <div class="cs-card reveal">
          <div class="cs-card-label">What we built</div>
          <ul class="cs-built">
${cs.built.map(b => `            <li>${b.replace(/&/g, '&amp;')}</li>`).join('\n')}
          </ul>
        </div>

        <div class="cs-card reveal">
          <div class="cs-card-label">What it looks like</div>
          <div class="cs-mock">
${MOCKS[cs.slug] || ''}
          </div>
        </div>

        <div class="cs-card reveal">
          <div class="cs-card-label">What changed</div>
          <div class="cs-changed-grid">
${cs.stats.map(s => `            <div><div class="cs-stat-num">${s.num}${s.unit ? `<span class="u">${s.unit}</span>` : ''}</div><div class="cs-stat-label">${s.label}</div></div>`).join('\n')}
          </div>
        </div>

        <div class="cs-cta-row">
          ${auditCTA}
        </div>
      </div>

    </div>
  </section>`;

rebuild('our-work.html', 'LaunchRise Our Work', ourWorkContent);
rebuild('services.html', 'LaunchRise Services', servicesContent);
rebuild('academy.html', 'LaunchRise Academy', academyContent);
rebuild('pain.html', 'LaunchRise Pain', painContent);
rebuild('news.html', 'LaunchRise News', newsContent);
// Generate one HTML page per news article
for (const post of NEWS_POSTS) {
  rebuild(`news-${post.slug}.html`, `LaunchRise News — ${post.title}`, articleContent(post));
}
// Generate one HTML page per case study
for (const cs of CASE_STUDIES) {
  rebuild(`case-study-${cs.slug}.html`, `LaunchRise Case Study: ${cs.client}`, caseStudyContent(cs));
}
console.log('done');
