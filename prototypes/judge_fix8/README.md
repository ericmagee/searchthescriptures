# judge_fix8: ruling 392 in ORACLE_DEBATE_V1 (offline only; nothing written to n8n, the database or git)

- Base: ORACLE_DEBATE_V1 (moMxiV4Irg1uRBZN), live version cfcbb37b (confirmed by GET on 2026-11-03, updatedAt 2026-11-02 23:47:30Z;
  data/workflow_live.json; 67 code nodes in data/live_code/, each equal to judge_fix7/new or to judge_fix7's live read). base/ holds the live code
  of the 25 nodes changed; new/<node>.js is built by `python3 patch.py` from base/ and lib/ (kg10.js, kg10_cure.js, kg11.js, kg11_cure.js, kv.js,
  kv_cure.js), anchored, refusing on a wrong count.
- No node or connection is added or removed. write_package.py: one guarded PUT (versionId, base md5 of all 23 nodes, live connections and node
  count equal the base read). Run only with --dry: write_dry.txt (rebuilt after K5 and K6 against live cfcbb37b: guards passed; 25 nodes; 481
  connections, 262 nodes, unchanged).
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
