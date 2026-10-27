// Work traces per project, in the order they happened: notes or sketches first, the shipped thing last.
// The preview panel in version D plays them once and holds the last one, which doubles as the mobile thumbnail.
import type { ImageMetadata } from 'astro';
import constatWeek from '../assets/frames/constat-week.jpg';
import constatEvidence from '../assets/frames/constat-evidence.jpg';
import constatFinding from '../assets/frames/constat-finding.jpg';
import sayfitProcessing from '../assets/frames/sayfit-processing.jpg';
import sayfitReview from '../assets/frames/sayfit-review.jpg';
import sayfitToday from '../assets/frames/sayfit-today.jpg';
import saunterProtocol from '../assets/frames/saunter-protocol.jpg';
import saunterSystem from '../assets/frames/saunter-system.jpg';
import saunterOverview from '../assets/frames/saunter-overview.jpg';
import flowculate2022 from '../assets/frames/flowculate-2022.jpg';
import flowculate2023 from '../assets/frames/flowculate-2023.jpg';
import flowculate2024 from '../assets/variants/flowculate-2024.jpg';
import iotHmw from '../assets/frames/iot-hmw.jpg';
import iotStoryboard from '../assets/frames/iot-storyboard.jpg';
import iotWireframe from '../assets/frames/iot-wireframe.jpg';
import tealucentTokens from '../assets/variants/tealucent-tokens.jpg';
import tealucentComponents from '../assets/frames/tealucent-components.jpg';
import tealucentOverview from '../assets/frames/tealucent-overview.jpg';
import conactiveSketchbook from '../assets/notes/conactive-sketchbook.jpg';
import conactiveObjects from '../assets/frames/conactive-objects.jpg';
import stayinIpad from '../assets/frames/stayin-ipad.jpg';
import stayinHand from '../assets/frames/stayin-hand.jpg';
import stayinRoom from '../assets/frames/stayin-room.jpg';
import fafCard from '../assets/archive/frisch-auf-card.jpg';
import fafCards from '../assets/archive/frisch-auf-cards.jpg';
import fafSeason from '../assets/archive/frisch-auf-season.jpg';
import spartacusKey from '../assets/archive/spartacus-key.jpg';
import spartacusLogo from '../assets/archive/spartacus-logo.jpg';
import spartacusIcons from '../assets/archive/spartacus-icons.jpg';
import pandacareCover from '../assets/archive/pandacare-cover.jpg';
import pandacareSpread from '../assets/archive/pandacare-spread.jpg';
import pandacareInside from '../assets/archive/pandacare-inside.jpg';
import jkoPosters from '../assets/archive/jko-posters.jpg';
import jkoStamp from '../assets/archive/jko-stamp.jpg';
import jkoFolder from '../assets/archive/jko-folder.jpg';

export interface Frame {
  src: ImageMetadata;
  alt: string;
  /** One or two words for the caption, e.g. the year or the stage. */
  label: string;
}

export const frames: Record<string, Frame[]> = {
  levelwork: [
    { src: constatWeek, alt: 'Constat brochure: the week everyone assumes and the week that happens instead', label: 'The gap' },
    { src: constatEvidence, alt: 'Constat brochure: from assumption to evidence', label: 'The method' },
    { src: constatFinding, alt: 'Constat brochure: a deviation is a finding', label: 'The finding' },
  ],
  sayfit: [
    { src: sayfitProcessing, alt: 'SayFit processing a spoken meal step by step', label: 'Processing' },
    { src: sayfitReview, alt: 'SayFit asking to review the recognised foods', label: 'Review' },
    { src: sayfitToday, alt: 'SayFit daily log with meals and macros', label: 'Today' },
  ],
  saunter: [
    { src: saunterProtocol, alt: 'One FitShow command decoded byte by byte, with an excerpt from the daemon log of a real session', label: 'Protocol' },
    { src: saunterSystem, alt: 'Diagram: the walking pad talks Bluetooth to a local daemon; the menu bar app, Shortcuts, the terminal and Claude talk to the daemon', label: 'System' },
    { src: saunterOverview, alt: 'Saunter overview with the weekly streak (2 of 3 walking days) and the daily streak', label: 'App' },
  ],
  flowculate: [
    { src: flowculate2022, alt: 'Flowculate in 2022: the first prototype, a crowd-density heat map of two classrooms', label: '2022' },
    { src: flowculate2023, alt: 'Flowculate in 2023: the web app with simulation controls and charts', label: '2023' },
    { src: flowculate2024, alt: 'Flowculate in 2024: crowd density as a heat map in a floor plan', label: '2024' },
  ],
  iot: [
    { src: iotHmw, alt: 'Wall of pink “How might we” notes', label: 'Notes' },
    { src: iotStoryboard, alt: 'Whiteboard with a hand-drawn storyboard', label: 'Storyboard' },
    { src: iotWireframe, alt: 'High-fidelity wireframe of the model view', label: 'Wireframe' },
  ],
  tealucent: [
    { src: tealucentTokens, alt: 'Token architecture of the Tealucent design system', label: 'Tokens' },
    { src: tealucentComponents, alt: 'Tealucent list components', label: 'Components' },
    { src: tealucentOverview, alt: 'Overview of the Tealucent design system', label: 'System' },
  ],
  conactive: [
    { src: conactiveSketchbook, alt: 'Sketchbook spread with pencil sketches', label: 'Sketchbook' },
    { src: conactiveObjects, alt: 'Conactive objects: a book with a network diagram and a cup', label: 'Objects' },
  ],
  stayin: [
    { src: stayinRoom, alt: 'Dark exhibition room with screens on a blue wall', label: 'Room' },
    { src: stayinHand, alt: 'A visitor using the iPad guide at a station', label: 'Station' },
    { src: stayinIpad, alt: 'Hands holding the iPad visitor guide in the exhibition', label: 'iPad guide' },
  ],
  fafrauen: [
    { src: fafCard, alt: 'Autograph card of a FRISCH AUF player with a pen', label: 'Card' },
    { src: fafCards, alt: 'Series of FRISCH AUF autograph cards', label: 'Series' },
    { src: fafSeason, alt: 'FRISCH AUF season campaign: team photos with green hashtags', label: 'Season 20/21' },
  ],
  spartacus: [
    { src: spartacusLogo, alt: 'Spartacus Advisors logo in three colour versions', label: 'Logo' },
    { src: spartacusIcons, alt: 'Spartacus Advisors icon family on dark blue', label: 'Icons' },
    { src: spartacusKey, alt: 'Spartacus Advisors key visual: orange arcs over the Colosseum', label: 'Key visual' },
  ],
  pandacare: [
    { src: pandacareCover, alt: 'Pandacare brochure cover in green', label: 'Cover' },
    { src: pandacareSpread, alt: 'Pandacare brochure spread: a small soap lexicon', label: 'Spread' },
    { src: pandacareInside, alt: 'Pandacare brochure pages with botanical drawings', label: 'Inside' },
  ],
  jko: [
    { src: jkoFolder, alt: 'Black choir folder with an embossed mark', label: 'Folder' },
    { src: jkoStamp, alt: 'Choir stamp and programme booklet in gold', label: 'Print' },
    { src: jkoPosters, alt: 'Typographic concert posters for the choir', label: 'Posters' },
  ],
};
