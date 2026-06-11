import puppeteer from 'puppeteer';
import fs from 'node:fs';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const URLS = ['http://localhost:3000/', 'http://localhost:3000/services.html', 'http://localhost:3000/academy.html', 'http://localhost:3000/pain.html', 'http://localhost:3000/our-work.html', 'http://localhost:3000/news.html', 'http://localhost:3000/news-anthropic-claude-opus-47-1m-context.html'];

// === web-checker pass: responsive + link integrity ===
const webIssues = [];
for (const url of URLS) {
  for (const w of [360, 768, 1440]) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    const r = await page.evaluate(() => ({
      hOverflow: document.documentElement.scrollWidth - window.innerWidth,
      navbars: document.querySelectorAll('#siteHeader').length,
      footers: document.querySelectorAll('footer.foot').length,
      emDash: (document.body.innerText.match(/—/g) || []).length,
      blogRef: !!document.querySelector('a[href*="blog.html"]'),
      deadAnchors: Array.from(document.querySelectorAll('a[href^="#"]')).filter(a => a.getAttribute('href') !== '#' && !document.getElementById(a.getAttribute('href').slice(1))).map(a => a.getAttribute('href')),
    }));
    if (r.hOverflow > 2 || r.navbars !== 1 || r.footers !== 1 || r.emDash || r.blogRef || r.deadAnchors.length) {
      webIssues.push({ url, w, ...r });
    }
    await page.close();
  }
}

// === emil + impeccable: code-level violations ===
const codeIssues = [];
const indexHtml = fs.readFileSync('index.html', 'utf8');

// emil: transition: all
const transAll = indexHtml.match(/transition:\s*all\b/g);
if (transAll) codeIssues.push({ k: 'transition: all', count: transAll.length, fix: 'specify property (transform, opacity)' });

// emil: scale(0) on enter
const scaleZero = indexHtml.match(/transform:\s*scale\(0\)/g);
if (scaleZero) codeIssues.push({ k: 'scale(0) entry', count: scaleZero.length, fix: 'start from scale(0.95) + opacity 0' });

// emil: ease-in on UI animations (any line with ease-in but NOT ease-in-out and not ease-in-out)
const easeInLines = indexHtml.split('\n').filter(line => /\bease-in\b/.test(line) && !/ease-in-out/.test(line));
if (easeInLines.length) codeIssues.push({ k: 'ease-in', count: easeInLines.length, fix: 'use ease-out or custom curve' });

// impeccable: side-stripe borders (border-left/right > 1px as accent)
const stripeBorders = indexHtml.match(/border-(left|right):\s*[2-9]px/g);
if (stripeBorders) codeIssues.push({ k: 'side-stripe border', count: stripeBorders.length, fix: 'use full border or background tint' });

// impeccable: gradient text (background-clip: text)
const gradText = indexHtml.match(/background-clip:\s*text|-webkit-background-clip:\s*text/g);
if (gradText) codeIssues.push({ k: 'gradient text', count: gradText.length, fix: 'use solid color; emphasis via weight/size' });

// emil: animation duration > 300ms on UI (rough heuristic)
const longTransitions = indexHtml.match(/transition[^;]*\b([4-9]\d\d|\d{4,})ms/g);
if (longTransitions) codeIssues.push({ k: 'transition > 300ms', count: longTransitions.length, examples: longTransitions.slice(0, 3) });

// === buttons: active state with scale? ===
const btnActive = indexHtml.match(/\.btn[^{]*:active[^{]*\{[^}]*transform:\s*scale/g);
const hasBtnActiveScale = !!btnActive;

await browser.close();

console.log('\n=== WEB-CHECKER ===');
if (webIssues.length === 0) console.log('clean across all pages × breakpoints'); else console.log(JSON.stringify(webIssues, null, 2));

console.log('\n=== EMIL + IMPECCABLE CODE AUDIT ===');
if (codeIssues.length === 0) console.log('clean — no violations'); else console.log(JSON.stringify(codeIssues, null, 2));

console.log('\nBUTTON :active scale present?', hasBtnActiveScale ? 'YES' : 'NO (emil rule: buttons need scale(0.97) on press)');
