# THE DEBATE FIXED (BB-7397), step 3 verify (Worker_E) of Worker_A3's step 2 build (BB-7411, git bfe88cc)

Read 2026-10-21 20:01 to 20:05 CDT. Build tree taken by `git archive bfe88cc` into scratch.

## Checked and holding
- Base is live: n8n ODV1 moMxiV4Irg1uRBZN reads versionId = activeVersionId = 428fbdc3 (my own fetch, 20:01). All 22 base/ files equal the live jsCode byte for byte (0 mismatches).
- Function prior: live derive_debate_outcome(uuid) md5 347c8a9498aa1a5a0ef09f496e1be2fc, 18,337 chars (read 20:01:32); derive_prior.sql has the same md5.
- Falsifiers first: FALSIFIERS.txt committed at c6fe547 (00:51:28 UTC), 8 minutes before the build (bfe88cc, 00:59:46 UTC), and unchanged since then.
- Rebuild: `patch_fixed.py base` into my own directory gives files equal to new/ (22 of 22).
- F1a: the SQL diff is one SET line (`framework_verdict = CASE WHEN panel_verdict IS NULL THEN v_fv ELSE framework_verdict END`), the AMENDMENT comment, and two notes. Nothing else. The SET line reads the old row, so the column moves only at the first stamp.
- F1b/F1c rerun: new gives "Verdict of the debate: **HELD** (the panel)" and SECOND OPINION BROKEN. Base gives the unlabelled single-judge line. The mutant shows HELD as the second opinion, so it is caught.
- SECOND OPINION parse: all 70 stored ODV1 rows with text start with the single judge's tag. Read by eye: the first word equals the stored framework_verdict on every row except UNKNOWN or placeholder rows, which print "?".
- F2: the sentence in patch_fixed.py is identical to the BB-7348 proposal. It occurs twice in Init with Guards, once in BIV, once in Panel Build.
- Ordering: Get Row (read by Format Markdown) runs after Derive Outcome, so the report reads the stamped column.
- F3a rerun on 27665 gives these items:
  - Gemini: defender 1, 3 and challenger 1, 6.
  - GLM: defender 1, 3 and challenger 1.
  - Grok: none.
  - DeepSeek: defender 1, 3 and challenger 1.
  - The mutant gives none.
  - The drvLedger function is the same text in all three raise nodes.
- The single-judge miss A3 declared is right by the rule. Report line 821 reads "premises 1-6 were all answered" beside a ledger that marks premises 1 and 3 NOT NAMED.
- F3b: rerun gives the 7 cases as declared, 14 of 14 nodes. F5: rerun gives Gemini written PROP-DEPENDENT with an AUDIT line, and GLM untouched.

## Defects found (probes in this folder, output PROBES_OUT.txt)
1. **An honest judge is raised falsely and cannot cure** (probe_raise.cjs, probe_honest.cjs).
   - `counted` matches only "premise n ... CONCEDED|UNEXHIBITED", in that order. It does not match the word written first ("UNEXHIBITED: premise 1, premise 3"), and it does not match a joined list ("premises 1 and 3 UNEXHIBITED", which raises premise 3).
   - The false items then raise needN to the count plus the items, so the true reply (COUNT 2, PROP-DEPENDENT) is UNCURED ("2 is below 4"). Only a false double count could cure it.
   - The seat drops from the panel as K-G3 does.
2. **A negation hides the defect** (probe_raise.cjs). "premise 1 not conceded; premise 3 answered, not conceded" with count 0 raises nothing, because the regex is case-insensitive and finds "conceded" after the id.
3. **A rejected correction is written to the columns** (probe_write.cjs). cureSet writes a side's CORRECTED COUNT/STANDING when any one K-G item of that side is CURED. Premise 1 cured by statement and premise 3 UNCURED gives a written {n:0, st:COLLAPSED}, a pair the check refused and that cannot both be true.
4. **A note in derive_new.sql is false.** framework_verdict_semantic says "The flow inserts the single judge's tag". The new Build Save Body inserts null.

## Declared side effects to rule (not defects of the DoD)
- get_pending_debates_for_findings (`framework_verdict IN ('HELD','PARTIAL')`) and record_integrity_scan (`framework_verdict='HELD' AND defense_standing='COLLAPSED'`) read the column. After the publish they read the panel's word, and null until the stamp. The integrity scan then pairs the panel's verdict with the single judge's defense_standing on the debate row.

## Verdict
Step 3 NOT PASSED. Defects 1 to 3 are in DoD 3 and DoD 5. Every 27665 case passes, but defects 1 and 2 are wording a judge may use on the next run. Defect 1 can remove an honest judge. Defect 4 is one note line.
