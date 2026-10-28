# Colla parte v2: walkthrough media

Captured 28.10.2026 from the real app (`~/Desktop/Job/Notenprogramm`, `app.py --no-open`) running only on the public-domain copy library in the scratchpad (`cp/bib-pd`: Prüfstück "Zwei Choräle (Bach)", Bach "O Food to Pilgrims Given", Parry, Schumann, Victoria, Mundy). Robert's real library was never opened. Whitacre and Poulenc do not appear anywhere. Headless Chrome via Playwright. Window sizes are in CSS px and scaled up to 2880 px wide.

Framing: all editor shots (03–06) use the same 1440×900 window, so they can crossfade. 01/02 (start page) use a 1800×1125 window, which has the same 16:10 ratio. At 1440×900 the start page cuts off the "Geprüft" group and the player bar, so the larger window shows the whole folder.

## Images: `src/assets/cases/colla-parte-v2/`

| File | Pixels | What it shows | Suggested caption / alt |
|---|---|---|---|
| 01-folder.jpg | 2880×1800 (window 1800×1125) | Start page "Meine Mappe": 6 pieces, groups "Noch zu prüfen" (5) and "Geprüft, bereit zum Üben" (Parry), voice tags and "n Stellen offen" on each card, pencil-circled programme numbers. The Parry practice MP3 is playing (player bar at 0:49 / 3:57). | The start page is a folder of sheets: pieces still to check, pieces ready to practise, and the practice MP3 playing at the bottom. |
| 02-reading.jpg | 2880×1800 (1800×1125) | Same page during a real import of the Prüfstück "Zwei Choräle (Bach)": the card is veiled with a scan line and shows "wird gelesen, 24 %". First (uncached) run. | A newly added PDF is being read; its card fills from the top as the recognition progresses. |
| 02b-reading-dialog.jpg | 2880×1800 (1440×900) | Reading dialog of the same run: 25 %, "noch etwa 11 Minuten", "Die klassische Erkennung liest Seite 1 von 3 · Die KI-Erkennung liest Seite 2 von 3", page thumbnails with scan lines on the busy pages. | Two recognition engines read the same PDF in parallel, each on its own page. |
| 02c-reading-dialog-detail.jpg | 1320×920 | Crop of 02b around the dialog. | Detail: progress, the time remaining and what each engine is doing right now. |
| 03-voice.jpg | 2880×1800 | Mundy "Lord Maker in d", first open: chooser "Welche Stimme ist deine?" with Sopran 11, Alt 13, Alt 2 2, Tenor 12 ("zuletzt deine Stimme"), Bass 12, Alle Stimmen 50 open spots, and a note that the 4 organ staves are accompaniment. | First step in a new piece: choose your voice, and the app asks only about that voice. |
| 03b-parry-staves.jpg | 2880×1800 | Parry "Crossing the Bar", "Alle Takte", bar 6 (bar 5 in the print), Tenor: the original on 2 staves (SATB in pairs) on the left, the transcription split into 4 single staves on the right, with the tenor highlighted. | The original prints four voices on two staves; the transcription gives each voice its own staff. |
| 04-check.jpg | 2880×1800 | Victoria "Ave Maria", Tenor I, "Stelle 3 von 25", bar 3: on the left, the same bars from the PDF with pencil brackets; on the right, "Deine Abschrift" with the uncertain note in brackets, the note palette, and the question "Ist das C4 eine Halbe?" with "Ja, stimmt so ↵" and "Andere Lesart zeigen". | Checking: the original bars on the left, your transcription on the right, and one question about the uncertain note. |
| 04b-octave.jpg | 2880×1800 | Schumann "An die Sterne", Tenor II, bars 53–55: "Welche Oktave stimmt in dieser Zeile?" with "So wie jetzt ↵", "Eine Oktave höher" and "Andere Lesart zeigen". It applies to 7 notes at once. | When the engines disagree by exactly an octave across a line, the app asks once for the whole line. |
| 04c-other-reading.jpg | 2880×1800 | As 04, with the other reading open: "So liest die KI-Erkennung Takt 3", the alternative bar, and "Lesart für Tenor I übernehmen". | The other engine's reading can be opened below the question and adopted with one click. |
| 04d-octave-other-reading.jpg | 2880×1800 | As 04b, with the classic engine's reading of bar 53 open. | The other reading of the octave line, for comparison with the original. |
| 05-edit.jpg | 2880×1800 | Parry, bar 6, a tenor note (A3 half) clicked: dark palette at the note (höher/tiefer, ♯ ♭ ♮, note values as Bravura glyphs, dot, Pause, Löschen, ⋯); the original shows the same note bracketed. | Click a note and the tools appear right at the note, not in a wall of buttons. |
| 05b-keys.jpg | 2880×1800 | Same state with the "Tasten" popover open (keyboard shortcuts). | Almost every edit also has a key; the "Tasten" panel lists them. |
| 05c-more.jpg | 2880×1800 | Same state with the "⋯" menu open (octave, tie, insert before/after, chord tone, breve, share with or move to another voice). | Less common edits sit one click deeper in the "⋯" menu. |
| 06-export.jpg | 2880×1800 | Parry export dialog: own voice Tenor = harmonica, Sopran flute, Alt clarinet, Bass horn; tempo ♩ = 80 with the top of page 1 shown for reference; a warning that 7 bars don't add up; MP3 and MusicXML. | Export: your voice on harmonica, the others on distinct instruments, and the tempo checked against the original. |
| 06b-done.jpg | 2880×1800 | "Fertig" after the export (it took a few seconds), with the player at 0:32 / 3:57 and the files "03 PARRY Crossing the Bar SATB T 2026-10-28 08-48.mp3" and ".mxl". "Zur Musik-App hinzufügen" is visible but was not clicked. | A few seconds later the practice MP3 is ready to play, saved next to the piece. |
| before-editor.jpg | 1280×820 (original screenshot, not upscaled) | The editor before the redesign (23.10, `.playwright-mcp/ist_editor_bach.png`): Bach "O Food to Pilgrims Given", Tenor, bar 25, "Stelle 1 von 1", blue buttons, a sidebar full of tools. | Before: every tool visible at once, in a generic web-app style. |
| after-editor.jpg | 2560×1640 (window 1280×820, same as before) | Today's editor on the same piece, voice, bar and question (bar 25, Tenor, "Ist das G3 eine Achtel?"). | After: the same question in today's editor, with the original and the transcription side by side and the tools at the note. |
| before-editor-b.jpg | 1800×987 (original screenshot) | The 20.10 editor on the Prüfstück (`page-2026-10-20T12-56-58-837Z.png`): bar 18, "Meine Stimme: alle", key menu open. | Before (20.10): the Prüfstück in the first editor. |
| after-editor-b.jpg | 2880×1579 (window 1800×987, same as before-b) | Today's editor on the Prüfstück, all voices, bar 18 ("Stelle 6 von 11"). Today's question here is about the soprano. On 20.10 it was about voice 4. | After: the same bar of the Prüfstück today. |

