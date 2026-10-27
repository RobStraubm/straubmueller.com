// Renders the films into the site's public folder, each with its last frame as a poster.
// Version E: Flowculate in the plan style, light and dark. Version F: poster style, dark only,
// plus title cards for projects without a film yet. Styles for G and H and the style comparison:
// 'kinetic' (dark, plus a wide intro), 'bauhaus' (cream), 'dots' (dark), one film per project script.
// Version I: every selected project in the poster style, light and dark like the page ('i', optionally
// followed by a comma-separated list of keys to render only those).
// Pass REMOTION_BROWSER=/path/to/chrome-headless-shell to reuse a browser that is already on disk.
import { execFileSync } from 'node:child_process';

const out = '../public/motion';
const browser = process.env.REMOTION_BROWSER ? ['--browser-executable', process.env.REMOTION_BROWSER] : [];
const only = process.argv[2]; // 'e' or 'f' to render one version
const run = (...args) => execFileSync('npx', ['remotion', ...args, ...browser], { stdio: 'inherit' });

const film = (id, file, props) => {
  const json = `--props=${JSON.stringify(props)}`;
  run('render', 'src/index.ts', id, `${file}.mp4`, json, '--crf=24', '--muted');
  run('still', 'src/index.ts', id, `${file}.jpg`, json, '--frame=-1', '--jpeg-quality=88');
};

if (!only || only === 'e') {
  for (const theme of ['light', 'dark']) film('Flowculate', `${out}/flowculate-${theme}`, { theme });
}

if (!only || only === 'f') {
  film('Flowculate', `${out}/f/flowculate`, { theme: 'dark', titles: true });
  film('Constat', `${out}/f/constat`, { theme: 'dark' });
  film('Saunter', `${out}/f/saunter`, { theme: 'dark' });
  // A title card for every project, so the frame never falls back to a photo or nothing.
  const { recent, brand, slug } = await import('../src/data/projects.ts');
  for (const p of [...recent, ...brand]) {
    const card = { theme: 'dark', title: p.title, line: p.line, years: p.years, client: p.client };
    run('still', 'src/index.ts', 'TitleCard', `${out}/f/card-${slug(p.title)}.jpg`, `--props=${JSON.stringify(card)}`, '--jpeg-quality=88');
  }
}

const PROJECTS = ['levelwork', 'ai-meeting-minutes', 'saunter', 'sayfit', 'flowculate', 'sustainable-iot', 'tealucent', 'conactive', 'stayin-alive'];

if (!only || only === 'kinetic') {
  for (const script of PROJECTS) film('Kinetic', `${out}/kinetic/${script}`, { theme: 'dark', script });
  film('KineticIntro', `${out}/kinetic/intro`, { theme: 'dark', script: 'intro' });
}
if (!only || only === 'bauhaus') {
  for (const script of PROJECTS) film('Bauhaus', `${out}/bauhaus/${script}`, { script });
}
if (!only || only === 'dots') {
  for (const script of PROJECTS) film('Dots', `${out}/dots/${script}`, { script });
}
// Keys are slug(title) of the project on the page; values are the composition and its extra props.
const I_FILMS = {
  levelwork: ['Constat', {}],
  'ai-meeting-minutes': ['Minutes', {}],
  saunter: ['Saunter', {}],
  notenprogramm: ['Notenprogramm', {}],
  sayfit: ['SayFit', {}],
  stub: ['Beleg', {}],
  flowculate: ['Flowculate', { titles: true }],
  'sustainable-iot': ['Iot', {}],
  tealucent: ['Tealucent', {}],
  conactive: ['Conactive', {}],
  'stayin-alive': ['Stayin', {}],
};
if (!only || only === 'i') {
  const keys = process.argv[3] ? process.argv[3].split(',') : Object.keys(I_FILMS);
  for (const key of keys) {
    const [id, props] = I_FILMS[key];
    for (const theme of ['light', 'dark']) film(id, `${out}/i/${key}-${theme}`, { ...props, theme });
  }
}
if (only === 'cards-light') {
  // Light title cards for version G's overview, which sits on paper.
  const { recent, brand, slug } = await import('../src/data/projects.ts');
  for (const p of [...recent, ...brand]) {
    const card = { theme: 'light', title: p.title, line: p.line, years: p.years, client: p.client };
    run('still', 'src/index.ts', 'TitleCard', `${out}/cards-light/card-${slug(p.title)}.jpg`, `--props=${JSON.stringify(card)}`, '--jpeg-quality=88');
  }
}
