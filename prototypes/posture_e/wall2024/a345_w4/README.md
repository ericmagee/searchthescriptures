# ASK 345 (pkgECW rev 3) — W4 build, offline. NOT LIVE.
Design: Wall 7221 + 7223 + 7225. Design passes: W2 7224, W1 7229. Eric card "Build ASK 345" (00:03Z 11-17).
Input: live s231 f96cbf43 = writes_s231/fetchback_s231_340c.json (node sha 29719f066a6468b2, same as a fresh read 00:03Z).
Run: `node build345.cjs <live.json> target_345.json` then `node replay345.cjs`. Target node sha cd2b57da754a0070, library sha 9e45af29eaac92fe, 3501 lines.
Nodes changed: Shared Library; stubs of Judge Enforcer Record, Alt Judge Enforcer Record, R2 Alt Judge Enforcer Record. Connections, settings, model settings: unchanged.
Library sources changed (12): Judge Enforcer Build x3 (RULES), Judge Enforcer Record x3, Send Back Build x3, Send Back Record x3.

## Edits
- E1 L3198 (DeepSeek RULES, RULE E-COL): C5 sentence; CARRIED BY instruction (C1).
- E2 L2958 __ecfR: C5 sentence; shows the CARRIED BY row and the third KEEP (C4).
- E3/E4 L2933, L2963: the shown row rides on the send-back item (flow JSON, not a DB row).
- E5/E6 L2781, L2690 enf428Cure: third KEEP (6 words of the shown row + 6 words of the meaning pressed, from the pressing side's rounds, not inside the row).
- E7/E8 L3410, L3415: true-status label (C3).
- E9 L3461/3462: the gate (C1, C2) on DeepSeek's full sentence; stats in enf428.ecw.
- E10: new library line 3500 = ecw.js (module ECW), first entry of the 9 nodes that use it.
- E11: the 3 Record stubs name $("Cited Verses") and $("L2 Words").

## BUILD CHOICES (for the code grade)
1. Scope: every E-COL DISAGREE (right: STANDS) needs CARRIED BY, except grounds of absence, witness ledger, footing, or a line that quotes no answer words (keyword exemption). History: 302 such rows; 26 match absence/ledger.
2. Answering round: the round in the line's ANSWER [XRn]; otherwise every round of the answering side.
3. Reference forms: "Book c:v", a range covering it, or a bare "c:v" within 400 characters after the same book and chapter.
4. Quote check (C2, W3 b): each quotation of 3+ words in the enforcer's sentence must stand, piece by piece and in order, in some round, the judge's line, or a verse read this run. Normalized: layer/round tags, brackets, curly quotes, apostrophes, case, spacing.
5. Not read this run (verse not in Cited Verses, or the verse not in L2 Words): sent, with NOT CHECKED in the note. No false hold for missing data.
6. The field is the last CARRIED BY on DeepSeek's reply line outside quotation marks (a quoted judge FORCED line holds the K-FC field of the same name). The judge-facing label has a different name.
7. Held row: "ENFORCER HELD (pkgECW, recorded, not sent back: <why>)", the pkgEAW/pkgEAX pattern. Sent row: a code-check note before " (judge wrote "; Send Back Build reads only that note.
8. Label: E-COL ENFORCED; E-HOLD on UNDERDETERMINED with right BROKEN ENFORCED (pkgUND); E-SYN, K-W RECORD-ONLY; others "SENT BACK, CURE RECORD-ONLY". It is judge-facing (it sits in THE ENFORCER text). Side effect: DB function jfl_counted skips text with "record-only|TRIAL"; E-COL and pkgUND UNCURED send-backs will now count there, as they already count in drv_uncured. Assume Check Record's "RECORD-ONLY TRIAL (VP4)" is true and is left as is.
9. C5 location: the second copy is DeepSeek's RULES, not text the judges read. The judges' prompts hold no copy (full search of all 458 nodes and 45 rebuilt sources).
10. ESR_W / ESR_BASE unchanged (RULES grows by about 900 characters).
11. ECW.gate also reads E-HOLD pushes toward UNDERDETERMINED, but the switch HOLD is false in ASK 345; ASK 346 turns it on.
12. Third KEEP when the row text was not read: name the reference and quote 6 words of the meaning pressed.

## Readers read back
__ecfR (3 Send Back Build); RULE E-COL (3 Judge Enforcer Build); L3045 FAILS note (unchanged); label readers: why() L2920, " (judge wrote " regexes L2752, L3414, L3422, L3431, L3459; DB jfl_counted.

## Pre-existing finding (not changed)
Send Back Build x3 and Send Back Record x3 read $('L2 Count Plan') (ASK 340 gloss code) but their stubs do not name it; the read is in try/catch, so there it returns nothing.