## Videos: `public/cases/colla-parte-v2/`

All are H.264, yuv420p (TV range, BT.709), 30 fps, no audio, with `+faststart`. Each one has a JPG poster with the same name.

| File | Pixels | Length / size | What it shows | Suggested caption / alt |
|---|---|---|---|---|
| check-loop.mp4 (+ .jpg) | 2880×1800 | 13.8 s / 0.95 MB | Victoria, Tenor I. Enter is pressed 3 times: "Stelle 1 → 2 → 3 → 4 von 25", and the wash and brackets jump bar 1 → 2 → 3 → 4. Real time, captured as continuous 2× screenshots (about 14 fps, held to 30 fps). The app's changes are instant, so there are no tweens. The loop restarts with a hard cut to Stelle 1. Poster: Stelle 1. | Answering open spots with Enter: each answer jumps to the next uncertain bar. |
| play.mp4 (+ .jpg) | 2880×1800 | 12.7 s / 0.58 MB | O Food to Pilgrims Given, bar 25, Tenor: ⇧Space plays only the tenor, then Space plays all voices. Each note greys out while it sounds (the app's real highlight, at ♩ = 80). Real time, about 18 fps capture. It starts and ends idle, so the loop is seamless. Poster: mid-bar during the all-voice pass. | Space plays the bar, Shift+Space only your voice; the notes light up as they sound. |
| play-detail.mp4 (+ .jpg) | 1440×640 (native 2× crop) | 12.7 s / 0.22 MB | The same recording cropped to the transcription and toolbar ("Anhören" turns into "Stopp"). The highlight is easier to see here. | Close-up: the notes being played are highlighted in the score. |
| reading.mp4 (+ .jpg) | 2060×1160 (crop) | 17.2 s / 1.06 MB | Time-lapse (4×, with 0.1 s crossfades) of the Prüfstück reading dialog from 7 % to "Fertig eingelesen … Stimme wählen und prüfen", with the card in the background filling up. **Note:** this run was a re-import of the same PDF, which the app served from its recognition cache. It took about 56 s instead of the real 8 m 28 s, and the time remaining reads "1 Minute / gleich fertig". The stills 02/02b come from the first, uncached run. Don't caption it with a duration. | Time-lapse: both engines work through the pages, then the piece is ready for checking. |
| reading-full.mp4 (+ .jpg) | 2880×1800 (window 1440×900) | 17.2 s / 1.26 MB | The same time-lapse, full window. | Same as above, full window. |

## Notes

- The library copy was snapshotted before the session and restored afterwards, so `cp/bib-pd` is byte-identical to its earlier state. The interim edits were: 3 Victoria answers for the video, Schumann focus set to Tenor II, Parry set to "Alle Takte", and 4 Parry test exports. The two extra Prüfstück imports are parked in `cp/parked-v1/`.
- Drafts, raw frame sequences and scripts are in the scratchpad under `media/`.
