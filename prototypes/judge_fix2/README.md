# judge_fix2: fixes to ORACLE_DEBATE_V1 from the run 32212 reviews (offline only; nothing written to n8n or the database)

- Base: ORACLE_DEBATE_V1 (moMxiV4Irg1uRBZN), version 52b05334, read by GET on the public API on 2026-11-02 (data/workflow_live.json; every
  code node in data/live_code/). base/<node>.js is the live code of the 24 nodes changed; checker_fix/new equals the live code (checked by md5).
- new/<node>.js is built by `python3 patch.py` from base/ (anchored replacements; it refuses if an anchor is not found the expected number of times).
- write_nodes.py (copied from checker_fix, names set to the 24 nodes) refuses unless the live code still equals base/. Run only with --dry:
  "DRY: base matched for 24 nodes; nothing written".
- The database was read with SELECT only; data/ holds those reads. sql/ and flow/ hold drafts that are NOT applied.

## Faults verified against the stored rows
- 1 UNEXHIBITED misapplied: verified (886, 887), then REMOVED by ruling 372: the prompt sentence "A premise whose pressed witness goes
  unanswered is UNEXHIBITED: it counts toward CONCEDED LINKS and the standings" and K-G6 stay; no new clause, no K-X (none left in new/).
- 2 Narrowing as concession: 885 DeepSeek counts "I drop any claim that ..." (premises 1, 3, 4; challenger 2, 3) as CONCEDED (stated).
- 3 "no RESTATED line for D5": 885's report; the restated "D5 vs C5" line itself is not stored (UNCURED items keep no statement), so the fixture
  is typed from the review's quotation and the stored judge statement.
- 4 Gemini's RESULT ("Scripture nowhere states") and CHALLENGER CHAIN MARK ("without a single biblical text stating") were unmarked: netLines read
  RESULT but had no "nowhere" pattern and no plural test for "Scripture"; CHAIN MARK lines were in NET_SKIP.
- 5 Alternate pool: Alternate Build builds every alternate call in one pass and adds the model to `used` before any call runs, so the second and
  third seats were refused "G3: ... already sits as the other alternate" (32157, 32212) though Qwen was later NOT SEATED.
- 6 Citation check: (a) Citation Scan read only the first 90 verse groups (`.slice(0,90)`); the link-round items, scanned last, fell past the cut and
  Quote Report calls a verse that was not read "CITED VERSE DOES NOT EXIST" (32205: 16 items, all past the cut; 32212: Isaiah 8:18).
  (b) lastBook took the last book named anywhere before a bare "(1:24)" in the round (Genesis 4:1 -> "Genesis 1:24"; Ezra 3:2 -> "Ezra 18:7-8").
- 7 CONTESTED is set in the database, not the flow: aggregate_debate_panel (`IF v_clean < 2 OR v_top = v_second THEN v_fv := 'CONTESTED'`),
  stamped into panel_verdict by derive_debate_outcome and mapped by d5_outcome_for to "UNGRADED — REVIEW". No code node sets it.

## What changed (nodes)
- FIX 2: Panel Build and Build Independent Verdict (both CONCEDED LINKS clauses each); Format Markdown's rule copy (a CONCEDED (stated) bullet,
  same words; "three rules" becomes "four"). Reserve Build and Alternate Build carry no rule text: they reuse Panel Build's prompt.
