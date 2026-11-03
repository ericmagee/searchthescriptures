# judge_fix9: the proven structure in ORACLE_DEBATE_V1 (offline only; nothing written to n8n, the database or git)

- Base: ORACLE_DEBATE_V1 (moMxiV4Irg1uRBZN), live version cb4b94e0 (fix set 8), read by one GET on 2026-11-03 (updatedAt 2026-11-03 05:53:49Z;
  data/get_live.py, data/workflow_live.json, 71 code nodes in data/live_code/). The 42 nodes fix set 8 changed equal judge_fix8/new byte for
  byte, and its 4 added code nodes equal judge_fix8/add. base/ holds the live code of the 44 nodes fix set 9 changes; new/ is built from base/
  and lib/ by `python3 patch.py` (texts in texts.py), anchored, refusing on a wrong anchor count; add/ holds the 30 nodes added (nodes_9.json
  and the code of its 15 code nodes).
- write_package.py: one guarded PUT, and only with the explicit flag `--write`; with no flag or `--dry` it makes one GET and writes nothing.
  Guards: versionId, md5 of every base/ node, connections and node count equal the base read; added names and ids free; the removed links
  live; no connection outside the planned sources changes. write_dry.txt (no flag, against live cb4b94e0): guards passed; 44 code nodes
  changed, 30 added (271 -> 301 nodes), 493 -> 523 connections (7 removed, 37 added). No model call body gains a reasoning, effort or
  thinking field (test/compile.cjs checks it).
- Database: SELECT only (original_words, lexicon_words, kjv_verses, debate_results.synthesis for 32302 and 32306); saved in data/.
- Design: prototypes/proven_structure/PROVEN_STRUCTURE_DRAFT_v2.md, with rulings 400 (L3 = supporting verses for L1; the footing reader of
  fix set 8, lbFoot, is used unchanged), 401 and 402 (the single judge is not printed; nothing here prints it).

