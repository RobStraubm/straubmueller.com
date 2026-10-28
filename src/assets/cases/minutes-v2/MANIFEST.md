# minutes-v2: media for the guided walkthrough (Ambacta minutes editor)

Made 28.10.2026. All app captures show the fictional session "Kreistag Musterkreis, 12. März 2026", which is swapped in at load time (Playwright routes; no repo was changed). Speakers, speech, documents and the coat of arms are invented. Timing and turn structure come from a real session. The audio and waveform are synthetic: quiet noise, with an envelope built from the fictional timings.

Scripts and scan reports: `/private/tmp/claude-501/-Users-robert-Desktop-Job-levelwork/74b49da7-9b11-435e-b688-a693f2f894d0/scratchpad/ambacta/gen/` (`shoot-v2.cjs`, `szenen-v2.cjs`, `lib-v2.cjs`, `video-v2.cjs`, `web-shoot-v2.cjs`, `logo-v2.cjs`, `gen-audio-v2.cjs`). Reports are in `…/ambacta/out-v2/scan-*.json`, `out-v2/video/scan-video.json` and `out-v2/web/scan-web.json`.

**Scan per capture.** Each capture is checked for:
- real names, by hash against the real rosters and transcripts (`reste()`);
- 7-word overlap with the three real `stufe3.json`;
- the strings Konstanz, LRAKN, Nautilus, the contractor's name, "18. Mai" and local place names, searched across all visible text, titles, tooltips, aria labels and input values;
- for the website, also any "5.000 Stunden" or hours figure, plus a check that no hours scene is in the viewport.

"CLEAN" means 0 hits. The only accepted overlaps are generic agenda titles taken from the fictional documents ("Genehmigung der Niederschrift über die letzte öffentliche Sitzung", "Besetzung des Aufsichtsrats", "Besetzung der Jury für die Verleihung des …"). They contain no names or speech.

## App (1440×960 CSS px, DSF 2, JPG q86, same full-window framing for crossfades)

| File | Px | Shows | Scan | Suggested caption / alt |
|---|---|---|---|---|
| 01-review.jpg | 2880×1920 | Review tab, section 3 open. Lines marked "schwer hörbar" and "Name unbestätigt", dictionary names highlighted, audio bar playing at 00:20:35 with waveform | CLEAN | Review: uncertain names and hard-to-hear passages are flagged for checking against the recording. (Fictional session.) |
| 02-documents.jpg | 2880×1920 | "Sitzungsunterlagen" dialog after uploading resolution record (PDF) and blank minutes template (Word). Shows what was read (31 items, 37 resolutions with votes, attendance, start/end, signatures) and the warning about rebuilding a PDF | CLEAN | Meeting documents: the app reads the resolution record and the blank template and warns where a PDF had to be reconstructed. (Fictional documents.) |
| 03-check.jpg | 2880×1920 | "Prüfen" sheet (Zuordnung prüfen). 24 of 31 items have speech; items without speech; warning "Die Aufnahme ist etwa 40 Minuten kürzer als die Sitzung"; evidence per item (Ansage / Titel genannt) | CLEAN | Check: agenda coverage per item, with a warning that the recording is shorter than the meeting. (Fictional session.) |
| 04-editor.jpg | 2880×1920 | Minutes editor, item 17. Five choices per contribution; one contribution condensed by hand ("Von Hand geändert"); a call-up and an interjection left out. Preview on the right follows ("Mitführen" on) and shows "(redaktionell bearbeitet)" and "Ein Beitrag ausgelassen" | CLEAN | Minutes editor: for each contribution, choose to edit, quote verbatim, leave out or use a text block. The preview follows. (Fictional session.) |
| 04b-textblock.jpg | 2880×1920 | Same scene with the text-block menu open on contribution 73 (house phrases with "9 von 9" frequency) | CLEAN | Text blocks: recurring phrases from the house's own minutes, ranked by how often they appear. (Fictional session.) |
| 04c-insert.jpg | 2880×1920 | The single insertion point between two contributions: "+ einfügen" opened (Redaktioneller Text / Tabelle / Textbaustein). Note: the button in this build says "+ einfügen", not "+ hinzufügen" | CLEAN | One insertion point between contributions for an editorial note, a table or a text block. (Fictional session.) |
| 05-export.jpg | 2880×1920 | Export dialog with PDF selected and watermark "Entwurf" switched on | CLEAN | Export as Word or PDF in the office's layout, optionally with a "Draft" watermark. (Fictional session.) |
| 05b-pdf.jpg | 1752×2480 | Page 1 of the exported draft PDF (A4, rendered at 300 dpi): fictional letterhead and placeholder coat of arms, agenda, watermark "Entwurf" | CLEAN (whole printed text scanned) | First page of an exported draft, with the watermark. (Fictional session and letterhead.) |
| 06-phone.jpg | 1170×2532 | 390 px layout (DSF 3): review lines with flags and the audio bar | CLEAN | The review on a phone (390 px). (Fictional session.) |