- R2 (ruling 373): an answer counts in any later round of the side that holds the link, the challenger's [DR1] included. Rule text and ledger
  text in Panel Build and Build Independent Verdict; the K-G1 SHORT and K-S cure text, the SHORT parser and the K-G1 answer search (14 cure
  nodes); DRV_ANS and DRV_BARE, which K-S and K-S2 read (17 nodes); the ledger code: a verse pressed in [CR1] and named in [DR1] is answered,
  and the "cited in" line counts [DR1] after the first citation. K-G4 already searched [DR1] (checker_fix). K-U names no rounds. D3 Build and
  C3 Build (the debaters' link-round ledgers) are not judge checks and are unchanged.
- R2 finding: the ledger readers (K-G6, the premise-to-link map, the counted-premise count, the K-C chain quote; 17 nodes) looked for
  "AGAINST THE DEFENDER, answered in [CR3]:", while Panel Build writes "answered in [CR2] or [CR3]:", so K-G6 has not fired since judgment 818
  (SQL: 5 K-G6 marks, ids 801-818). drvLabAt now finds either form; K-G6 will fire again.
- FIX 3: cureRest (14 nodes): a RESTATED "Dn vs Cm" serves a bare Dn item (and "Dm vs Cn" a bare Cn) when no line has the item's own label;
  "Cn vs Dm ..." is read as the Dm vs Cn line. Used by K-B, K-S, K-C and the new rules.
- FIX 4 K-C (17 nodes): "nowhere states/names/says", "without a single ... text stating", and (E7) "no exhibit/passage/text ... says/states";
  NET_PLURAL takes "Scripture", "nowhere", "a single text", "no passage/exhibit"; CHAIN MARK lines are read (a FOOTED mark sets nothing aside and
  is skipped; the mark's own side is used); NET_REPORT skips "conceding/concedes/admits/granting"; words in single quotes are masked like double
  quotes. NET_ANSWER and the other checker_fix masks are kept.
- FIX 5: Alternate Build drops the build-time "other alternate" G3; Alternate Merge seats one model once (panel order) and refuses a later passing
  call "G3: <model> already sits as the other alternate (seated for <seat>)". A tried and NOT SEATED alternate blocks nothing. Cost: up to one
  alternate call per removed seat. odv1_record_panel_alternates already refuses a model twice.
- FIX 6: Citation Scan reads one condition per book and chapter (verse.in.(...)), every chapter while the URL stays within 7,000 characters,
  and marks an item whose chapter was not read `unread`; Quote Compare reports it NOT CHECKED. A bare reference takes its book only from the same
  sentence and clause (sentence end, semicolon or line break; quoted words masked); with none it is left out, unchecked.
- FIX 7: sql/item7_panel_ungraded.sql (draft): UNGRADED when no seat is counted; d5_outcome_for maps UNGRADED to "UNGRADED — REVIEW". Readers:
  dash_odv1_debates, dash_odv1_by_id, dash_queue and Format Markdown pass panel_verdict through as text; none compares it with "CONTESTED". No
  dashboard front-end code is in this repository (index.html, api/chat.js do not read it). 10 stamped rows hold CONTESTED and keep it.
- ADDED SCOPE E1 K-N (17/14 nodes): a count item CONCEDED (stated) whose quotation is a narrowing and not a surrender. Cure: RESTATED count line.
- E2 K-SC: a "Dn: STANDS" line that itself says the defender's round conceded the link. Mapping a count line's premise to Dn was tried and
  dropped (a count line's "LINK n" is the pressing list's label; j734, j676 showed it is not always Dn). A concession that keeps the link
  narrowed is fix 2's narrowing and is not marked, so 885 D5 (the coordinator's example) is NOT marked: it needs the operator's ruling.
- E3: K-U already marks a STANDS line that names a witness unanswered (32212 ChatGPT D1, D3), as a mark without a cure. Not made a cure item:
  the 32212 review rates those two hits false in substance, and the 32157 review asks for a ruling first.
- E4 K-K: NOT WIRED (kkLines is in the code, unused). The prompt's KEYSTONE form reads "name the LAST declared link ... and give its state", so
  "KEYSTONE: D6 -- BROKEN -- Christ had no biological father" is the prescribed form; the population held 59 such lines. The form's wording is
  the operator's to change.
- E5 K-DG8 (17/14 nodes): a Dn, Dn vs Cm, KEYSTONE or RESULT line whose own clause reads Matthew 1:18/1:25 as excluding the union, or (STANDS
  only) routes the flesh through Mary. Reports of a side's reading, quoted words and hedged clauses are skipped. DG-8 read live (rule_num 8).
- E6 (Build Save Body): S-A "both agree" without words found in a defender round and a challenger round; S-B "every link answered" while a
  closing-list verse is never named by the answering side (a light copy of the ledger test); S-C an "uncharged" item whose own words stand in a
  closing list; S-D "guards bind both seats". Review lines in review_notes; no model call, no cure.
- W1 (14 cure nodes): CURE_KEY takes RESPONSE; CURE_FORM asks for "RESPONSE: <item> | <own words>" for every item; an item with no RESPONSE line
  is UNCURED "no written response". The audit-line excerpt is unchanged.
- W2: sql/w2_debate_enforcer_log.sql (table debate_enforcer_log and RPC record_enforcer_log; NOT APPLIED). enfRows (14 cure nodes) builds one row
  per item: seat, role, model, rule, item, flagged line, cure prompt (last user message), full reply, RESPONSE line, result, reason, time.
  Cure Check (single judge) and Panel Cure Check (panel, reserve) output enforcer_log; Alternate Merge adds each alternate's first reply and cure
  rows and the full first reply of a failed panel seat (Panel Check now keeps failed_raw beside sub, not inside it), and emits
  enforcer_log_body. Save path: a new HTTP node "Write Enforcer Log" between Write Judgment 3 and Derive Outcome (flow/write_enforcer_log_node.json,
  same credential and retry as Write Judgment 1-3); write_nodes.py does not add it.

## Tests (node; outputs in test/)
- compile_out.txt: 24 new files compile. unit_out.txt: 43 fixtures, 0 bad (R1 and R2 included) (every fixture runs on every node that carries the function).
- replay_out.txt: four runs, every seat and the single judge; BASE, NEW (W1 makes every stored reply fail: none has RESPONSE lines) and NEW+R
  (a RESPONSE line added per item). New marks are UNCURED there because no stored reply answered them.
- population_out.txt: 663 judge texts. New items: K-N 9, K-SC 0, K-DG8 34; K-C 274 -> 290 (8 removed, 24 added). Samples of up to 20
  read: K-N 8/9 (one premise quotation with "only"); K-DG8 18/20 (two hedged or reported);
  K-C added 18/20 true, 1 false (j834 single quote after a possessive), 1 unread to the end (j656). K-C removed: 6 confirmed reports or quotes;
  j656 D2 vs C2 probably a true mark lost ("grants"); j809 not resolved.
- cite_replay_out.txt: the base replay equals the stored citation_check for both runs. 32205: DOES NOT EXIST 16 -> 0 (15 now MATCH, Job 25:4 now
  WORDING DIFFERS); 32212: Isaiah 8:18 MATCHES, "Genesis 1:24" gone. Every true flag stays. Cost: 8 correctly booked bare references in other
  clauses are now left unchecked (32205 Matthew 1:3, 1:6, 1:19, 1:20, 1:21, 1:24, 1:25; 32212 Matthew 1:20).
- synth_out.txt: 32157 S-A x2 (one the documented false "both agree"), S-B, S-D; 32194 S-C x1 (unverified); 32205 S-A x1 (the item is
  substantively right but quotes neither side); 32212 S-C (enomizeto, documented).

## Not caught by a text check
- An answer in substance without the verse number (32212 Acts 1:8, Luke 1:5); a misread concession ("the challenger conceded the grammar",
  32205); an out-of-round concession that is an argument (32212 DeepSeek); DeepSeek's KEYSTONE accepting 1:18 as an answer to 1:25 (no
  exclusion words); "every pressed row answered" on a judge line needs the ledger at drvCheck (not built; Panel Payloads holds it).