## Changes
- **S1 Judge rulebook.** Sentence (B) ("A witness contradicts a link only when its own words state the contrary ...") is gone from every node:
  Panel Build and Build Independent Verdict, and the posture text in 11 nodes (Commitment 3, now "No link is forced": ruling 396; Commitment 5
  counts proven presses only). In its place (lib texts.py R396): a link that cannot take a proven witness's meaning is forced and breaks; the
  meaning weighed is the one the debaters exhibit; the judge supplies none; "no witness states it in its own words" is never a ground for
  either side; a forced-link grade is followed by `FORCED: D<i> vs C<j> -- MEANS [<round>]: "..." -- ANSWER [<round>]: "..." -- FAILS: "..."`.
  The BROKEN rule counts a pressed witness only as a proven press. The 14 cure prompts carry ruling 396 and the K-P, K-F, K-R, K-L2 items.
  K-F (TRIAL, lib/kfr.js): a FORCED line whose three quotations do not each stand in the round named (FAILS in the answer's round), a malformed
  FORCED line, or a BROKEN line grounded on a forced link (forced, cannot take, does not fit, 396) with no FORCED line. Cure (lib/kfr_cure.js):
  a FORCED line that holds, RETRACTED with one CORRECTED RESULT, or a RESTATED line not LINK BROKEN.
- **S2 Debaters.** Init with Guards: the PROVEN STRUCTURE text (layers defined once; every critical point -- declared link, premise block,
  press, answer, [L4] -- carries its layers; the charge sentence is exempt; counts name their unit, verses or tokens) goes to both seat
  profiles; the Oracle seat also gets "Prove every position with the layers. A statement of your position is not proof of it." D1-D4 and
  C1-C4 Build append the same text to the round's last user message. C2 Build and D3 Build (the two premise lists) ask every press in the
  fixed form `<reference> "<KJV quote>" -- MEANS: <one sentence> -- <[L2] word (meaning) | [L3] reference "quote"> | PROVEN IN [<round>]`.
  S2 is prompt text only: no check reads a debater's answers or [L4]s for layers (only presses are parsed, S3).
- **S3 Ledger and ruling 372 counting.** lib/press.js (PRS) parses each press: PROVEN (MEANS + an [L2] word (meaning) or an [L3] other verse
  with reference and quote, in place; an [L2] the [L2] check marks NOT COUNTED does not count), PROVEN BY REFERENCE (MEANS + PROVEN IN [round],
  checked: the round exists and is not later than the press, quotes the verse with its reference, and that block (LINK block / numbered item /
  paragraph) carries two kinds by lbFoot), else UNPROVEN. Cap of 8 per premise kept. The judges' ledger (Panel Build, Build Independent
  Verdict) shows per premise PROVEN / PROVEN BY REFERENCE counts and the UNPROVEN presses "not a witness (ruling 398)" with the reason; named
  and NOT NAMED count proven presses only (so K-G6, which reads NOT NAMED, counts proven only). pwList in the 3 checkers and 14 cure nodes:
  keys = proven presses (all = every press), so K-G10 and K-G11 count proven only; a count or BROKEN line resting on an unproven press becomes
  K-P (S6). K-G1 and K-G4 (LIVE) are not raised on a BROKEN line whose unanswered verses are all unproven presses (an audit line says K-P reads
  it). D4 Build's still-pressed list holds proven presses only; unproven ones are listed apart as "(b) UNPROVEN PRESSES, not witnesses".
  Rulebook: the PROVEN PRESS rule and the line `REFERENCE: <press> -- [<round>] -- CONFIRMED | NOT CONFIRMED -- "<block meaning>" / "<MEANS>"`
  (strict; the other side's round may be cited for the meaning it exhibited). K-R (TRIAL): a press proven by reference with no REFERENCE line,
  or one naming another round, or whose quotations do not stand. Cure: one REFERENCE line that holds.
- **S4 [L2].** lib/l2.js (L2C). Sheet: before rounds 2-4 (D2, C2, D3, C3, D4, C4) both seats get the [L2] SHEET, one row per distinct Strong's
  number in every cited verse (pressed verses first, then cited, in order of first citation): number, dictionary form, the lexicon gloss quoted
  whole; function words left out by morph code (Greek T, CONJ, COND, PREP, PRT, INJ and the pronouns P, R, C, D, K, I, X, Q, F, S; Hebrew: the
  word's own segment a particle T.., conjunction C/c, preposition R or pronoun P); capped at 26,000 characters, the rest listed by number
  (coordinator's decisions, 2026-11-03). Reads paginated, no verse cap: "<R> Words Plan" (code, one item per batch of 20 verses from the
  Extract's plan) -> "<R> Words Sheet" (one original_words request per item) -> "<R> Lexicon Plan" (code, batches of 250 numbers, function
  words left out) -> "<R> Lexicon Sheet" (24 added nodes). Not served to the judges (Panel Build test: no gloss in the judges' prompt).
  Check: debater word -> dictionary form (accents stripped; beta code as this table writes it: q theta, h eta, w omega, v final sigma, c chi,
  x xi, y psi, f phi; Hebrew prefixes and the table's "/" stripped) -> Strong's number -> COUNTED when it occurs in a verse the block cites;
  inflected form second route; a Strong's number matches itself; Apocrypha UNVERIFIABLE; a verse not read UNVERIFIABLE; no word named or no
  verse cited NOT COUNTED; a tag naming no Hebrew or Greek word is no [L2] claim: IGNORED, shown to no one and counted nowhere. Counts recomputed (verses and tokens), "DIFFERS FROM THE RECORD (n verses, m tokens)", "unit not named" noted.
  Judges' path, paginated likewise: Find Words -> L2 Words Plan -> L2 Words -> L2 Lexicon Plan (every number, no gloss) -> L2 Lexicon -> L2
  Count Plan (code) -> L2 Counts -> Quote Report (6 added nodes). A verse is unread only if its batch fails; the count read stays one request
  (a claimed number with 1,000 rows or more is UNVERIFIABLE "over the row cap"). Judges get
  one line per tag: COUNTED / NOT COUNTED (reason) / UNVERIFIABLE, and the count lines, with the [L2] rule. K-L2 (TRIAL): a judge's own [L2]
  in a COLLISION POINTS line whose word is in no verse that line cites. Build Save Body records the check, and counts that differ, in review_notes.
- **S5 Synthesis.** Citation Scan adds the synthesis as a round (side SYNTHESIS); Quote Report reports its quotations apart (the judges' items
  are unchanged) with a verdict-phrase scan; Build Save Body records both; Format Markdown prints "Citation check of the synthesis". Build
  Synthesis: quote only the record, no verdict of any kind, quotations are checked.
- **S6 K-P (TRIAL).** A premise counted UNEXHIBITED on a press the ledger marks UNPROVEN, or a BROKEN line resting as unanswered on one. Cure as
  K-G10 (a CORRECTED COUNT without it; a STATEMENT does not cure) or as K-G11 (RETRACTED, regraded, or restated on a proven press).
  All new rules (K-P, K-F, K-R, K-L2) are TRIAL in ENF_STATUS of the 3 checkers and 14 cure nodes: logged and answered, never in drv_uncured.

- **F1 (live run 32341, debate ee1692e3, enforcer row 124: a false seat drop).** GLM's cure for K-G4 D3 vs C4 wrote "RETRACTED: D3 vs C4 --
  [DR3] LINK 4 answered every witness ... so the CHALLENGER LINK BROKEN grade rested on no pressed witness left unanswered ...", a RESTATED line
  (UNDERDETERMINED) and CORRECTED RESULT: HELD-1; cureLines refused the RETRACTED line as malformed because its reason names "LINK BROKEN", the
  item stayed UNCURED (LIVE), and GLM was dropped (Sol substituted). In cureLines of the 14 cure nodes (the checkers do not parse cure
  replies) a RETRACTED line is now refused only when it regrades the link LINK BROKEN: its reason opens with that grade (after the label, a
  parenthetical and a separator; "regraded to" allowed) or says "regraded / graded / now ... LINK BROKEN" (cureRegradesBroken). A reason naming
  the retracted grade is allowed. Data: data/run32341.json and data/enforcer_log_32341.json (SELECT), data/enforcer_log_32266.json (judge_fix4).

## Tests (test/)
- compile_out.txt: 59 files compile (44 changed, 15 added code nodes); no reasoning/effort/thinking field introduced.
- unit9_out.txt: 142 fixtures, 0 bad (F1: base reproduces the refusal; row 124 cures in all 14 nodes; GLM 32266's ten RETRACTED lines read as
  before; five true regrades to LINK BROKEN stay refused; with the stored reply, K-G4 D3 vs C4 is UNCURED on base and CURED on new) (pass and fail cases for S1-S6; normal runs: Init with Guards, D4 Build with and without the sheet reads,
  Quote Report without the [L2] nodes, Panel Build with an old-shape Quote Report, Panel Payloads and the 3 Panel Cure Builds on the stored
  32306 replies, base and new; the plan nodes). 32306 sheet: all 85 cited verses read in 5 requests (1,604 rows, 517 numbers); 49 function
  words left out; lexicon read in 2 requests (461 numbers); the 26,000-character cap holds 79 rows and lists 382 numbers left off. Judges'
  check for 32306: 71 verses in 4 requests, every one read.
- l2_fixture_out.txt ([L2] fixture, every tag of 32302 and 32306; rows read 2026-11-03): 105 tags: 98 COUNTED; 2 not in the cited verse (32302
  [DR1], the challenger quoting the defender's [L2] claim with its "Contrary:" verse: enomizeto beside Luke 3:31; eginosken/heos beside Matthew
  1:19; checked like any other, as decided); 5 IGNORED (headings and English-only tags); 0 Apocrypha; 0 not read; 0 count claims. 32284 and
  32293 also: 103 tags, 82 COUNTED, 4 not in the cited verse (one is Dauid against the TR's Dabid), 17 IGNORED; one count (32284 "H5959 ... 7
  rows") matches (unit not named). Unchanged by the re-test except the 5 / 17 tags now IGNORED instead of NOT COUNTED.
- measure9_out.txt: presses within the cap, all UNPROVEN by format (the stored lines carry a reference and a quotation only, so this measures
  the old format, not the debaters): 32284 61, 32293 59, 32302 29, 32306 84. Ledger NOT NAMED verses: 32302 2 -> 0, the others 0 -> 0.
- replay9_out.txt (base = live cb4b94e0, new, ruled = new with each K-P answered as ruling 398 asks), what moves:
  32302 Gemini: + K-P challenger premises 2 and 4 (TRIAL); ruled C COLLAPSED 3 -> PROP-DEPENDENT 1, result DEFENDER WINS unchanged.
  32302 GLM: K-G4 D6 vs C4 (LIVE) no longer raised, K-P D6 vs C4 (TRIAL) instead; drv_uncured 0 either way.
  32341 (F1): base reproduces the drop (GLM drv_uncured 1, Sol substituted); new: GLM's K-G4 D3 vs C4 cures by retraction, drv_uncured 0,
  GLM counted (D SELF-SUPPORTED 0, C SELF-SUPPORTED 0, UNDERDETERMINED); the panel becomes gemini, glm, chatgpt: HELD, UNDERDETERMINED, the
  same outcome as the stored panel (chatgpt, gemini, sol). Its 68 presses parse UNPROVEN by format; no K-P.
  32284, 32293, 32306: no item, count or result moves. No panel outcome moves (32284 UNDERDETERMINED, 32293 UNDERDETERMINED, 32302 DEFENDER
  PREVAILS, 32306 UNDERDETERMINED). K-F and K-R fire nowhere on stored text (no FORCED, REFERENCE or PROVEN IN lines exist yet).
- synth9_out.txt (S5 on the stored syntheses): 32306, 16 quotations, 1 does not match: Hebrews 7:14 "how the Messiah's Davidic descent is
  evident" (the case the draft names); 32302, 15, 1 does not match (Luke 1:62 beside a debater's words). No verdict phrase in either.

## Decisions applied (coordinator, 2026-11-03)
1. Sheet: function words left out by morph code, pressed verses first, the 26,000-character cap kept. On 32306 the cap still holds only 79 of
   the 461 content numbers (382 listed as left off); a larger cap or a narrower verse set would be the next lever.
2. Read caps removed: paginated reads, one request per batch of 20 verses (sheet and judges) and of 250 numbers (lexicon); no verse is
   UNVERIFIABLE for a cap.
3. Block rule extension adopted as built. 4. A tag naming no Hebrew or Greek word is IGNORED; a tag quoting the other side's [L2] is checked.
5, 6. Adopted as built (no separate NOT COUNTED switch; K-G1/K-G4 yield to K-P on lines resting only on unproven presses).

## Still open
- The draft's dry regrade of 32306 needs model calls and was not run.
- F1: "32266's GLM form must stay refused" read as: its ten RETRACTED lines (regraded UNDERDETERMINED) keep the reading fix set 4 gave them
  (accepted); the forms that stay refused are the true regrades to LINK BROKEN.
- The count read is one request: a claimed Strong's number with 1,000 rows or more reads UNVERIFIABLE (over the row cap).
