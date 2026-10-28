// After the drafts are removed from dist, their images and scripts would still sit in dist/_astro, unlinked but
// reachable. This deletes every file there that no remaining page, script or stylesheet names.
import { readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const dist = process.argv[2] ?? 'dist';
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const texts = new Map(walk(dist).filter((path) => /\.(html|css|js|mjs|json|xml|txt)$/.test(path)).map((path) => [path, readFileSync(path, 'utf8')]));
let removed = 0;
// Scripts name each other, so a script only the drafts used frees what it named: repeat until nothing more goes.
for (let changed = true; changed; ) {
  changed = false;
  for (const path of walk(join(dist, '_astro'))) {
    const name = basename(path);
    const named = [...texts].some(([other, text]) => other !== path && text.includes(name));
    if (named) continue;
    rmSync(path);
    texts.delete(path);
    removed++;
    changed = true;
  }
}
console.log(`removed ${removed} unused files from ${dist}/_astro`);
