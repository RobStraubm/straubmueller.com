// The nine projects on the homepage of versions G and H, newest first. Same facts as version F.
// Films are found by slug(title) in /public/motion/<style>/.

export interface Selected {
  years: string;
  title: string;
  line: string;
  /** Who the work was for. 'Own' marks self-initiated work. */
  client: string;
  status?: string;
  live?: boolean;
  href?: string;
  link?: string;
}

export const selected: Selected[] = [
  {
    years: '2026–',
    title: 'Levelwork',
    line: 'Co-founder. Constat shows how work is really distributed in an organisation.',
    client: 'Own',
    status: 'Startup',
    live: true,
    href: 'https://levelwork.ai',
    link: 'levelwork.ai',
  },
  {
    years: '2026',
    title: 'Ambacta',
    line: 'AI meeting minutes: product design and build, in pilot at a district administration.',
    client: 'gyv',
    status: 'Pilot',
    live: true,
  },
  {
    years: '2026',
    title: 'Saunter',
    line: 'Walk while you work: a walking-pad companion for the Mac, built with Claude Code.',
    client: 'Own',
    status: 'Open source',
    live: true,
    href: 'https://github.com/RobStraubm/saunter',
    link: 'GitHub',
  },
  {
    years: '2026',
    title: 'SayFit',
    line: 'Voice food logger, team of four. Co-built the pipeline, tests and web UI.',
    client: 'Own',
    status: 'Team project',
    href: 'https://github.com/RobStraubm/sayfit',
    link: 'GitHub',
  },
  {
    years: '2022–25',
    title: 'Flowculate',
    line: 'From a math-only research tool to a public web app. Concept, UI, brand, project lead.',
    client: 'HTWG Konstanz',
    status: 'Live',
    live: true,
    href: 'https://flowculate.eu',
    link: 'flowculate.eu',
  },
  {
    years: '2024',
    title: 'Sustainable IoT',
    line: 'A design sprint that turned an IoT lab towards ecological footprints.',
    client: 'HTWG Konstanz',
    status: 'Research',
  },
  {
    years: '2022–24',
    title: 'Tealucent',
    line: 'Design system for goconut’s small developer team, tested with ten people.',
    client: 'user generated design',
    status: 'User-tested',
  },
  {
    years: '2022',
    title: 'Conactive',
    line: 'Master’s thesis on interacting with connected systems.',
    client: 'Own',
    status: '1st prize',
    href: 'https://www.htwg-konstanz.de/bachelor/kommunikationsdesign/abschlussarbeiten/konstanzer-designpreis/straubueller-robert',
    link: 'HTWG',
  },
  {
    years: '2021',
    title: 'Stayin’ Alive',
    line: 'Exhibition on living with epidemics, built by about 80 students. Led the UX team.',
    client: 'HTWG Konstanz',
    status: 'Red Dot',
    href: 'https://www.red-dot.org/project/stayin-alive-60726',
    link: 'red-dot.org',
  },
];
