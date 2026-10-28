// Every project, for the overview page in version E. The homepage shows a selection.
// Each year and client must be backed by the CV, the old site (befund/inhalte/alt-seite/inventar.md)
// or Robert's own files; open points are listed in CLAUDE.md.

/** File-name slug, shared with motion/render.mjs, which renders a title card per project. */
export const slug = (title: string) =>
  title
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export interface Project {
  years: string;
  /** For sorting, newest first. */
  start: number;
  title: string;
  line: string;
  /** Who it was for. 'Own' marks self-initiated work. */
  client: string;
  field: 'Product' | 'Research' | 'UX' | 'Exhibition' | 'Presentation' | 'Brand' | 'Editorial' | 'Photography';
  href?: string;
  link?: string;
}

/** Products, research and UX: the work of the last six years. */
export const recent: Project[] = [
  {
    years: '2026–',
    start: 2026.9,
    title: 'Levelwork',
    line: 'Co-founder. Constat shows how work is really distributed in an organisation.',
    client: 'Own',
    field: 'Product',
    href: 'https://levelwork.ai',
    link: 'levelwork.ai',
  },
  {
    years: '2026',
    start: 2026.8,
    title: 'Ambacta',
    line: 'AI meeting minutes: product design and build, in pilot at a district administration.',
    client: 'Landratsamt Konstanz',
    field: 'Product',
  },
  {
    years: '2026',
    start: 2026.75,
    title: 'Colla parte',
    line: 'Turns sheet-music PDFs into editable MusicXML. In progress.',
    client: 'Own',
    field: 'Product',
  },
  {
    years: '2026',
    start: 2026.76,
    title: 'Stub',
    line: 'Receipts on the scanner glass become named, searchable PDFs and a list. Built with Claude Code.',
    client: 'Own',
    field: 'Product',
    href: 'https://github.com/RobStraubm/stub',
    link: 'GitHub',
  },
  {
    years: '2026',
    start: 2026.6,
    title: 'Saunter',
    line: 'Walk while you work: a walking-pad companion for the Mac, built with Claude Code.',
    client: 'Own',
    field: 'Product',
    href: 'https://github.com/RobStraubm/saunter',
    link: 'GitHub',
  },
  {
    years: '2026',
    start: 2026.4,
    title: 'SayFit',
    line: 'Voice food logger, team of four. Co-built the pipeline, tests and web UI.',
    client: 'Own',
    field: 'Product',
    href: 'https://github.com/RobStraubm/sayfit',
    link: 'GitHub',
  },
  {
    years: '2024–25',
    start: 2024.8,
    title: 'The Politics of Inequality',
    line: 'Visual and narrative design of the Cluster of Excellence’s renewal application.',
    client: 'University of Konstanz',
    field: 'Presentation',
  },
  {
    years: '2022–25',
    start: 2022.8,
    title: 'Flowculate',
    line: 'From a math-only research tool to a public web app. Concept, UI, brand, project lead.',
    client: 'HTWG Konstanz',
    field: 'Research',
    href: 'https://flowculate.eu',
    link: 'flowculate.eu',
  },
  {
    years: '2023–24',
    start: 2023.8,
    title: 'OpenSeeGround',
    line: 'A robot data interface, defined through user research: live robot data for researchers.',
    client: 'HTWG Konstanz',
    field: 'Research',
  },
  {
    years: '2024',
    start: 2024.3,
    title: 'Sustainable IoT',
    line: 'A design sprint that turned an IoT lab towards ecological footprints.',
    client: 'HTWG Konstanz',
    field: 'Research',
  },
  {
    years: '2022–24',
    start: 2022.2,
    title: 'Sto and Migros',
    line: 'UX concepts and specifications; a design system and style guide for Sto.',
    client: 'user generated design',
    field: 'UX',
  },
  {
    years: '2022–24',
    start: 2022.1,
    title: 'Tealucent',
    line: 'Design system for goconut’s small developer team, tested with ten people.',
    client: 'user generated design',
    field: 'UX',
  },
  {
    years: '2020–23',
    start: 2020.8,
    title: 'Stadtmuseum Tettnang',
    line: 'Project lead for a new corporate identity, website and digital collection interface, with the University of Konstanz.',
    client: 'Stadtmuseum Tettnang',
    field: 'Brand',
  },
  {
    years: '2022',
    start: 2022.5,
    title: 'Conactive',
    line: 'Master’s thesis on interacting with connected systems. Konstanz Design Award, 1st prize.',
    client: 'Own',
    field: 'Research',
    href: 'https://www.htwg-konstanz.de/bachelor/kommunikationsdesign/abschlussarbeiten/konstanzer-designpreis/straubueller-robert',
    link: 'HTWG',
  },
  {
    years: '2021',
    start: 2021.5,
    title: 'Stayin’ Alive',
    line: 'Exhibition on living with epidemics, built by about 80 students. Co-led the UX team.',
    client: 'HTWG Konstanz',
    field: 'Exhibition',
    href: 'https://www.red-dot.org/project/stayin-alive-60726',
    link: 'red-dot.org',
  },
];

