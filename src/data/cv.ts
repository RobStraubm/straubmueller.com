// Robert's CV for the About pages. Source: befund/about-material.md (approved 23 Oct 2026) and the CV PDF.
// Nothing here may contradict the CV, LinkedIn or the speedrun application. Showing more than the CV is fine.

export interface CvItem {
  years: string;
  title: string;
  org: string;
  note?: string;
  href?: string;
  /** Start year, used by the log layout (version C). */
  start: number;
  /** Key in frames.ts with work traces from this station. */
  evidence?: string;
}

export interface Award {
  year: string;
  title: string;
  for: string;
  href?: string;
  evidence?: string;
}

/**
 * Approved by Robert on 23 Oct 2026 (revised version in befund/about-material.md). Uses the name instead of a
 * pronoun on purpose. The last sentence says “Since 2026” until levelwork.ai and the CV agree on the month.
 */
export const aboutText =
  'Robert grew up helping in the family restaurant from age 12 and has designed from the guest’s side ever since. From 2014, alongside design school, Robert assisted advertising photographers in Munich and Stuttgart, organising and running large commercial shoots, and from 2017 ran a freelance design practice, including the visual identity of the women’s handball team FRISCH AUF Göppingen from 2017 to 2022. Then came UX: leading the UX team on an award-winning exhibition, senior UX work at a design agency, turning simulation maths into a product at a research institute, and retraining full time in AI engineering. Since 2026 Robert has been building Levelwork full time as co-founder.';

/** Robert's own words (22 Oct 2026), translated. */
export const strengths = ['Structure and logic', 'Thinking in data', 'Leading people', 'Making interaction simple'];

export const experience: CvItem[] = [
  {
    years: '2026–',
    start: 2026,
    title: 'Co-founder',
    org: 'Levelwork, Konstanz',
    evidence: 'levelwork',
    note: 'Full time. Building Constat with Michael Gajda.',
    href: 'https://levelwork.ai',
  },
  {
    years: '2026–',
    start: 2026,
    title: 'Freelance UX and AI',
    org: 'gyv',
    note: 'Ambacta, AI meeting minutes for council meetings, in pilot at a district administration.',
  },
  {
    years: '2022–25',
    start: 2022,
    title: 'UX Researcher / UI Designer',
    org: 'Institute for Optical Systems, HTWG Konstanz',
    evidence: 'flowculate',
    note: 'Half-time position. Flowculate: concept, UI, brand and project management; led up to four student developers.',
  },
  {
    years: '2024–25',
    start: 2024,
    title: 'Design consultant, freelance',
    org: 'Cluster of Excellence “The Politics of Inequality”, University of Konstanz',
    note: 'Visual and narrative design of the Excellence Strategy renewal application.',
  },
  {
    years: '2022–24',
    start: 2022,
    title: 'UX Designer, Senior UX Designer from 2024',
    org: 'user generated design GmbH, Konstanz',
    evidence: 'tealucent',
    note: 'Employed in 2022, freelance from October 2022. Tealucent design system for goconut; clients included Migros and Sto.',
  },
  {
    years: '2020–23',
    start: 2020,
    title: 'UX/UI and brand designer, freelance',
    org: 'Stadtmuseum Tettnang',
    note: 'Project lead for a new corporate identity, website and digital collection interface, with the University of Konstanz.',
  },
  {
    years: '2019–20',
    start: 2019,
    title: 'Junior Art Director',
    org: 'Siegelwerk GmbH, Stuttgart',
    note: 'Design agency.',
  },
  {
    years: '2017–',
    start: 2017,
    title: 'Freelance design practice',
    org: 'Own practice',
    evidence: 'fafrauen',
    note: 'Brand and editorial design, including the visual identity of FRISCH AUF Göppingen’s women’s handball team, 2017–22.',
  },
  {
    years: '2014–20',
    start: 2014,
    title: 'Freelance photo assistant',
    org: 'Conny Stein Photodesign, Munich · Udo Schönewald, Stuttgart',
    note: 'Advertising, product, portrait and industrial photography; helped organise and run large commercial shoots.',
  },
  {
    years: '2014–20',
    start: 2014,
    title: 'Freelance design and set styling',
    org: 'Tanja Fritz, Ebersbach · Christine Oesterle',
    note: 'Design work for the agency; styling and props for photo shoots.',
  },
];

export const education: CvItem[] = [
  {
    years: '2025–26',
    start: 2025,
    title: 'AI Engineering',
    org: 'neue fische, Berlin',
    evidence: 'sayfit',
    note: 'Full-time bootcamp: data science, machine learning, LLM applications. Capstone: SayFit.',
  },
  {
    years: '2022–23',
    start: 2022,
    title: 'Guest student, Business Informatics',
    org: 'HTWG Konstanz',
    note: 'Programming, software engineering, web technologies.',
  },
  {
    years: '2021–24',
    start: 2021,
    title: 'International Leadership Development Program',
    org: 'HTWG Konstanz',
    note: 'Scholarship, two cohorts. Met leaders from public broadcasting, sport, politics and industry in Berlin and Hamburg.',
  },
  {
    years: '2020–22',
    start: 2020,
    title: 'M.A. Communication Design',
    org: 'HTWG Konstanz and University of Konstanz',
    evidence: 'conactive',
    note: 'Thesis: Conactive, interaction with connected systems.',
  },
  {
    years: '2018',
    start: 2018,
    title: 'Erasmus semester',
    org: 'Lahti University of Applied Sciences, Finland',
  },
  {
    years: '2015–19',
    start: 2015,
    title: 'B.A. Communication Design',
    org: 'HfG Schwäbisch Gmünd',
    note: 'Thesis: Hello, a guide for young designers on presenting their work, as a book and a website.',
  },
];

export const awards: Award[] = [
  {
    year: '2022',
    title: 'Konstanz Design Award, 1st prize',
    for: 'Master’s thesis Conactive',
    evidence: 'conactive',
    href: 'https://www.htwg-konstanz.de/bachelor/kommunikationsdesign/abschlussarbeiten/konstanzer-designpreis/straubueller-robert',
  },
  {
    year: '2022',
    title: 'Red Dot: Junior Award, Exhibition Design',
    for: 'Stayin’ Alive, project team',
    href: 'https://www.red-dot.org/project/stayin-alive-60726',
    evidence: 'stayin',
  },
  { year: '2022', title: 'ADC Talent Award, Gold, Exhibition', for: 'Stayin’ Alive, project team', evidence: 'stayin' },
  { year: '2021', title: 'CommAwards, Gold, Space', for: 'Stayin’ Alive, project team', evidence: 'stayin' },
];

export const languages = ['German, native', 'English, fluent (LCCI Level 2)', 'French, basic'];
