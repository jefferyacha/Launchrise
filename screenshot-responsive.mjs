import puppeteer from 'puppeteer';
const profiles = [
  { name: 'tablet',  w: 820,  h: 1180 },
  { name: 'mobile',  w: 390,  h: 844 },
];
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
for (const p of profiles) {
  const page = await browser.newPage();
  await page.setViewport({ width: p.w, height: p.h, deviceScaleFactor: 1 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: `temporary screenshots/v2-${p.name}.png`, fullPage: true });
  await page.close();
  console.log('saved', p.name);
}
await browser.close();
