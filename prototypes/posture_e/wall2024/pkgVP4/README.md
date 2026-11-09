# pkgVP4: the assumption charge check (P4 of the verdict proposal), TRIAL, record-only

Builder W2. Graders W1 and W3. Ruling row 459 (Wall 3729): P4 approved, one run as TRIAL, its test stated before the build.
Test: Wall 3738, as changed by W3's 3743 and accepted in 3747.

Base (rev 2): live s87 (VP1 and pkgOCB rev 2 written; `fetchback_live_s87.json`, 414 nodes); write file `parent_s87_VP4.json` (418 nodes). No library node changes, so a restack on VP3 (or any later base) is the same
command on the new base: `node pkgVP4/build_VP4.cjs <base json> <out json>` (each anchor asserted once).

## Rev 2 (W3 3772: FAIL, two fixes)
- Fix 1: log rows use only values debate_enforcer_log allows. seat_role is 'panel' ('single' for a single-judge item row), cure_status is left empty, and the reading (BOTH NOT STATED, READERS DIFFER, ITEM (TRIAL), NO ITEM (STATED), NO ITEM (INFERRED ACT), DEEPSEEK NO ANSWER / NO REPLY, NOT CHECKED) leads cure_reason as `<READING> -- <reason>`, the same pattern as pkgCEC rev 4. Probe 2o runs all 53 probe rows through the three checks; a rolled-back record_enforcer_log call with each row form (both seat roles) plus one ordinary panel row inserted 10 of 10 (`{"rows": 10, "recorded": true}`), then rolled back on purpose; 0 rows remain (w2_rollback_insert.sql holds the probe's rows).
- Fix 2: both code nodes are wrapped. A throw in Assume Check Build returns a skip that says why (probe 2p); a throw in Assume Check Record passes Judge Contradiction Record's item on with one NOT CHECKED row (2q). A record-only TRIAL never stops the debate.
- W3's note a: the judges' grades are read after the panel and before the cure, so a judge that changes its CONCEDED LINKS line at the cure is recorded with its first grade (now in the manual part).

## What it does (4 new nodes, 1 edited node)
Between Judge Contradiction Record and Panel Cure Needed?: Assume Check Build -> Assume Check Needed? -> (true) Assume Check Call deepseek -> Assume Check Record; (false) straight to the Record.
- **Build.** Reads every UNSUPPORTED-L4 premise that carries `ASSUMES:` (the list against the defender in [DR2]; the list against the challenger in [CR3], per PW_ROUND). Its answering block is the other side's round 3 `LINK n` block, up to the next LINK block or the premise list. One DeepSeek call per run (the fact and the verses are the same for every judge). The prompt quotes the judges' UNEXHIBITED-for-ASSUMES rule, the DG-61 sentence ("an inferred act ... is never an ASSUMES") and Commitment 3 ("one verse or many read together ... no count of verses decides it"). DeepSeek splits ASSUMES into facts and answers STATED (with verse words), NOT STATED or INFERRED ACT for each.
- **Record.** Two readers per fact:
  1. DeepSeek. A STATED answer counts only when its verse words are found in the block's quotations (else "STATED (verse words not found in the block)").
  2. Code. Every proper name of the fact must appear among the block's quoted verse words, all read together; else NOT STATED. A fact with no proper name gives NO NAMES (no item).
  - Each judge's grade of the premise is read from its CONCEDED LINKS / CHALLENGER CONCEDED LINKS line (an inlined copy of the library's psGrades, proven equal on 162 saved lines).
  - An **E-ASSUME item (TRIAL)** for each judge that SPARED the premise, only when both readers say NOT STATED.
  - Log rows (rule E-ASSUME, RECORD-ONLY TRIAL): one per fact with both readers' answers and every judge's grade, whether or not an item rises (W3's request), then one per judge item.
  - It passes Judge Contradiction Record's item on unchanged, adding `acx` and `acx_log`.
- **Alternate Merge**: `acx_log` joins the pkgCEC list, so the rows lead enforcer_log and reach debate_enforcer_log.
Nothing is sent back, no grade changes, no seat is removed.

## Proof
- probe_VP4.txt: 26 OK, 0 FAIL on run 34108 (DeepSeek replies written by hand; no call offline).
  - Six defender premises read; premise 6's two facts: "of the Holy Ghost" names the begetter of the flesh (code: POSSIBLY STATED, Holy and Ghost are quoted) and "Mary carries the house of David" (code: NOT STATED; "Mary" is in none of the block's quoted verse words: Romans 1:3, Luke 1:35 "born of thee", Luke 3:31, Luke 3:23, ...).
  - With DeepSeek NOT STATED on fact 2: three items, luna, terra (seat chatgpt) and sol, which all spared premise 6. The single judge's reply was unreadable, so its grade is not read and no item rises.
  - STATED with unquoted verse words, INFERRED ACT, readers differing, a failed call, a skipped build, bold and curly forms, a seat that COUNTED the premise, a planted ASSUMES against the challenger: each as stated.
  - Alternate Merge: byte-equal to base with no record; with it, the rows lead enforcer_log and the rest is unchanged.
- replay_AM.txt: Alternate Merge on all 37 saved runs, live s87 against VP4: 37 equal (29 of them the same offline error in both), 0 differ.
- Correction to the cost note in 3743: on 34108, code reads NOT STATED for "Mary carries the house of David", because "Mary" stands only in the defender's own [L4] words ("of Mary", "through Mary"), not in a quoted verse. So whether premise 6 rises in the trial run depends on DeepSeek's reading.

## Not tested offline
- What DeepSeek answers. The TRIAL run shows it; the call is about 20,000 characters on 34108.

## Write (W4, after two PASS grades)
Rebuild on the live base at write time with build_VP4.cjs (VP1 and VP3 first, in that order), then run n8n validation.
