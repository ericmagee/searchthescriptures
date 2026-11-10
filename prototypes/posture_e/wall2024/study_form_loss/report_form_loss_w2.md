# Enforcer reply lines the live s108 record steps reject (W2, 11-10). Offline, no calls, nothing built for write.
Method: each live s108 record step (Shared Library sources rebuilt) run on every stored run in /mnt/project-files/wall2024/inputs/ with its stored inputs
(run_records.cjs); each answer the record leaves without a verdict, or a reply line it does not read, is listed with the reply line that names its id
(scan_enf_acx.cjs, scan_jer_nv.cjs, scan_jer_ids.cjs; outputs *_out.txt). Old runs whose node set predates a record step are skipped (named in the outputs).

## Counts
| Enforcer (record step) | stored runs read | answers | lost to form | lost, no answer line (call failed or skipped the id) |
|---|---|---|---|---|
| K-W enforcer (Enforcer Record) | 36 | 1,892 | 0 (1,760 ENFORCER lines, all read) | 128: 33482 call aborted (67), 33705 finish "length" (61) |
| Anti-cheat (Anticheat Record) | 37 | 3,769 | 4 lines, all CONSISTENT | 98 |
| Judge enforcer (Judge Enforcer Record) | 32 | 7,421 | 5 lines (33222, E-SYN) | 111: 33222 call 2 timed out (84), 33430 (25), 33218 (1), 33461 (1) |
| Alt judge enforcer (Alt Judge Enforcer Record) | 20 | 1,704 | 0 | 47 (33299) |
| Closing enforcer (Close Enforcer Record; W1's scan, 4156) | 100 lines | | 2 lines, bare "[3]"/"[4]" (34108 X sends) | |
| Judge Contradiction, Reread, Alt/R2 Alt Reread, Assume Check, Accept | 0 stored replies | | not measurable | |
Plus one designed rejection: anti-cheat 33218 X133 REVERSED recorded QUOTE NOT FOUND (the CLOSE quote is a heading with markup). Hand label FALSE
(the 33218 A131 class: the closing only names the dropped verse), so the rejection was right.

## Lost lines, hand labels
1. Closing enforcer, bare "[3]"/"[4]" (34108 X sends 1 and 2, link 6): TRUE (W3's reading, 4151). Fix built: pkgRLF rev 2, +20 code (Wall 4159).
2. Judge enforcer, E-SYN, 33222 (synthesis seat): the enforcer wrote the verdict as "TRUE" ("ENFORCER: Y3.1 -- TRUE -- ...") where the record
   wants AGREE / DISAGREE / NO ANSWER, so each answer went NO VERDICT. Under rule E-SYN, "TRUE" here means the side did give that up: AGREE.
   All quoted words stand in the debate (checked). Y3.1 TRUE (cr3 "I drop the claim that a row names Mary's house as David's" and the Heli [L4]
   inference); Y4.1 TRUE (cr3 Job 14:1 grant); Y6.1 TRUE (the Galatians 4:4 / Job 14:1 grant); Y1.1 DOUBTFUL (the flagged sentence is a heading,
   "Evaluating Challenger's claims, grants, and concessions:", nothing to agree with); Y2.1 DOUBTFUL ("logged all Defender grants" is not a
   give-up). 3 true, 2 doubtful. Effect: E-SYN rows are record-only (ruling 428 TRIAL), so no judge or count changed. 1 of 32 runs.
3. Anti-cheat, 4 CONSISTENT lines (33389 X34, X36, X73; 33617 X75): the EARLIER quote ends '".' (3 lines) or has no closing mark (X73), so the
   line pattern ('["”]\s*$') fails and the item is NO ANSWER. All 4 TRUE (close and earlier say the same thing). Effect now: none, since only
   REVERSED lines reach judges; but a REVERSED line written the same way would be lost.

## Smallest code-only fixes (sized, not built)
- Anti-cheat: let the line end '"' then an optional period: '["”]\.?\s*$'. Measured +3 characters in Anticheat Record (a plain node). Recovers 3 of 4.
- Judge enforcer E-SYN: accept TRUE / OVERSTATED in the verdict place and read them as AGREE / DISAGREE. ESTIMATE about +90 characters in the
  Shared Library (the line pattern appears twice there, plus a one-line mapping). 5 lines in 1 run, record-only rows.
- Closing enforcer: pkgRLF rev 2 (built, +20, grading).
Recommendation: pkgRLF rev 2 is the only fix that changes what a judge sees. The other two are record-only effects today; the anti-cheat +3 is
worth carrying with the next enforcer write because the same form on a REVERSED line would drop a shown mark.
