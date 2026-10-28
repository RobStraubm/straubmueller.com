// llms.txt (llmstxt.org): the site as plain text for language models and AI assistants, built from the same data as
// the pages, so it cannot drift from them.
import type { APIRoute } from 'astro';
import { aboutText, experience, education, awards } from '../data/cv';
import { cases } from '../lib/cases';

const site = 'https://straubmueller.com';
const line = (item: { years: string; title: string; org: string; note?: string }) =>
  `- ${item.years}: ${item.title}, ${item.org}${item.note ? `. ${item.note}` : ''}`;

export const GET: APIRoute = () => {
  const text = `# Robert Straubmüller

> Co-founder of Levelwork (Konstanz, Germany), since August 2026. UX research, design and AI engineering: Robert researches, designs and builds software for people who are not experts.

${aboutText}

Contact: robert@straubmueller.com · LinkedIn: https://www.linkedin.com/in/robert-straubmueller · GitHub: https://github.com/RobStraubm · Levelwork: https://levelwork.ai

## Case studies

${cases.map((c) => `- [${c.title}](${site}/work/${c.slug}/) (${c.years}): ${c.summary}${c.role ? ` Role: ${c.role}.` : ''}`).join('\n')}

## Experience

${experience.map(line).join('\n')}

## Education

${education.map(line).join('\n')}

## Awards

${awards.map((a) => `- ${a.year}: ${a.title}, for ${a.for}`).join('\n')}

## More

- [About](${site}/about/): CV and background
- [CV as PDF](${site}/robert-straubmueller-cv.pdf)
- [All projects](${site}/work/), including earlier brand and editorial work
- [Colophon](${site}/colophon/): how this site is built; the code is public at https://github.com/RobStraubm/straubmueller.com
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
