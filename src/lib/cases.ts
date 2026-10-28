// The live case pages, read from their source at build time, for llms.txt and the sitemap: slug, title, years,
// summary and role as the page states them. Drafts (*-v2) stay out.
const sources = import.meta.glob('../pages/work/*.astro', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export interface CaseEntry {
  slug: string;
  title: string;
  years: string;
  summary: string;
  role?: string;
}

const prop = (source: string, name: string) => source.match(new RegExp(`\\n\\s*${name}="([^"]*)"`))?.[1];

/** The order of the home page's list. */
const order = ['levelwork', 'meeting-minutes', 'saunter', 'stub', 'colla-parte', 'sayfit', 'flowculate', 'sustainable-iot', 'tealucent', 'conactive', 'stayin-alive'];

export const cases: CaseEntry[] = Object.entries(sources)
  .map(([path, source]) => ({
    slug: path.split('/').pop()!.replace('.astro', ''),
    title: prop(source, 'title') ?? '',
    years: prop(source, 'years') ?? '',
    summary: prop(source, 'summary') ?? '',
    role: source.match(/\['Role', '([^']*)'\]/)?.[1],
  }))
  .filter((entry) => entry.title && !entry.slug.endsWith('-v2'))
  .sort((a, b) => (order.indexOf(a.slug) + 1 || 99) - (order.indexOf(b.slug) + 1 || 99));
