# judge_fix8: ruling 392 in ORACLE_DEBATE_V1 (offline only; nothing written to n8n, the database or git)

- Base: ORACLE_DEBATE_V1 (moMxiV4Irg1uRBZN), live version cfcbb37b (confirmed by GET on 2026-11-03, updatedAt 2026-11-02 23:47:30Z;
  data/workflow_live.json; 67 code nodes in data/live_code/, each equal to judge_fix7/new or to judge_fix7's live read). base/ holds the live code
  of the 39 nodes changed (25 for K1-K7, 14 more for part R); new/<node>.js is built by `python3 patch.py` (which runs patch_r.py for part R) from
  base/ and lib/, anchored, refusing on a wrong count.
- No node or connection is added or removed. write_package.py: one guarded PUT (versionId, base md5 of every base/ node, live connections and
  node count equal the base read). Run only with --dry: write_dry.txt (rebuilt after part R against live cfcbb37b: guards passed; 39 code nodes;
  481 connections, 262 nodes, unchanged).
- Database read with SELECT only. data/ (runs 32284, 32293, 32302 and their enforcer logs) copied from judge_fix7; run 32306 (finished after the
  first build) read into data/run32306.json (row and three judgments) and data/enforcer_log_32306.json (rows 112 to 123).

## The ruling (md_notes_rulings 392)
"a press must have a premise behind it; a verse pressed without one isn't a witness". A pressed witness is a verse carried under PRESSED WITH:
beside a premise of the list against that side (the challenger's list closing [DR2] against the defender; the defender's CHALLENGER'S
UNSUPPORTED-L4 PREMISES list closing [CR3] against the challenger). A verse cited elsewhere is not a witness; leaving it unanswered never counts.

## Changes
- K1 Rule text. Panel Build and Build Independent Verdict: UNANSWERED WITNESS now defines the witness by PRESSED WITH: (replacing "a verse the
  other side quoted against a link or a listed premise"); a new "A PRESS NEEDS A PREMISE (md_notes_rulings 392)" clause limits UNANSWERED WITNESS and
  ruling 372 to those verses and says the "cited in" lines are informational, not a list of witnesses (replacing the clause that let a cited-in verse
  count with a quoted pressing sentence); both UNEXHIBITED clauses carry 392; the ledger header calls the cited-in line informational. The ruling 372
  sentence the K-G6 cure quotes is kept word for word. Cure prompts (14 nodes): the K-G9 sentence and its ruling forms are replaced by K-G10.
  Format Markdown's reading guide ("What else decides a link"): the UNEXHIBITED quotation follows the new words; the 372 entry states 392.
  Init with Guards: the debaters' two copies of the cited-in sentence state 392.
- K2 K-G9 retired: the judges are no longer asked for CITED-IN RULINGS (section and reasoning-field mention removed); the three checkers no longer
  call drvCited (its code stays, unused). K-G10 (TRIAL, ENF_STATUS; lib/kg10.js drvPressWith): a premise the seat's count section counts
  UNEXHIBITED on a witness ground is marked when every verse it names as left unanswered is under no PRESSED WITH: of the list against that side,
  and the segment states no footing ground (fewer than two layers, only [L1], no footing). VOID premises are skipped. Cure (lib/kg10_cure.js): a
  CORRECTED COUNT at most the count less the side's open K-G10 premises, with the standing it makes true (SELF-SUPPORTED at 0 unless a link of that
  side stands BROKEN), or a STATEMENT quoting the PRESSED WITH: line that carries the verse, with its reference. cureSet writes a count cure, not a
  statement cure. Build Save Body and Format Markdown key K-G10 marks (cured flags print as cured). K-G6 unchanged.
- K3 D4 Build: the close list keeps part (a) (verses of the challenger's listed premises no defender round names) and drops part (b) (every
  challenger-cited verse no later defender round names). The close message is otherwise byte-identical (unit fixture on 32302).

- K5 (coordinator, closing the three open points). (1) Collisions: "A witness left unanswered is a BROKEN ground" now reads "A pressed
  witness (a verse a listed premise carries under PRESSED WITH:, md_notes_rulings 392) left unanswered is a BROKEN ground; a verse under no
  PRESSED WITH: line, left unanswered, is no BROKEN ground"; the COUNTING RULE, BROKEN AT COLLISION, the STANDS/UNDERDETERMINED answer sentence and
  the count-0 sentence say the same (Panel Build, Build Independent Verdict). Cure prompts (14): a WITNESS definition heads the items; K-G1, K-G4,
  K-S, K-G7, the retraction rule and the count-0 sentence carry it. Audit marks K-U, K-G1, K-G4 and the challenger K-G7 mark carry it (3 checker
  nodes, and the checker copies in the 14 cure nodes). New TRIAL check K-G11 (lib/kg11.js, run inside drvPressWith): a LINK BROKEN line resting,
  as unanswered, only on verses under no PRESSED WITH:, whose PRESSED WITH verses are each named in a later round of that side; cure: RETRACTED with
  one CORRECTED RESULT, or a RESTATED line not BROKEN, or one resting on an unanswered PRESSED WITH verse. A K-G10 count cure reads the standing
  after the reply's retractions. (2) The ledger premise lines count only PRESSED WITH: verses (seen, named, NOT NAMED, which K-G6 reads); other
  verses of the item print before NOT NAMED as "informational, not witnesses"; the SCOPE header says so. (3) C2 Build and D3 Build: "a verse pressed
  without the PRESSED WITH: line of a listed premise is not a witness and is not weighed as one (operator ruling 392 ...)".
- K6 (coordinator, run 32306) K-V (TRIAL, lib/kv.js, lib/kv_cure.js, run inside drvPressWith): each premise a seat rules VOID must, in that
  ruling, quote charge words that go beyond the quote (a phrase found in the premise's list item outside its quoted passages and its PRESSED WITH)
  and name the kind (negation, universal, or a claim the words of the quote do not make); a VOID for no verbatim quote needs no charge words; a
  denial ("No premise is VOID") is not a ruling. Cure: a STATEMENT doing both, or the premise regraded in a RESTATED count line (SUPPORTED or
  NARROWED; or counted with CORRECTED COUNT and STANDING). The VOID rule in Panel Build and Build Independent Verdict asks for both. In cureSet a
  K-V item counts among the side's count items only when a count cured it, so an open K-V never holds back another cured count (32293 Sol).
- K7 (coordinator) D4 Build part (a), the close list of verses still unanswered, reads only the verses each premise carries under PRESSED WITH:
  (as the ledger does); its heading and its "none" line say so. On the stored rounds part (a) is empty before and after (the defender named every
  verse). With the defender's rounds 2 and 3 blanked, so that part (a) shows every verse in scope: 32302 loses none (every [DR2] premise verse is
  under PRESSED WITH); 32306 loses Romans 1:3 from premise 2 (it stands in that premise's quoted claim, and stays listed under premise 1).

## Tests (test/)
compile_out.txt (25 compile); unit8_out.txt (193 fixtures, 0 bad: K7 on D4 for 32302 and 32306, stored and blanked; K1 to K3 as before; K5: the collision text in every copy, the marks, Sol's
32293 D3 vs C2 line, K-G11 on every other stored seat (none), the K-G11 cure, the ledger and K-G6 base against new on 9 seats (unchanged); K6:
ChatGPT's 32306 lines, Gemini and GLM (none), synthetic rulings, the K-V cure); replay8_out.txt (base = live cfcbb37b, new = this set, ruled =
new with each K-G10 item recounted and each K-G11 line retracted, as the ruling asks; runs 32284, 32293, 32302, 32306).
- Sol's 32293 "D3 vs C2 (Matthew 1:25; Luke 1:27): CHALLENGER LINK BROKEN": the part resting on an unanswered verse names Luke 1:27 only ("Luke
  1:27 supplies the unanswered description"; GROUND "[DR3] leaves Luke 1:27 unanswered"), under no PRESSED WITH of the [CR3] list. Its other
  ground, the chain read through Matthew 1:25 ([L1]), ginosko ([L2]) and Genesis 4:1 ([L3]), names one PRESSED WITH verse, Matthew 1:25
  (premise 2), which [DR1], [DR2] and [DR3] name: answered by the rule, so the line does not stand on it. A counter-fixture with Matthew 1:25
  unnamed leaves the line standing (no mark).

| Run | Seat | base (live) | new | ruled |
|---|---|---|---|---|
| 32284 | ChatGPT | C PROP-DEP 3, DEFENDER WINS | same; K-G10 x2, K-V x2 (TRIAL) | C PROP-DEP 1, DEFENDER WINS |
| 32293 | Sol (stored panel) | C PROP-DEP 2, DEFENDER WINS | same; K-G10 x2, K-G11, K-V x5 | C SELF-SUP 0, UNDERDETERMINED |
| 32293 | ChatGPT | UNDERDETERMINED | same; K-V x2 | same |
| 32302 | Gemini, GLM, ChatGPT | unchanged | K-V on Gemini (1), ChatGPT (3), alternate Sol (3) | unchanged |
| 32306 | ChatGPT | SELF-SUP 0 / SELF-SUP 0, UNDERDETERMINED | same; K-V x11 | same |

Outcomes (base, new, ruled): 32284 UNDERDETERMINED; 32293 UNDERDETERMINED (stored panel 2-1 becomes 3-0 when ruled); 32302 DEFENDER PREVAILS;
32306 UNDERDETERMINED. No outcome moves. Every other seat: unchanged but for the K-G9 item removed.

## Needs the operator
- K-V is TRIAL and moves nothing by itself: what ChatGPT's 32306 counts would be if its eleven VOID rulings fell is the cure's to say. K-V also
  marks earlier seats (32302 Gemini premise 1, "charge asserts a negation not in the quote", which names the kind but quotes no charge words; Sol's
  32293 "the charge adds "only"" quotes the word but names no kind).

## Part R (the reviews of run 32306 by Worker_E and Worker_G1; ruling 393): patch_r.py, lib/c4p_press.js, lbfoot.js, ks2.js, klxx.js, klxx_cure.js; kv.js and kg10.js extended
New TRIAL rules: K-S2 (now an item) and K-LXX (ENF_STATUS TRIAL in the 3 checkers and 14 cure nodes; they remove no seat). 14 nodes added to base/
(live cfcbb37b code): Build Synthesis, C1/C2/C3/C4 Extract, D1/D2/D3/D4 Extract, C1 Build, C3 Build, C4 Build, D1 Build, D2 Build.
- R1 Close-round grading check (C4P.press, 9 identical copies): a sentence is marked only when it names the other side or its link and states a grade
  (CONCEDED, BROKEN, UNEXHIBITED, VOID, fails, circular, does not carry/stand/follow, floats, left unanswered, a concession claimed of a link/point),
  or stands in a new premise list (heading UNSUPPORTED-L4 PREMISES, PREMISE COUNT, every sentence under it) or a PRESSED WITH: line. The side's own
  grants, a verse quoted for its own link, a report of the other side's own words, and heading/link-label scope marks are gone. 32306: defender 23 -> 0
  (items 3-13 and 19-22 unmarked); challenger 37 (transcript) / 34 (judges) -> 16 (items 23-37, the new list, all marked; plus "the defender's own answer
  granted this point"). Other closes: 32284 D 10->5, C 4->2; 32293 D 16->2, C 20->1; 32302 D 46->0, C 36->0.
- R2 Computed once in Build Synthesis from every round (close_graded); Build Save Body stores it in full as one AUDIT v27 line per close (also when 0);
  Panel Build and Build Independent Verdict print Build Synthesis's result (on a regrade, the saved row's v27 line); Format Markdown prints the saved
  row's line. D4/C4 Extract no longer compute it. (34 vs 37 came from Format Markdown and C4 Extract reading fewer rounds.)
- R3 Format Markdown prints "Single judge (second opinion)" after the panel: verdict, text (corrected lines in place), its flags, its cures table.
  This reverses the earlier choice (DoD 10 (c)) to keep the single judge in the row only.
- R4 Cure nodes (cureRecompute/cureRewrite): the standing and count lines are compared with the text as the judge wrote it, not only the fields
  (GLM 32306: the fields were already PROP-DEPENDENT 1 from cureSetApply, so the text was never rewritten); a RESTATED collision line of the same grade
  is written in place (fields unchanged; AUDIT v27 RESTATED LINES WRITTEN); each replaced line's original is kept in full on an AUDIT v27 SUPERSEDED
  LINE, which Format Markdown prints below the corrected line ("corrected by the cure" / "Superseded by the cure"). A count cure's report row carries
  the item's own RESPONSE after the shared count lines. The single judge's text was already rewritten for retractions (32306); only same-grade
  restatements and text-vs-field standing/count were missed.
  Engine manual (v86 says recomputed values are written "to its fields and text"); v87 must say: after a cure the counted fields are written; in the
  judge's text, a retracted or restated collision line (any grade), the standing line, the count line, the RESULT and CLAUSE lines are replaced by the
  corrected ones whenever the text differs from the counted value; each original is kept on an AUDIT v27 SUPERSEDED LINE and printed below the
  corrected line in the transcript; the violation table row of a count cure shows the item's own RESPONSE; the single judge is printed after the panel.
- R5 K-LB reads footing (lib/lbfoot.js): a quoted verse with its reference is L1, tagged or not; a source word with its meaning (script, marks,
  italics, or under [L2]/Greek/Hebrew) is L2; a verse from another place is L3 only when read as a cross-reference (a sentence with two places and
  a cross-reference word, or an [L3] scope naming another place with a comparison word or a term it shares with the block). The answers to the
  pressed verses are not footing. FOOTING LAYERS, same words, in Panel Build, Build Independent Verdict and the 14 cure prompts. The K-LB statement
  cure tests the block's own words (lbFoot on the block), never the judge's tags; a reply whose own RESPONSE says the premise is not counted is not
  cured by another premise's count. 32306: premise 3 no longer fires (L1 untagged + L2); premise 6 fires; Gemini's "[L3]" statement no longer cures it.
- R6 K-S2 (lib/ks2.js): every GROUND clause of an UNDERDETERMINED/STANDS collision line and the reasoning line, for the K-C and K-S forms and "no
  (exhibited) witness('s own words) state(s)", "none states that", "state(s) no ...", "in its own words"; a line K-C marks is left to K-C. Items go
  to the cure and are cured as K-C (ks2Keeps tests the restated line). The old v22 K-S2 mark is disabled. 32306 GLM: 7 K-S2 + 4 K-C = 11 lines.
- R7 Pre-check UNIVERSAL TEST (Panel Build, Build Independent Verdict): per premise, the negation/universal words of the charge its quote lacks
  (32306 defender list: ONLY p2, NOTHING p3, NEVER p4, REVERSED p6). K-V also passes a VOID ruling that names such a word (quoted, capitals, after
  "adds"/"the word"; uncommon words also plain or by stem). 32306 ChatGPT K-V 11 -> 8 (challenger premises 2, 3, 6 pass); the K6 fixture now asserts
  both (K6 test alone: 11; with R7: 8). C2 Build, D3 Build: each premise quotes a whole claim sentence, not a fragment.
- R8 DD-2 in D1 Build and D2 Build no longer prescribes "Noted. Not conceding here. Goes to review." (it now says no stock phrase stands in for an
  answer). D1-D4 Extract strip it (marker "(placeholder removed by the system)"), round_fix.placeholder; Build Save Body review line; Build
  Synthesis is told it is a defect, not method. 32306 D2: 3 stripped.
- R9 C4 Build: no premise list, no PRESSED WITH:, no charge or grade against defender links in round 4. All 8 extracts normalize a heading in the
  first three lines that names another round (32306 C2 "Round 3 (close)" -> "Round 2"); Build Save Body review line.
- R10 S-E: before flagging, the claim's own references (two or more, read before the verb) standing within 300 characters in a round of that side
  (close included) hold the words. 32306 C3 flag gone; base reproduces it.
- R11 K-LXX (lib/klxx.js): Septuagint scan of the debaters' rounds, served with the pre-check; a judge that says no Septuagint reading occurred while
  the scan found one is marked (32306 Gemini; GLM and ChatGPT not). Cure: STATEMENT naming it with its round quoted, or RESTATED CITATION CHECK.
- R12 SHEET.req (15 identical copies): a sheet serving Psalms 2:7 or Acts 13:33 serves Acts 13:33, Hebrews 1:5, Hebrews 5:5 (both seats' sheets;
  the sheet is shared). The DG-18 guard text is in drift_guards (not changed); its anchor_verses lack Hebrews 5:5.
- R13 (md_notes_rulings 393): pwList (K-G10/K-G11/K-V), the judges' ledger (K-G6) and D4 Build's still-unanswered list take the first 8 distinct
  verses under one premise's PRESSED WITH:; the rest are "over the cap ... not witnesses" in the ledger (before NOT NAMED) and in a Build Save Body
  review line. Rulebook and C2/D3 list instructions state it. 32306 challenger premise 2: 20 verses, 8 kept, 12 over; 32306 also p3 +6, p4 +2;
  32284 challenger list p1 +1, p5 +2.

Tests: compile_out.txt (39 compile); unit8_out.txt (194: the 193, with the 32306 K-V fixture split into K6-alone 11 and R7 8); unitR_out.txt (85, R1-R13
on 32306); transcript_32306_R.md (Format Markdown on the 32306 row with GLM's and the single judge's text re-cured); replay8_out.txt rerun: every
seat's verdict, standings and result and every panel outcome unchanged in base/new/ruled; only TRIAL items move (K-LB on footing, K-S2, K-LXX, K-V).
