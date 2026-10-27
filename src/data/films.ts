// Version I: one film in the poster style per selected project, rendered by motion/render.mjs (mode 'i')
// into /public/motion/i/<key>-light|dark.mp4|jpg. Keys are slug(title) of the project, so rows find their film.

export interface Film {
  key: string;
  title: string;
  /** Path without theme and extension: …/key → …/key-light.mp4, …/key-dark.jpg. */
  base: string;
  /** Second at which each act starts, for the caption under the frame. */
  acts: { at: number; label: string }[];
}

/** Acts as [first frame, label]; the films run at 30 fps. */
const film = (key: string, title: string, acts: [number, string][]): Film => ({
  key,
  title,
  base: `/motion/i/${key}`,
  acts: acts.map(([frame, label]) => ({ at: frame / 30, label })),
});

export const films: Film[] = [
  film('levelwork', 'Levelwork · Constat', [[0, 'Expected'], [64, 'Actual'], [132, 'Finding']]),
  film('ai-meeting-minutes', 'Ambacta', [[0, 'Audio'], [64, 'Review'], [136, 'Minutes']]),
  film('saunter', 'Saunter', [[0, 'Remote'], [64, 'App'], [136, 'Lake']]),
  film('notenprogramm', 'Colla parte', [[0, 'PDF'], [64, 'Check'], [136, 'Practice']]),
  film('sayfit', 'SayFit', [[0, 'Say'], [64, 'Match'], [136, 'Test']]),
  film('belegscanner', 'Belegscanner', [[0, 'Scan'], [64, 'Read'], [136, 'File']]),
  film('flowculate', 'Flowculate', [[0, 'Numbers'], [34, 'Plan'], [100, 'Web app']]),
  film('sustainable-iot', 'Sustainable IoT', [[0, 'Setup'], [64, 'Use'], [136, 'Footprint']]),
  film('tealucent', 'Tealucent', [[0, 'Colour'], [64, 'Layers'], [136, 'Office']]),
  film('conactive', 'Conactive', [[0, 'Screen'], [64, 'Objects'], [136, '1st prize']]),
  film('stayin-alive', 'Stayin’ Alive', [[0, 'Stations'], [64, 'Guide'], [136, 'Awards']]),
];
