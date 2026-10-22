# Step 9 regression test before the ask (Worker_E), THE DEBATE FIXED (BB-7397), per BB-7427 C (a)-(e)

Run independently from my own fetches and SELECTs. Nothing written to the flow or the database. Base: live 428fbdc3; the change: draft 207435d3 = new10 at d3f1fd9 (step 5, BB-7477); functions derive_new.sql 173f9465, scan_new.sql d9183661 at d3f1fd9.

## (a) The judge transcript against every sent rule sentence
- Run 27665 as stored, read whole against Text 1 and Text 2: BEFORE_27665_E.md (d5d111d6, BB-7445), merged list BB-7446. Unchanged.
- The sent texts after the change, Panel Build, Build Independent Verdict, Init with Guards (both debater frames) and Build Save Body, compared to 428fbdc3 at the character level: Panel Build, Build Independent Verdict and Init with Guards have insertions only (no rule text of 428fbdc3 removed or altered). Build Save Body has one replacement: framework_verdict:d.verdict_tag becomes framework_verdict:null (the flow inserts it null; W-D writes it, AMENDMENT THREE).
- The plain-language sentence (7348) occurs in Panel Build 1, Build Independent Verdict 1, Init with Guards 2 (both debater frames).
- The DoD 9 schema sentence and its MUST clause occur in Panel Build: "counted_premises_defender": array of integers -- the PRESSED-WITNESS LEDGER premise numbers (AGAINST THE DEFENDER) you counted in conceded_links; [] when none; the same for the challenger; "... each counted_premises array MUST list exactly the premises its count counts."
- The other 18 changed nodes (cure, alternate, payload, extract, format) carry the 2c audit code; verified at step 3 (BB-7464) and equal to new10 at step 5.

## (b) The debate row and every judgment row against DoD 1-7
- Stored row 921f5530 (27665): framework_verdict BROKEN, panel_verdict HELD (two verdicts; DoD 1 fails in the BEFORE as recorded). It is not regraded by the change (BB-7148): derive_new writes framework_verdict only at the first stamp (panel_verdict IS NULL).
- 13 stamped rows carry framework_verdict different from panel_verdict; all keep their values.
- Rows the new first-stamp write could still reach (panel_verdict null, panel expected, judgment rows present): 0 of 699. 637 rows hold no judgment rows and are fenced (FENCE 1) before any write.
- DoD 1-7 on a new row: UNEXERCISED until the live run (step 7).

## (c) The three functions against the July single-judge rows and the 10 flagged rows
- record_integrity_scan() live (prior, 7c32c765), 22:48 CDT: held_with_collapsed_defense 10; clean false (audit_log_future_dated_historical 150, dangling_blackboard_refs 4, admissible_set INFO).
- New check 4 by SELECT, cutover = now (FALSIFIERS4 S4): (i) judgments HELD with own COLLAPSED 0; (ii) results HELD/COLLAPSED created before cutover 10. Equal to the falsifier.
- scan_new.sql holds the token __CUTOVER__ by design; 6b writes the publish time in its place, read by tool at the act, and refuses the CREATE OR REPLACE while the token occurs (FALSIFIERS4). The file applied at 6b therefore differs from d9183661 by that one substitution.
- get_pending_debates_for_findings(1000): 76 rows; 921f5530 not among them (stored framework_verdict BROKEN; unchanged by design).
- derive_debate_outcome not called (it writes). Its change is the diff derive_prior -> derive_new: the AMENDMENT THREE comment, one SET line (framework_verdict at first stamp from v_fv), and two semantic strings.

## (d) Every flow node left equal to 428fbdc3
- 209 of 209 unchanged nodes equal 428fbdc3 whole; connections equal (step 5, cmp.py, CMP_OUT.txt).

## (e) The undo path exercised on a copy
- 28324f6f (restore of 428fbdc3 on the draft) equals 428fbdc3 on 231 of 231 nodes and connections; draft returned to f1c5b2df as 207435d3 (equal).
- Function undo: live md5 347c8a94 and 7c32c765 equal derive_prior.sql and scan_prior.sql; CREATE OR REPLACE from those files restores them. Not exercised as DDL (7472).

VERDICT: no regression found before the ask.