/** Brand, editorial and photography from the freelance practice, old and current. */
export const brand: Project[] = [
  {
    years: '2026',
    start: 2026.3,
    title: 'The Dental Flow',
    line: 'Logo and business cards.',
    client: 'The Dental Flow',
    field: 'Brand',
  },
  {
    years: '2026',
    start: 2026.2,
    title: 'Der Wald kommt in die Stadt',
    line: 'Layout of a twelve-page Kamishibai picture story.',
    client: 'MatsMara',
    field: 'Editorial',
  },
  {
    years: '2022–26',
    start: 2022.05,
    title: 'Thomas Lang Consulting',
    line: 'Boutique logo, sale posters, window graphics, vouchers, ads and a menu card for shops in Marbach.',
    client: 'Thomas Lang Consulting',
    field: 'Brand',
  },
  {
    years: '2020–25',
    start: 2020.15,
    title: 'Liederkranz Germania Süßen',
    line: 'Concert posters, logos, flyers, tickets and a roll-up for a choral society.',
    client: 'Liederkranz Germania Süßen',
    field: 'Brand',
  },
  {
    years: '2017–22',
    start: 2017.7,
    title: 'FRISCH AUF Frauen',
    line: 'Visual identity for the women’s handball team: player portraits and press photos, autograph cards, the matchday magazine, calendars, posters, ads and merchandise.',
    client: 'FRISCH AUF Göppingen',
    field: 'Brand',
  },
  {
    years: '2021',
    start: 2021.1,
    title: 'momentum',
    line: 'Team lead for a magazine on design in the pandemic: survey, infographics, final artwork. Master’s course in design strategy.',
    client: 'HTWG Konstanz',
    field: 'Editorial',
  },
  {
    years: '2020–21',
    start: 2020.5,
    title: 'Spartacus Advisors',
    line: 'Brand identity for a consultancy: name, logo, icons, website, stationery and a brochure.',
    client: 'Icarus Holding',
    field: 'Brand',
  },
  {
    years: '2020',
    start: 2020.1,
    title: 'Rothaus at CMT',
    line: 'Photographs of the brewery’s stand at the CMT fair in Stuttgart.',
    client: 'Badische Staatsbrauerei Rothaus',
    field: 'Photography',
  },
  {
    years: '2019',
    start: 2019.5,
    title: 'Pandacare',
    line: 'Company brochure for a natural soap maker in Berlin.',
    client: 'Pandacare',
    field: 'Editorial',
  },
  {
    years: '2019',
    start: 2019.1,
    title: 'Hello',
    line: 'Bachelor’s thesis: a guide for young designers on presenting their work, as a book and a website. Editorial design and photography.',
    client: 'Own',
    field: 'Editorial',
  },
  {
    years: '2018',
    start: 2018.4,
    title: 'Windberg Stiftelse',
    line: 'Competition entry: an identity for senior residences in Finland.',
    client: 'Hugo och Maria Windberg Stiftelse',
    field: 'Brand',
  },
  {
    years: '2017',
    start: 2017.5,
    title: 'Junger Kammerchor',
    line: 'Identity, concert posters and website for a young chamber choir.',
    client: 'Junger Kammerchor Ostwürttemberg',
    field: 'Brand',
  },
  {
    years: '2015–20',
    start: 2015.9,
    title: 'Photography',
    line: 'Portrait, business, fashion and product photography for OLAAR architects, Schulte Fashion Digital, Meghan Gallagher and Christine Oesterle; an analogue portrait series for the HfG magazine Format.',
    client: 'Several clients',
    field: 'Photography',
  },
];