**"Indirekt" is a disabled placeholder.** In the editor it shows as a greyed, disabled fifth option on every contribution (`BausteinePanel.tsx`: `kommt: true`, tooltip "Kommt: in indirekte Rede umformulieren lassen (lokales Sprachmodell)"). It is visible in 04, 04b, 04c and in the video. A caption should not present it as working; for example: "Indirect speech (planned, shown disabled)". The marketing site's app recreation, however, shows "Indirekte Rede … setzt Ambacta auf Wunsch in indirekte Rede" as a step (web-programm at a later scroll position, not delivered here), so the site currently presents it as shipped.

Load-time patches beyond the earlier name map: the rule note on chair contributions quoted a real staff remark from the 09.09 meeting and is replaced with a neutral sentence; the strings "Nautilus" and "LRAKN" in UI string literals are mapped to Ambacta and Musterkreis (none was visible).

## Video (`/Users/robert/Desktop/Job/Portfolio/public/cases/minutes-v2/`)

| File | Spec | Shows | Scan | Caption / alt |
|---|---|---|---|---|
| editor.mp4 | H.264 High, yuv420p, 1440×960, 30 fps, 18.2 s, 3.6 MB, no audio, faststart; loop seam crossfaded (0.7 s) | Editor at item 17. Pointer leaves out a contribution, makes the next one current, switches Bearbeiten → Wörtlich, scrolls on while the preview follows, leaves out two more, then undoes everything and returns to the start | CLEAN (DOM text captured at 4 points: start, middle, end, after undo) | Stepping through contributions: each choice shows up in the preview at once. (Fictional session.) |
| editor-poster.jpg | 1440×960 | First frame of the video | CLEAN | — |

The CDP screencast delivered frames at CSS-pixel size (1440×960) even with DSF 2, so the video is 1440 wide.

## Website (bewegt-v3.html served locally on :8011, 1440×900, DSF 2)

The variant switcher is hidden. No hours scene is in any frame (checked per capture). On load, the fictional councillor "Weber" in the site's app recreation is replaced with "Vetter" in the capture, because "Weber" matches a surname in the real council roster. The site files are unchanged; Robert may want to rename it on the site too.

| File | Px | Shows | Scan | Caption / alt |
|---|---|---|---|---|
| web-hero.jpg | 2880×1800 | Hero "Dient dem Amt. Bleibt im Haus." with the interactive review card (3 open passages, waveform, release button) | CLEAN | Marketing site hero with a review card visitors can try. |
| web-programm.jpg | 2880×1800 | "So sieht Ambacta aus": HTML recreation of the app, step 3 "Niederschrift" (five choices per contribution) | CLEAN | The product tour on the site is a live HTML recreation of the app, not a screenshot. |
| web-programm-2.jpg | 2880×1800 | Same section, step 2 "Unterlagen" (documents dialog) | CLEAN | Product tour, step 2: meeting documents. |
| web-ton-1.jpg | 2880×1800 | "Vom Ton zur Akte" 01: sound wave | CLEAN | From sound to record, 1: the recording. |
| web-ton-2.jpg | 2880×1800 | 02: words with timestamps | CLEAN | 2: text with the house's terminology. |
| web-ton-3.jpg | 2880×1800 | 03: speakers named, one flagged "prüfen" | CLEAN | 3: contributions get names; uncertain ones are flagged. |
| web-ton-4.jpg | 2880×1800 | 04: signed minutes sheet with stamp "Freigegeben" | CLEAN | 4: a person checks and signs. |
| web-privat.jpg | 2880×1800 | "Privat, bis Sie teilen": privacy card (visible to, retention 7/30 days, access log) | CLEAN | Staff recordings stay private unless shared; deletion after 7 and 30 days. |
| web-haus.jpg | 2880×1800 | "Der Server steht bei Ihnen": isometric house with the on-premise server status panel | CLEAN | The server stands in the authority's own data centre. |
| web-name.jpg | 2880×1800 | "Woher der Name kommt", with a manuscript page of Caesar's De bello Gallico | CLEAN | Where the name comes from: Latin *ambactus*, the root of German "Amt". |

**Photo credits.** Only web-name.jpg contains a third-party photo: "Caius Iulius Caesar, De bello Gallico …" (Bibliothèque nationale de France), public domain, via Wikimedia Commons (credit not required; suggested: "Manuscript page, BnF, public domain, via Wikimedia Commons"). The two CC-licensed council-chamber photos (Hof: CC BY 4.0, PantheraLeo1359531; Jüterbog: CC BY-SA 4.0, Urfin7) appear only in the hours scenes and the roles section, which were not captured.

## Brand

| File | Px | What |
|---|---|---|
| ambacta-mark.svg | 32×32 viewBox | The mark, an "A" whose crossbar runs on as a line of text. Copied from `ambacta-web/website/favicon.svg`. This is the only logo SVG in the brand folders; no separate wordmark SVG exists. |
| ambacta-lockup.png | 1144×336, transparent | Mark plus "Ambacta" in Schibsted Grotesk 700, −0.03em, dark ink (#0f2230), rendered as on the site |
| ambacta-lockup-hell.png | 1144×336, transparent | Same with white ink, for dark backgrounds |

Note: the name "Ambacta" is not yet cleared for public use (filing planned for 23.11.2026; see the research notes, section 0).
