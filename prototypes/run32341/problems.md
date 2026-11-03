# Run 32341: Claude Sonnet 5.5 (plain defender) vs Claude Opus 5.5 (oracle challenger), first run on fix set 8

Flow cb4b94e0 (fix set 8 live). Fired 23:5x CST 2026-11-02; stopped 00:38 CST 2026-11-03.
Debate ee1692e3-951b-4b7a-b7c0-252b033d0f12. Outcome UNDERDETERMINED; all three counted seats HELD-1, n=5 w=0 k=0, both standings SELF-SUPPORTED 0/0.

## Seats
- gemini: counted, no marks.
- glm: DROPPED, falsely. K-G4 D3 vs C4 marked UNCURED as "malformed": its cure was a RETRACTED line with a reason that names the retracted grade ("so the CHALLENGER LINK BROKEN grade rested on no pressed witness left unanswered"), a RESTATED line graded UNDERDETERMINED and CORRECTED RESULT HELD-1. cureLines() refuses any RETRACTED line whose text mentions LINK BROKEN. Cost: 855 s judging + 295 s cure, then the alternate. Fix F1 routed to fix set 9.
- sol (alternate for glm): counted; K-V (TRIAL) on challenger premise 3 cured.
- chatgpt: counted; K-V (TRIAL) on defender premise 1 and challenger premise 3 answered but not cured (TRIAL, no seat effect).
- single judge (not printed, ruling 402): K-G4 D5 vs C5 retracted, K-C D3 vs C3 cured.

## Timings
Panel: gemini 97 s; glm 855 s + cure 295 s (then dropped); chatgpt 51 s + cure 19 s; sol alternate 75 s + cure 8 s. timings: prototypes/timings/timings_32341.json.

## Notes
- Sentence (B) was still live in this run (fix set 9 removes it). The run measures fix set 8 only.
- No VOID mass-ruling this run; K-V marks fired on ChatGPT twice.
