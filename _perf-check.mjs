import puppeteer from 'puppeteer';

const URLS = [
  'http://localhost:3000/',
  'http://localhost:3000/services.html',
  'http://localhost:3000/academy.html',
  'http://localhost:3000/pain.html',
  'http://localhost:3000/our-work.html',
  'http://localhost:3000/news.html',
  'http://localhost:3000/news-anthropic-claude-opus-47-1m-context.html',
];

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const results = [];
const errors = [];

for (const url of URLS) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push({ url, msg: String(e.message || e) }));
  page.on('console', m => { if (m.type() === 'error') pageErrors.push({ url, msg: m.text() }); });
  page.on('requestfailed', r => pageErrors.push({ url, msg: `request failed: ${r.url()} – ${r.failure()?.errorText}` }));

  const t0 = Date.now();
  await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  const loadMs = Date.now() - t0;

  // Wait briefly for late requests
  await new Promise(r => setTimeout(r, 600));

  const perf = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paints = performance.getEntriesByType('paint');
    const fcp = paints.find(p => p.name === 'first-contentful-paint');
    return {
      domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
      loadEvent: nav ? Math.round(nav.loadEventEnd) : null,
      fcp: fcp ? Math.round(fcp.startTime) : null,
      transferSize: Math.round((nav?.transferSize || 0) / 1024),
    };
  });

  results.push({ url: url.replace('http://localhost:3000', '') || '/', loadMs, ...perf });
  if (pageErrors.length) errors.push(...pageErrors);
  await page.close();
}

await browser.close();

console.log('\n=== PERF (cold cache) ===');
console.table(results);

console.log('\n=== ERRORS ===');
if (errors.length === 0) console.log('none'); else console.log(JSON.stringify(errors, null, 2));
