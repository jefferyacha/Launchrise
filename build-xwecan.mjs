/**
 * build-xwecan.mjs
 * Standalone builder for case-study-xwecan.html. Independent of build-subpages.mjs
 * so the other Claude instance's edits to that file do not delete or overwrite
 * this case study. Run: node build-xwecan.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.dirname(decodeURI(new URL(import.meta.url).pathname.replace(/^\//, '')));

const xwecan = {
  slug: 'xwecan',
  client: 'XWECAN',
  subtitle: 'Bootstrapped Founder · Press & Visibility · 2024 to 2026',
  image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&h=700&fit=crop&q=75&auto=format',
  headline: `Forbes, WSJ, Fortune, and the BBC inside six months. From zero.`,
  summary: `We helped XWECAN's founder go from zero press to features in Forbes, WSJ, Fortune, and the BBC inside six months by building a journalist intelligence layer, an angle specific pitch engine, and a coverage tracker that runs without a PR firm.`,
  tags: ['Press Intelligence', 'Founder Brand', 'Coverage Tracking'],
  broken: `PR firms quote £8k a month and pitch the same generic angles to the same overworked journalists. For a founder building in a category nobody was writing about, that gets you nothing. The work had to start from the journalist side, not the brand side.`,
  built: [
    `A journalist intelligence layer that maps every writer covering an adjacent beat, the angles they reach for, and the windows when they're hunting for sources.`,
    `A pitch engine that drafts angle specific outreach in the founder's voice, with concrete data hooks pulled from the company's own metrics each week.`,
    `A coverage tracker that catches every mention, surfaces who picked up what, and flags follow up opportunities to chase the next morning.`,
    `A press kit auto updater that keeps the founder bio, photo set, and data sheet current so journalists can self serve at any hour.`,
  ],
  stats: [
    { num: '27', unit: '',  label: 'tier one press placements in 12 months' },
    { num: '6',  unit: 'mo', label: 'from zero coverage to BBC feature' },
    { num: '4.3', unit: 'M', label: 'monthly impressions attributed at peak' },
  ],
};

const xwecanMock = `        <div class="cs-mock-bar">
          <div class="cs-mock-dots"><span></span><span></span><span></span></div>
          <div class="cs-mock-title">Press tracker · last 90 days</div>
        </div>
        <div class="cs-mock-body">
          <div class="cs-mock-headline">12 placements logged.</div>
          <div class="cs-mock-tl">
            <div class="cs-mock-tlitem">
              <div class="cs-mock-tldate">14 May · BBC</div>
              <div class="cs-mock-tlpub">BBC Business Live segment</div>
              <div class="cs-mock-tlhead">Founder profiled in a 6 minute on air segment on the morning slate.</div>
            </div>
            <div class="cs-mock-tlitem">
              <div class="cs-mock-tldate">28 Apr · Forbes</div>
              <div class="cs-mock-tlpub">Forbes 30 Under 30 mention</div>
              <div class="cs-mock-tlhead">Quoted in the consumer technology shortlist roundup, edition 14.</div>
            </div>
            <div class="cs-mock-tlitem">
              <div class="cs-mock-tldate">12 Apr · Wall Street Journal</div>
              <div class="cs-mock-tlpub">WSJ tech sector op ed</div>
              <div class="cs-mock-tlhead">Founder authored a 900 word op ed on category creation, 1.1M impressions in 48 hours.</div>
            </div>
            <div class="cs-mock-tlitem">
              <div class="cs-mock-tldate">03 Apr · Fortune</div>
              <div class="cs-mock-tlpub">Fortune Top 100 emerging brands</div>
              <div class="cs-mock-tlhead">Company listed at rank 41 in the annual emerging brands index.</div>
            </div>
          </div>
        </div>`;

const auditCTA = `<a href="https://cal.com/launchrise/audit" target="_blank" rel="noopener" class="btn btn--gold btn-cta-pulse">Let's talk
  <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
</a>`;

const caseStudyStyles = `
  <style>
    .cs-layout {
      max-width: 1180px; margin: 0 auto; padding: 0 24px;
      display: grid; grid-template-columns: 340px 1fr;
      gap: 56px; align-items: start;
    }
    .cs-side { position: sticky; top: 96px; }
    .cs-back {
      font-family: var(--mono); font-size: 12px; color: var(--gold-3);
      letter-spacing: 0.06em; text-transform: uppercase;
      display: inline-flex; align-items: center; gap: 8px;
      min-height: 44px; padding: 12px 0; margin-bottom: 18px;
      text-decoration: none; transition: color 0.2s var(--ease-out);
    }
    .cs-back::before {
      content: ""; width: 16px; height: 1.5px; background: currentColor;
      transition: width 0.3s var(--ease-spring);
    }
    .cs-back:hover { color: var(--gold); }
    .cs-back:hover::before { width: 24px; }

    .cs-hero {
      position: relative; aspect-ratio: 4 / 5;
      border-radius: 14px; overflow: hidden;
      border: 1px solid var(--rim);
      background: var(--ink-2);
      box-shadow: 0 28px 60px -28px rgba(0,0,0,0.5);
      margin-bottom: 22px;
    }
    .cs-hero img {
      width: 100%; height: 100%; object-fit: cover;
      display: block; filter: saturate(0.96) contrast(1.02);
    }
    .cs-hero::after {
      content: ""; position: absolute; inset: 0; pointer-events: none;
      background: linear-gradient(180deg, transparent 50%, rgba(12,12,12,0.4) 100%);
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
      font-family: var(--label); font-size: 12px; font-weight: 500;
      color: var(--gold-3); letter-spacing: 0.12em;
      text-transform: uppercase; margin-bottom: 16px;
      display: inline-flex; align-items: center; gap: 12px;
    }
    .cs-eyebrow::before {
      content: ""; width: 28px; height: 1.5px; background: currentColor;
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
      font-size: clamp(22px, 2.6vw, 30px); line-height: 1.3;
      color: var(--gold-3); margin: 0 0 48px;
      padding: 20px 0 24px; border-top: 1px solid var(--rim);
      border-bottom: 1px solid var(--rim);
      letter-spacing: -0.01em;
    }

    .cs-card {
      border-radius: 16px; padding: 32px;
      background: linear-gradient(180deg, rgba(255,255,255,0.038), rgba(255,255,255,0.012));
      border: 1px solid var(--rim);
      margin-bottom: 18px;
      transition: border-color 0.4s var(--ease-out);
    }
    .cs-card:hover { border-color: var(--gold-soft); }
    .cs-card-label {
      font-family: var(--label); font-size: 11px; font-weight: 600;
      color: var(--gold-3); letter-spacing: 0.12em;
      text-transform: uppercase; margin: 0 0 16px;
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
      letter-spacing: -0.04em; color: var(--gold-3);
      margin-bottom: 10px;
    }
    .cs-stat-num .u {
      font-family: var(--serif); font-weight: 600;
      font-size: 0.38em; color: var(--cyan);
      margin-left: 4px; letter-spacing: 0;
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

    .cs-mock {
      margin: 0; border-radius: 12px; overflow: hidden; position: relative;
      background: linear-gradient(180deg, #1A1A1A, #141414);
      border: 1px solid var(--rim);
      box-shadow: 0 24px 60px -28px rgba(0,0,0,0.6);
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

    @media (max-width: 920px) {
      .cs-layout { grid-template-columns: 1fr; gap: 36px; }
      .cs-side { position: static; }
      .cs-hero { aspect-ratio: 16 / 10; max-width: 100%; }
      .cs-changed-grid { grid-template-columns: 1fr; gap: 22px; }
    }
    @media (max-width: 560px) {
      .cs-card { padding: 22px; }
      .cs-headline { font-size: 19px; padding: 16px 0; }
    }
  </style>`;

const content = `${caseStudyStyles}
  <section class="sec sec--tight" data-section>
    <div class="cs-layout">

      <aside class="cs-side">
        <a href="our-work.html" class="cs-back">Back to our work</a>
        <div class="cs-hero reveal">
          <img src="${xwecan.image}" alt="${xwecan.client}" loading="eager" decoding="async" fetchpriority="high">
        </div>
        <p class="cs-summary reveal">${xwecan.summary}</p>
        <div class="cs-tags reveal">
${xwecan.tags.map(t => `          <span class="cs-tag">${t}</span>`).join('\n')}
        </div>
      </aside>

      <div class="cs-main">
        <div class="cs-eyebrow reveal">Case study</div>
        <h1 class="cs-client reveal">${xwecan.client}</h1>
        <div class="cs-subtitle reveal">${xwecan.subtitle}</div>
        <div class="cs-headline reveal">${xwecan.headline}</div>

        <div class="cs-card reveal">
          <div class="cs-card-label">What was breaking</div>
          <p>${xwecan.broken}</p>
        </div>

        <div class="cs-card reveal">
          <div class="cs-card-label">What we built</div>
          <ul class="cs-built">
${xwecan.built.map(b => `            <li>${b}</li>`).join('\n')}
          </ul>
        </div>

        <div class="cs-card reveal">
          <div class="cs-card-label">What it looks like</div>
          <div class="cs-mock">
${xwecanMock}
          </div>
        </div>

        <div class="cs-card reveal">
          <div class="cs-card-label">What changed</div>
          <div class="cs-changed-grid">
${xwecan.stats.map(s => `            <div><div class="cs-stat-num">${s.num}${s.unit ? `<span class="u">${s.unit}</span>` : ''}</div><div class="cs-stat-label">${s.label}</div></div>`).join('\n')}
          </div>
        </div>

        <div class="cs-cta-row">
          ${auditCTA}
        </div>
      </div>

    </div>
  </section>`;

const title = 'LaunchRise Case Study: XWECAN';
const file  = 'case-study-xwecan.html';

const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
let out = idx.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
const startMarker = '  <!-- HERO -->';
const endMarker = '  <footer class="foot">';
const s = out.indexOf(startMarker);
const e = out.indexOf(endMarker);
if (s < 0 || e < 0) throw new Error(`markers not found: s=${s} e=${e}`);
out = out.slice(0, s) + content + '\n\n' + out.slice(e);
out = out.replace(/href="#(about|services|pain|receipts|pricing|academy|faq|process|work|stack|founder|news)"/g, 'href="index.html#$1"');
out = out.replace(
  '<nav class="nav-links" aria-label="Primary">',
  '<nav class="nav-links" aria-label="Primary">\n        <a href="index.html">Home</a>'
);
out = out.replace(
  /<nav>\s*<a href="pain\.html">Pain<\/a>/,
  '<nav>\n      <a href="index.html">Home</a>\n      <a href="pain.html">Pain</a>'
);
const currentNav = 'our-work.html';
out = out.split(`href="${currentNav}"`).join(`href="${currentNav}" aria-current="page"`);
fs.writeFileSync(path.join(ROOT, file), out);
console.log('rebuilt', file);
