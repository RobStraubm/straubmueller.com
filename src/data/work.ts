// Facts must match the corrected CV and LinkedIn (see CLAUDE.md, befund/cv-korrekturen.md).

export interface Proof {
  label: string;
  href?: string;
}

export interface WorkItem {
  slug: string;
  years: string;
  title: string;
  /** Short role for the homepage table. */
  short: string;
  role: string;
  context: string;
  proof: Proof;
}

export const work: WorkItem[] = [
  {
    slug: 'levelwork',
    years: '2026–',
    title: 'Levelwork',
    short: 'Co-founder',
    role: 'Co-founder · human experience design',
    context: 'Startup, Konstanz',
    proof: { label: 'levelwork.ai', href: 'https://levelwork.ai' },
  },
  {
    slug: 'council-minutes',
    years: '2026–',
    title: 'Ambacta',
    short: 'Product design & build',
    role: 'Product design, AI-assisted build',
    context: 'Freelance for gyv · pilot at a district administration',
    proof: { label: '' },
  },
  {
    slug: 'flowculate',
    years: '2022–25',
    title: 'Flowculate',
    short: 'UX research & UI',
    role: 'UX research, UI, brand · led up to four student developers',
    context: 'Institute for Optical Systems, HTWG Konstanz',
    proof: { label: 'flowculate.eu', href: 'https://flowculate.eu' },
  },
  {
    slug: 'sustainable-iot',
    years: '2024',
    title: 'Sustainable IoT',
    short: 'Design sprint',
    role: 'Design sprint, data-viz prototypes',
    context: 'IoT Sustainability Lab (Interreg)',
    proof: { label: '' },
  },
  {
    slug: 'tealucent',
    years: '2022–24',
    title: 'Tealucent',
    short: 'Design system',
    role: 'Design system, tested with ten people',
    context: 'For goconut, via user generated design',
    proof: { label: '' },
  },
  {
    slug: 'conactive',
    years: '2022',
    title: 'Conactive',
    short: 'Master’s thesis',
    role: 'Master’s thesis · speculative design',
    context: 'HTWG Konstanz',
    proof: {
      label: 'Design award, 1st prize',
      href: 'https://www.htwg-konstanz.de/bachelor/kommunikationsdesign/abschlussarbeiten/konstanzer-designpreis/straubueller-robert',
    },
  },
  {
    slug: 'stayin-alive',
    years: '2021',
    title: 'Stayin’ Alive',
    short: 'UX team co-lead',
    role: 'Co-led the UX team · iPad visitor interface · exhibition photography',
    context: 'Student team of about 80, five disciplines',
    proof: { label: 'Red Dot (team)', href: 'https://www.red-dot.org/project/stayin-alive-60726' },
  },
];

export interface WerkstattItem {
  title: string;
  year: string;
  text: string;
  href?: string;
  linkLabel?: string;
}

export const werkstatt: WerkstattItem[] = [
  {
    title: 'SayFit',
    year: '2026',
    text: 'Voice food logger, team capstone',
    href: 'https://github.com/RobStraubm/sayfit',
    linkLabel: 'GitHub',
  },
  {
    title: 'Saunter',
    year: '2026',
    text: 'Walking-pad companion for the Mac',
    href: 'https://github.com/RobStraubm/saunter',
    linkLabel: 'GitHub',
  },
  {
    title: 'Colla parte',
    year: '2026',
    text: 'Sheet music to MusicXML',
    linkLabel: 'In progress',
  },
];
