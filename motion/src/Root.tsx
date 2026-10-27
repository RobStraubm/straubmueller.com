import { Composition, Still } from 'remotion';
import { Bauhaus } from './bauhaus/Bauhaus';
import { Constat, CONSTAT_FRAMES } from './constat/Constat';
import { Conactive, CONACTIVE_FRAMES } from './conactive/Conactive';
import { Dots } from './dots/Dots';
import { Kinetic } from './kinetic/Kinetic';
import { INTRO_FRAMES, KINETIC_FRAMES } from './kinetic/scripts';
import { Flowculate, FLOWCULATE_FRAMES } from './flowculate/Flowculate';
import { Iot, IOT_FRAMES } from './iot/Iot';
import { Minutes, MINUTES_FRAMES } from './minutes/Minutes';
import { Notenprogramm, NOTENPROGRAMM_FRAMES } from './notenprogramm/Notenprogramm';
import { Saunter, SAUNTER_FRAMES } from './saunter/Saunter';
import { SayFit, SAYFIT_FRAMES } from './sayfit/SayFit';
import { Stayin, STAYIN_FRAMES } from './stayin/Stayin';
import { Tealucent, TEALUCENT_FRAMES } from './tealucent/Tealucent';
import { TitleCard, type TitleCardProps } from './TitleCard';
import { FPS, SIZE, type Theme } from './style';

const frame = { fps: FPS, width: SIZE.width, height: SIZE.height };

export const Root = () => (
  <>
    <Composition
      id="Flowculate"
      component={Flowculate}
      durationInFrames={FLOWCULATE_FRAMES}
      {...frame}
      defaultProps={{ theme: 'light' as Theme, titles: false }}
    />
    <Composition id="Constat" component={Constat} durationInFrames={CONSTAT_FRAMES} {...frame} defaultProps={{ theme: 'dark' as Theme }} />
    <Composition id="Saunter" component={Saunter} durationInFrames={SAUNTER_FRAMES} {...frame} defaultProps={{ theme: 'dark' as Theme }} />
    {/* Version I: the other selected projects in the poster style. */}
    <Composition id="Minutes" component={Minutes} durationInFrames={MINUTES_FRAMES} {...frame} defaultProps={{ theme: 'dark' as Theme }} />
    <Composition id="Notenprogramm" component={Notenprogramm} durationInFrames={NOTENPROGRAMM_FRAMES} {...frame} defaultProps={{ theme: 'dark' as Theme }} />
    <Composition id="SayFit" component={SayFit} durationInFrames={SAYFIT_FRAMES} {...frame} defaultProps={{ theme: 'dark' as Theme }} />
    <Composition id="Conactive" component={Conactive} durationInFrames={CONACTIVE_FRAMES} {...frame} defaultProps={{ theme: 'dark' as Theme }} />
    <Composition id="Stayin" component={Stayin} durationInFrames={STAYIN_FRAMES} {...frame} defaultProps={{ theme: 'dark' as Theme }} />
    <Composition id="Iot" component={Iot} durationInFrames={IOT_FRAMES} {...frame} defaultProps={{ theme: 'dark' as Theme }} />
    <Composition id="Tealucent" component={Tealucent} durationInFrames={TEALUCENT_FRAMES} {...frame} defaultProps={{ theme: 'dark' as Theme }} />
    {/* Three styles that tell the same scripts: type only, geometric posters, an LED board. */}
    <Composition id="Kinetic" component={Kinetic} durationInFrames={KINETIC_FRAMES} {...frame} defaultProps={{ theme: 'dark' as Theme, script: 'flowculate' }} />
    <Composition
      id="KineticIntro"
      component={Kinetic}
      durationInFrames={INTRO_FRAMES}
      fps={FPS}
      width={1600}
      height={900}
      defaultProps={{ theme: 'dark' as Theme, script: 'intro' }}
    />
    <Composition id="Bauhaus" component={Bauhaus} durationInFrames={KINETIC_FRAMES} {...frame} defaultProps={{ script: 'flowculate' }} />
    <Composition id="Dots" component={Dots} durationInFrames={KINETIC_FRAMES} {...frame} defaultProps={{ script: 'flowculate' }} />
    <Still
      id="TitleCard"
      component={TitleCard}
      width={SIZE.width}
      height={SIZE.height}
      defaultProps={
        {
          theme: 'dark',
          title: 'SayFit',
          line: 'Voice food logger, team of four.',
          years: '2026',
          client: 'Own',
        } satisfies TitleCardProps
      }
    />
  </>
);
