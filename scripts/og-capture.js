// Preview cards (Open Graph), one per page: a case shows the last frame of the stage it opens with, every other
// page the first view of the home page. Run against the local preview (npx astro preview) with Playwright's
// browser_run_code and this file; it writes 1600×840 PNGs to befund/og-raw/, which scripts/og-scale.sh turns into
// the 1200×630 JPEGs in public/og/. Reduced motion makes each stage show its last frame without scrolling.
async (page) => {
  const base = 'http://127.0.0.1:4321';
  const out = '/Users/robert/Desktop/Job/Portfolio/befund/og-raw/';
  const cases = ['levelwork', 'meeting-minutes', 'saunter', 'stub', 'colla-parte', 'sayfit', 'flowculate', 'sustainable-iot', 'tealucent', 'conactive', 'stayin-alive'];
  await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
  await page.setViewportSize({ width: 1600, height: 840 });
  const shoot = async (path, name) => {
    await page.goto(base + path);
    await page.waitForTimeout(1500);
    // The comparison switches exist only on this machine.
    await page.evaluate(() => document.querySelectorAll('.palette-switch').forEach((el) => el.remove()));
    await page.screenshot({ path: `${out}${name}.png` });
  };
  for (const slug of cases) await shoot(`/work/${slug}/`, slug);
  await shoot('/', 'home');
  return 'ok';
}
