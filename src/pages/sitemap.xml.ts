// The sitemap: the live pages only; drafts under /varianten and the *-v2 cases stay out.
import type { APIRoute } from 'astro';
import { cases } from '../lib/cases';

const pages = ['/', '/about/', '/work/', '/cv/', '/colophon/', ...cases.map((c) => `/work/${c.slug}/`), '/impressum/', '/datenschutz/'];

export const GET: APIRoute = ({ site }) => {
  const urls = pages.map((path) => `  <url><loc>${new URL(path, site)}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
