import puppeteer from 'puppeteer';
const url = process.argv[2] || 'http://localhost:3000/services.html';
const label = process.argv[3] || 'audit';
const profiles = [
  { name: 'sm360',   w: 360,  h: 760 },
  { name: 'md768',   w: 768,  h: 1024 },
  { name: 'lg1440',  w: 1440, h: 900 },
];
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
for (const p of profiles) {
  const page = await browser.newPage();
  await page.setViewport({ width: p.w, height: p.h, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 600));
  // measure double scrollbar: compare documentElement.scrollWidth vs window.innerWidth
  const overflow = await page.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    docH: document.documentElement.scrollHeight,
    winW: window.innerWidth,
    bodyOverflowY: getComputedStyle(document.body).overflowY,
    htmlOverflowY: getComputedStyle(document.documentElement).overflowY,
  }));
  await page.screenshot({ path: `temporary screenshots/${label}-${p.name}.png`, fullPage: true });
  console.log(p.name, overflow);
  await page.close();
}
await browser.close();
