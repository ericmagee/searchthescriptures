# judge_fix8: ruling 392 in ORACLE_DEBATE_V1 (offline only; nothing written to n8n, the database or git)

- Base: ORACLE_DEBATE_V1 (moMxiV4Irg1uRBZN), live version cfcbb37b (confirmed by GET on 2026-11-03, updatedAt 2026-11-02 23:47:30Z;
  data/workflow_live.json; 67 code nodes in data/live_code/, each equal to judge_fix7/new or to judge_fix7's live read). base/ holds the live code
  of the 39 nodes changed (25 for K1-K7, 14 more for part R); new/<node>.js is built by `python3 patch.py` (which runs patch_r.py for part R) from
  base/ and lib/, anchored, refusing on a wrong count.
- Parts K and R add or remove no node or connection; part P (below) adds 9 nodes, removes 1 link and adds 13. write_package.py: one guarded PUT
  (versionId, base md5 of every base/ node, live connections and node count equal the base read, added names and ids free, the removed link live).
  Run only with --dry: write_dry.txt (rebuilt after part P against live cfcbb37b by one GET: guards passed; 42 code nodes changed, 9 added;
  481 -> 493 connections, 262 -> 271 nodes).
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
- R3 WITHDRAWN (operator ruling 402: the single judge, DeepSeek's second opinion, is not printed in the debate document). Format Markdown keeps
  its pre-R3 behavior for the single judge (it stays in the stored row only); R3 touched no other node. The R4 rewrite still applies to the single
  judge's stored text (independent_verdict_raw).
- R4 Cure nodes (cureRecompute/cureRewrite): the standing and count lines are compared with the text as the judge wrote it, not only the fields
  (GLM 32306: the fields were already PROP-DEPENDENT 1 from cureSetApply, so the text was never rewritten); a RESTATED collision line of the same grade
  is written in place (fields unchanged; AUDIT v27 RESTATED LINES WRITTEN); each replaced line's original is kept in full on an AUDIT v27 SUPERSEDED
  LINE, which Format Markdown prints below the corrected line ("corrected by the cure" / "Superseded by the cure"). A count cure's report row carries
  the item's own RESPONSE after the shared count lines. The single judge's text was already rewritten for retractions (32306); only same-grade
  restatements and text-vs-field standing/count were missed.
  Engine manual (v86 says recomputed values are written "to its fields and text"); v87 must say: after a cure the counted fields are written; in the
  judge's text, a retracted or restated collision line (any grade), the standing line, the count line, the RESULT and CLAUSE lines are replaced by the
  corrected ones whenever the text differs from the counted value; each original is kept on an AUDIT v27 SUPERSEDED LINE and printed below the
  corrected line in the transcript; the violation table row of a count cure shows the item's own RESPONSE. (The single judge is not printed: ruling 402.)
- R5 Footing read by one definition everywhere (lib/lbfoot.js, lbFoot), as amended by operator ruling 400 (md_notes_rulings 400: "L3 is supporting
  verse(s) for L1") and the coordinator's two corrections: each quotation is paired with its reference (written just after it in brackets, or the
  nearest before it); the first verse quoted is L1, tagged or not; any other verse quoted with its reference after it, as support, is L3, tagged or
  not, the same chapter included; a source word with its meaning (script, marks, italics, or under [L2]/Greek/Hebrew) is L2. A reference with no
  quotation, or a tag alone, adds nothing; in a link-round block the answers to the pressed verses are not footing. The cross-reference,
  comparison-word, shared-term and same-chapter tests are withdrawn.
  Where it stands: FOOTING LAYERS (one text) in the link-round rule and in the judges' BROKEN-line rule (Panel Build, Build Independent Verdict; it
  replaces "each tagged ... [L3] with the cross-reference named. Two quotations at one layer are one layer."), the same in the BROKEN-line rule and
  the K-LB item of the 14 cure prompts, and Format Markdown's Rule B note. Code: K-LB (lbKinds) and drvLayers, which the K-B BROKEN-line count and
  the K-C, K-SC and K-LB cure tests use, are lbFoot in the 3 checkers and the 14 cure nodes (the tag reader is kept as drvLayersByTag, unused).
  The K-LB statement cure tests the block's own words; a reply whose own RESPONSE says the premise is not counted is not cured by another premise's count.
  32306 premise 3 ([CR3] LINK 4): L1 Luke 3:23, L2 enomizeto and hes, L3 Matthew 1:16. Premise 6 ([CR3] LINK 5): L1 Jeremiah 22:30, L3 Matthew 1:12
  and Luke 1:32 (all tagged [L1]). Neither fires. On the four stored runs no link-round block now fires (32284 challenger premise 6, Matthew 1:11 then
  1:12, reads L1+L3); the 3 stored first-reply BROKEN lines read the same kinds-count under both readers, and no K-B item moves in the replay.
  Seat moves (results and panels unchanged): 32302 Gemini D PROP-DEPENDENT 2 -> SELF-SUPPORTED 0 and 32306 GLM D PROP-DEPENDENT 1 -> SELF-SUPPORTED 0,
  because the K-LB items their stored cures counted no longer exist (their first answers were SELF-SUPPORTED 0).
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

Tests (rerun after ruling 400): compile_out.txt (46 compile, part P included); unit8_out.txt (194, 0 bad: the 193, with the 32306 K-V fixture split into K6-alone 11 and R7 8);
unitR_out.txt (83, 0 bad, R1-R13 on 32306; the R3 fixtures replaced by one that checks the single judge is not printed (ruling 402); the R4 GLM fixture reruns GLM's stored cure on the items live cfcbb37b raised, since ruling 400 removes its K-LB premise 6); unitP_out.txt (74, 0 bad); transcript_32306_R.md (Format Markdown on the 32306 row with GLM's and the single judge's text re-cured); replay8_out.txt rerun: every
panel outcome unchanged in base/new/ruled; every seat's verdict and result unchanged; two seat standings move after ruling 400 (above); otherwise only TRIAL items move (K-LB on footing, K-S2, K-LXX, K-V).

## Part P (the test instruments of the judge posture protocol, prototypes/judge_posture/JUDGE_POSTURE_DRAFT_v4.md Part 7): patch_p.py
P1 (swap mode) is dropped by the operator ("sides are not swapped until the bugs are worked through"): no swap code is built; new/ and add/ carry
none (unitP checks it), and there is no swapped request body. P2, P3 and P4 are built.
Each instrument is a request flag on a dry regrade (Init Seats: posture, accept_probe; boolean; dry regrade only, current rulebook only, one at
a time, never with test_fail_* or qualify_alternate). Without a flag every body is byte-identical (unitP: Panel Build, Panel Payloads, Reserve
Build, Alternate Build, the three Panel Cure Builds, Alternate Cure Build, Replay Rows and Init Seats against fix set 8 without part P, ref_noP/,
or live). Results go to debate_replay_judgments only, through the existing record_replay_judgments; no schema change (its rulebook and
verdict_tag columns are CHECK-closed sets, so the mode is stored as a fenced "=== REPLAY RECORD ... ===" block after the judge's text).
Nodes changed: Panel Build, Panel Payloads, Alternate Payloads, Alternate Build, Alternate Cure Build, Panel Cure Build 1-3 (on top of fix set 8),
and Init Seats, Reserve Build, Replay Rows (live code copied to base/). Added (add/, add/nodes_P.json): Accept Gate?, Accept Build, Accept Call
openrouter, Accept Check, Accept Return?, Accept Return Build, Accept Return Call openrouter, Accept Final, Accept Probe?; the link Regrade After
Quotes? -> Panel Build becomes Regrade After Quotes? -> Accept Gate? (false -> Panel Build). A live (non-regrade) run never enters the subflow.
They must be added: the acceptance reply has to exist before Panel Build builds the judging call, and no existing node can make that call.
- P2 posture (lib/posture.js, lib/posture_check.js). The acceptance turn (v4 Part 2 word for word, then the reply form) goes alone, with no
  rulebook and no debate, to each panel seat, the reserve and the alternates (one call each, Accept Call openrouter). Code check: the six headings
  and the acceptance line verbatim (markdown marks allowed); the own-words line under each heading kept, not graded. A fault (heading or line
  omitted or altered) is returned once with the fault named; a refusal is recorded, not returned; a failed call is recorded. Statuses: ACCEPT,
  HEDGE (passes, but qualifies its acceptance outside the six lines), ACCEPT_ON_RETURN, HEDGE_ON_RETURN, FAULT_RECORDED, REFUSE, ERROR. Every seat
  sits. A seat that passed has its exchange (the return included) placed between the system rulebook and the transcript of its judging call, and
  of its reserve or alternate call; a seat that did not pass judges without it (nothing of its own to quote). The rulebook gains v4 Part 3's
  SILENCE and SAME TEST lines. Checks, TRIAL marks only (recorded in the row, never cured or counted): SILENCE absent; a SILENCE verse no premise
  carries under PRESSED WITH within the cap; a ledger NOT NAMED verse SILENCE omits; SAME TEST absent; an entry testing one link and not the other;
  a collision line resting on an own-words ground with no SAME TEST entry. The checkers' prompt text skips the acceptance exchange (same items
  with and without it, unitP). Cure quote-back: each item whose rule maps to a commitment (K-LXX 1; K-LB 2; K-C, K-S, K-S2 3; K-G1, K-G4, K-G6,
  K-G7, K-G10, K-G11, K-U 5; K-V 6) gets "You accepted: "<own words>". Your line: "<the line>"." appended to the cure prompt. Replay Rows stores
  each seat's acceptance record (status, faults, own words, replies) with its row.
- P3 accept_probe: the same subflow, then Accept Probe? ends the run at Replay Rows: three rows (the RPC takes exactly three distinct seats),
  verdict_tag and standings null, the text = the acceptance exchange; the reserve's and the alternates' records ride in each row's record.
- P4 negative control (unitP): ChatGPT's stored 32306 reply with a planted "D2 vs C1: UNDERDETERMINED. GROUND: the witnesses pressed against D2
  are the challenger's own chain read together (...), and no witness's own words state union before the taking." K-S2 flags it; in posture mode
  Panel Cure Build 3 quotes the seat's commitment 3 line beside it; a seat that refused gets none; without the flag the cure prompt is the live one.
- Tests: compile_out.txt (46: 42 changed, 4 added); unit8_out.txt (194, 0 bad) and unitR_out.txt (85, 0 bad) unchanged; unitP_out.txt (74, 0
  bad); replay8 rerun, output unchanged. Requests (test/requests_P/, no URL or secret): a_accept_probe_32306.json, c_posture_regrade_32306.json
  (each: topic, the saved seats, regrade_run_token ODV1-32306-ccyhzcuy, regrade_dry, rulebook current, the flag).
- Token estimate (32306 sizes, about 4 characters a token; reasoning tokens not included, they are not stored): panel prompt 136,660 characters
  (~34K tokens) per judge; posture 137-142K (head and form); acceptance prompt 2,897 (~0.7K). (a) probe: 5 calls ~4K in, ~2K out, +~1.5K in per
  return. (c) posture: acceptance ~4-6K in, ~2K out; 3 judging calls ~105K in, ~7-8K out; cures (fix set 8 finds items on all three 32306 seats;
  a cure call re-sends the judge's body, its answer and a 12-18K-character ask) ~3 x 40-43K = ~125K in, ~4K out; ~235K in, ~13K out in all,
  ~310K with one alternate and its cure. Prompt caching (session_id, Gemini cache_control) lowers the billed input of the cure calls.
- Needs the operator (part P): (1) v4 Part 1 says the acceptance turn "adds no call and stays in the prompt cache"; as built it is one short call
  per seat (two on a return), and since it carries Part 2 only (no rulebook) it shares no cached prefix with the judging call. Sending it after the
  system rulebook would share the prefix but show the judge the rulebook at acceptance: a ruling. (2) SILENCE and SAME TEST are TRIAL marks, not
  cure items (no cure rule exists for them). (3) Commitment 3's scoping of K-C and K-S2 to chain-against-chain collisions is still unbuilt; P4
  fires through the unscoped K-S2. (4) A seat that refuses or faults twice judges without the head; HEDGE is a phrase test on the reply outside
  the six lines; the probe includes the reserve (MiMo). (5) The probe's reserve and alternate records ride inside the three panel rows (the RPC
  takes exactly three); per-model rows would need a new RPC (not written). (6) v4 Part 7 test 1 (swapped sides) has no instrument while P1 is dropped.
