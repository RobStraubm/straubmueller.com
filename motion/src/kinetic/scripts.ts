// Scripts for the kinetic-type films (versions G and H): each project told only with words and numbers.
// Every word and figure here must be backed by the site's facts (CLAUDE.md, befund/about-material.md).

export type Tone = 'ink' | 'signal' | 'mute';
export type Line = { text: string; tone?: Tone };

export type Beat = { at: number; caption?: string } & (
  | { kind: 'stack'; lines: Line[]; align?: 'top' | 'center' | 'bottom' }
  | { kind: 'count'; from: number; to: number; decimals?: number; suffix?: string }
  | { kind: 'marquee'; text: string }
  | { kind: 'ring'; ring: string; lines: Line[] }
  | { kind: 'tokens'; tokens: string[]; mark?: number }
);

export type Script = { label: string; years: string; beats: Beat[] };

const red = (text: string): Line => ({ text, tone: 'signal' });
const ink = (text: string): Line => ({ text });

export const KINETIC_FRAMES = 210;
export const INTRO_FRAMES = 180;

export const scripts: Record<string, Script> = {
  levelwork: {
    label: 'Levelwork · Constat',
    years: '2026–',
    beats: [
      { at: 0, kind: 'stack', lines: [ink('THE WEEK'), ink('EVERYONE'), ink('ASSUMES')] },
      { at: 52, kind: 'stack', lines: [ink('THE WEEK'), ink('THAT HAPPENS'), red('INSTEAD')] },
      { at: 104, kind: 'stack', lines: [ink('A DEVIATION'), ink('IS NOT'), ink('A VERDICT.')] },
      { at: 152, kind: 'stack', lines: [ink('IT’S A'), red('FINDING.')], caption: 'ONE STRUCTURED CONVERSATION PER ROLE' },
    ],
  },
  'ai-meeting-minutes': {
    label: 'AI meeting minutes · for gyv',
    years: '2026',
    beats: [
      { at: 0, kind: 'stack', lines: [ink('RECORD.')], caption: 'A COUNCIL MEETING' },
      { at: 36, kind: 'stack', lines: [ink('TRANS-'), ink('CRIBE.')] },
      { at: 72, kind: 'stack', lines: [ink('REVIEW.')] },
      { at: 108, kind: 'stack', lines: [red('MINUTES.')] },
      { at: 150, kind: 'stack', lines: [ink('IN'), ink('PILOT.')], caption: 'AT A DISTRICT ADMINISTRATION' },
    ],
  },
  saunter: {
    label: 'Saunter · own project',
    years: '2026',
    beats: [
      { at: 0, kind: 'tokens', tokens: ['02', '53', '02', '14', '00', '45', '03'], mark: 3, caption: 'ONE COMMAND, SEVEN BYTES' },
      { at: 56, kind: 'count', from: 0, to: 2, decimals: 1, suffix: ' KM/H', caption: 'SET THE BELT TO' },
      { at: 108, kind: 'stack', lines: [ink('WALK'), ink('WHILE YOU'), red('WORK.')] },
      { at: 156, kind: 'count', from: 0, to: 0.71, decimals: 2, suffix: ' KM', caption: '21 MINUTES, ONE REAL SESSION' },
    ],
  },
  sayfit: {
    label: 'SayFit · team of four',
    years: '2026',
    beats: [
      { at: 0, kind: 'stack', lines: [ink('SAY WHAT'), red('YOU ATE.')] },
      { at: 62, kind: 'count', from: 0, to: 1.88, decimals: 2, suffix: ' M', caption: 'FOOD ENTRIES · USDA AND OPEN FOOD FACTS' },
      { at: 128, kind: 'count', from: 12, to: 71, suffix: ' %', caption: 'CONFIDENT MATCHES, UP FROM 12 % · 29 TESTS' },
    ],
  },
  flowculate: {
    label: 'Flowculate · for HTWG Konstanz',
    years: '2022–25',
    beats: [
      { at: 0, kind: 'stack', lines: [ink('ONLY'), red('MATHS.')], caption: 'WHERE IT STARTED' },
      { at: 50, kind: 'stack', lines: [ink('PLAN'), ink('SCENARIO'), ink('SIMULATION')], caption: 'ONE PAGE PER FUNCTION' },
      { at: 112, kind: 'marquee', text: 'FLOWCULATE.EU', caption: 'A PUBLIC WEB APP' },
      { at: 164, kind: 'stack', lines: [ink('FLOWCULATE'), red('.EU')], caption: 'LIVE · A PUBLIC WEB APP' },
    ],
  },
  'sustainable-iot': {
    label: 'Sustainable IoT · for HTWG Konstanz',
    years: '2024',
    beats: [
      { at: 0, kind: 'stack', lines: [ink('HOW'), ink('MIGHT'), ink('WE …?')], caption: 'A DESIGN SPRINT IN AN IOT LAB' },
      { at: 64, kind: 'stack', lines: [ink('SKETCH.'), ink('PROTOTYPE.'), ink('DECIDE.')] },
      { at: 136, kind: 'stack', lines: [ink('ECOLOGICAL'), red('FOOTPRINT.')], caption: 'THE LAB’S NEW DIRECTION' },
    ],
  },
  tealucent: {
    label: 'Tealucent · for user generated design',
    years: '2022–24',
    beats: [
      { at: 0, kind: 'stack', lines: [ink('TOKENS'), ink('COMPONENTS'), ink('SCREENS')], caption: 'A DESIGN SYSTEM FOR GOCONUT' },
      { at: 100, kind: 'count', from: 0, to: 10, caption: 'PEOPLE IN MODERATED TESTS' },
    ],
  },
  conactive: {
    label: 'Conactive · master’s thesis',
    years: '2022',
    beats: [
      { at: 0, kind: 'stack', lines: [ink('INTERACTION'), ink('WITH CONNECTED'), ink('SYSTEMS')] },
      { at: 92, kind: 'ring', ring: 'KONSTANZ DESIGN AWARD 2022 · ', lines: [red('1ST'), red('PRIZE')] },
    ],
  },
  'stayin-alive': {
    label: 'Stayin’ Alive · for HTWG Konstanz',
    years: '2021',
    beats: [
      { at: 0, kind: 'stack', lines: [ink('STAYIN’'), ink('ALIVE')], caption: 'AN EXHIBITION ABOUT EPIDEMICS' },
      { at: 58, kind: 'count', from: 0, to: 80, caption: 'STUDENTS · I LED THE UX TEAM' },
      { at: 128, kind: 'stack', lines: [red('RED DOT'), ink('ADC GOLD'), ink('COMMAWARDS')], caption: 'THE PROJECT’S AWARDS' },
    ],
  },
  intro: {
    label: 'Robert Straubmüller',
    years: 'Konstanz',
    beats: [
      { at: 0, kind: 'stack', lines: [ink('RESEARCH')] },
      { at: 34, kind: 'stack', lines: [ink('DESIGN')] },
      { at: 68, kind: 'stack', lines: [red('BUILD')] },
      { at: 104, kind: 'stack', lines: [ink('SOFTWARE FOR PEOPLE'), ink('WHO ARE NOT EXPERTS')] },
    ],
  },
};
