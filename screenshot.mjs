import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.dirname(url.fileURLToPath(import.meta.url));
const OUT_DIR = path.join(ROOT, 'temporary screenshots');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const target = process.argv[2] || 'http://localhost:3000';
const label  = process.argv[3] || '';
const mode   = process.argv[4] || 'full'; // 'full' | 'viewport'

// pick next index N
const existing = fs.readdirSync(OUT_DIR).filter(f => /^screenshot-\d+/.test(f));
let n = 1;
for (const f of existing) {
  const m = f.match(/^screenshot-(\d+)/);
  if (m) n = Math.max(n, parseInt(m[1], 10) + 1);
}
const filename = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;
const outPath = path.join(OUT_DIR, filename);

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(target, { waitUntil: 'networkidle0', timeout: 60000 });
    // Allow webfonts/animations to settle
    await new Promise(r => setTimeout(r, 800));
    // Pre-scroll through the whole page so IntersectionObserver-driven reveals fire
    await page.evaluate(async () => {
      // disable smooth scroll so jumping back to top is instant
      document.documentElement.style.scrollBehavior = 'auto';
      const h = document.documentElement.scrollHeight;
      const step = Math.max(window.innerHeight * 0.7, 400);
      for (let y = 0; y < h; y += step) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise(r => setTimeout(r, 90));
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 500));
    });
    // mode can be: 'full', 'viewport', or '#anchor' to scroll to an element
    if (mode.startsWith('#')) {
      await page.evaluate(sel => {
        const el = document.querySelector(sel);
        if (el) el.scrollIntoView({ block: 'start' });
      }, mode);
      await new Promise(r => setTimeout(r, 400));
      await page.screenshot({ path: outPath, fullPage: false });
    } else {
      await page.screenshot({ path: outPath, fullPage: mode !== 'viewport' });
    }
    console.log(`Saved: ${outPath}`);
  } finally {
    await browser.close();
  }
})().catch(err => {
  console.error(err);
  process.exit(1);
});
