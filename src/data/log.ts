// Dated record of what Robert shipped or finished. Every date must be backed by the CV or a public link.

export interface LogEntry {
  date: string;
  /** Sort key, YYYY-MM. */
  sort: string;
  text: string;
  kind: 'Startup' | 'Client' | 'Own' | 'Open source' | 'Research' | 'Learning' | 'Award';
  href?: string;
  linkLabel?: string;
  /** Shown in the short list on the homepage. The rest stays on record here. */
  home?: true;
  /** Matches an image key in the page that renders the log. */
  trace?: 'flowculate' | 'poc' | 'iot' | 'storyboard' | 'sketchbook';
}

export const log: LogEntry[] = [
  {
    date: 'Oct 2026',
    sort: '2026-10',
    text: 'Colla parte, a Mac app that turns choir PDFs into practice MP3s, built in nine days',
    kind: 'Own',
  },
  {
    date: 'Oct 2026',
    sort: '2026-10',
    text: 'Belegscanner, my receipt scanner, is open source as Stub',
    kind: 'Open source',
    href: 'https://github.com/RobStraubm/stub',
    linkLabel: 'GitHub',
  },
  {
    date: 'Oct 2026',
    sort: '2026-10',
    text: 'This website, open source and built with Claude Code',
    kind: 'Open source',
    href: 'https://github.com/RobStraubm/straubmueller.com',
    linkLabel: 'GitHub',
  },
  {
    date: 'Oct 2026',
    sort: '2026-10',
    text: 'Ambacta, AI meeting minutes, goes into pilot at a district administration',
    home: true,
    kind: 'Client',
  },
  {
    date: 'Oct 2026',
    sort: '2026-10',
    text: 'Saunter, my walking-pad companion, is open source',
    kind: 'Open source',
    href: 'https://github.com/RobStraubm/saunter',
    linkLabel: 'GitHub',
  },
  {
    date: '2026',
    sort: '2026-08',
    text: 'Started building Levelwork with Michael Gajda',
    home: true,
    kind: 'Startup',
    href: 'https://levelwork.ai',
    linkLabel: 'levelwork.ai',
  },
  {
    date: 'Jun 2026',
    sort: '2026-06',
    text: 'SayFit, a voice food logger, built as a team of four',
    home: true,
    kind: 'Learning',
    href: 'https://github.com/RobStraubm/sayfit',
    linkLabel: 'GitHub',
  },
  {
    date: 'Jun 2026',
    sort: '2026-06',
    text: 'Finished the AI Engineering bootcamp at neue fische',
    kind: 'Learning',
  },
  {
    date: 'Jan 2025',
    sort: '2025-01',
    text: 'Flowculate 2.0: a research simulation becomes a public web app',
    home: true,
    kind: 'Research',
    href: 'https://flowculate.eu',
    linkLabel: 'flowculate.eu',
    trace: 'flowculate',
  },
  {
    date: 'Jun 2024',
    sort: '2024-06',
    text: 'A design sprint turns an IoT lab towards ecological footprints',
    kind: 'Research',
    trace: 'storyboard',
  },
  {
    date: 'Jun 2023',
    sort: '2023-06',
    text: 'User-testing workshop for Flowculate at HTWG Konstanz',
    kind: 'Research',
    trace: 'poc',
  },
  {
    date: '2022–24',
    sort: '2022-10',
    text: 'Tealucent, a design system for a small developer team',
    home: true,
    kind: 'Client',
  },
  {
    date: '2022',
    sort: '2022-07',
    text: 'Master’s thesis Conactive wins a Konstanz Design Award, 1st prize',
    kind: 'Award',
    href: 'https://www.htwg-konstanz.de/bachelor/kommunikationsdesign/abschlussarbeiten/konstanzer-designpreis/straubueller-robert',
    linkLabel: 'HTWG',
    trace: 'sketchbook',
  },
];
