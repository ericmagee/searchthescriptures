# W3 labels: pkgKSR and pkgECB (W1, commit 62588cc0), on live s110, execution 34626 (dry regrade of 34108)

Committed before any run of the candidate code. Before this commit I did only: a size and node diff of the three write files
against the s110 fetch-back (+418, +462, +880; only the Shared Library differs; connections equal), a listing of the
execution order, and one failed run of my base-chain harness on the LIVE file (no candidate code ran).

FAIL rule: a silent drop, a missed true positive, or any finding I would want closed before a write.

## Harness
H0. The chain replay on the live s110 file reproduces the stored outputs of 34626 from Panel Cure Check to Replay Rows. If H0 cannot be met for a node, that node keeps its stored output and I say so.

## pkgKSR alone
K1. Panel Cure Check: terra (seat key chatgpt) and sol KEYSTONE read D6 BROKEN; luna's line as the judge wrote it (already BROKEN); RESULT, clause, tallies unchanged.
K2. End of chain (Replay Rows), with the stored send-back replies: state what KEYSTONE reads for each judge. EXPECTED RISK: the break lines are still sent back; the judges' CHANGE TO answers let the derived-keystone step write STANDS again. If the final row reads STANDS for any judge with KSR alone, KSR alone does not close fault 2 (not a FAIL of the pair if ALL closes it, but it must be stated and KSR must not be written without ECB).
K3. Plant: confirmed closing line on a non-keystone defender link: KEYSTONE untouched, output equal to live.
K4. Plant: confirmed closing line on the CHALLENGER side with the same link number as the keystone (C6): KEYSTONE untouched.
K5. Plant: KEYSTONE already "D6 -- BROKEN" or "D6 -- WITHDRAWN": untouched, no second trigger.
K6. Plant: formatted KEYSTONE line ("**KEYSTONE: D6 -- STANDS**", "- KEYSTONE: D6 — STANDS", "KEYSTONE: D6: STANDS"): state which forms are rewritten. A STANDS form that the live readers accept as STANDS and KSR does not rewrite is a FAIL.
K7. No confirmed line (cec empty): output equal to live.
K8. Judge names a keystone other than the broken link (KEYSTONE: D4 -- STANDS, link 6 broken): untouched.

## pkgECB alone
E1. Send Back Build: only items whose flagged line is the engine's closing-break line are removed; all others equal live apart from numbering; each removed item is listed in not_sent with a reason (not silent).
E2. Downstream: not_sent items are not counted UNCURED, not CURED, and do not change drv_uncured for luna (stays 2) or the count rule.
E3. luna's KEYSTONE at the end of chain: reads BROKEN (her own line kept). terra and sol: state what they read (expected STANDS, so ECB alone does not close fault 2 for them).
E4. EVASION PLANT (anti-cheat): a judge's own line, on a link with NO confirmed closing contradiction, carrying the words "BROKEN BY A CONFIRMED CLOSING CONTRADICTION", flagged by an enforcer (E-COL or E-HOLD DISAGREE). If ECB withholds it from send-back, FAIL: the judge can put the phrase on any line to escape send-back.
E5. EVASION PLANT 2: a judge's own KEYSTONE or RESULT line carrying the phrase, flagged. Same rule.
E6. Plant: flagged engine break line on a link that IS confirmed: withheld (the intended case), reason listed.
E7. Alt and R2 Alt Send Back Build: same code change, same behavior on a planted input.
E8. enforcer_log: if not_sent rows are written to the log, a rolled-back insert through record_enforcer_log accepts them.

## Both (parent_s110_ALL.json)
A1. Final rows: KEYSTONE D6 BROKEN for all three judges; no break-line item sent; RESULT BROKEN, CHALLENGER WINS; luna drv_uncured 2 and out of the count.
A2. Stored runs with no confirmed closing line: Panel Cure Check and Send Back Build outputs equal live (scan the saved executions I hold).

# REV 2b labels (W1 commit b3b1305b). Committed before any run of the rev 2b files by me. I have read W1's README rev 2 section and the patch texts.
- R1 Sizes by my own diff against the s110 fetch-back; only the Shared Library differs; connections equal.
- R2 ALL, whole chain to the written rows: KEYSTONE D6 BROKEN for luna, terra, sol; RESULT and tags unchanged; drv_uncured luna 2, terra 0, sol 0; no gate item against terra about its RULING card (my rev 1 finding); luna's two FORCED lines of link 6 not sent and no new gate item from them; every withheld item listed in sb_not_sent.
- R3 KSR alone and ECB alone: state the written rows. (W1 says they go together; a part that fails alone is not a FAIL of the pair, but it is stated.)
- R4 My rev 1 plants again: luna's own D2 vs C1 STANDS line carrying the eight words, and sol's own KEYSTONE STANDS line carrying them: both must be SENT under ECB and ALL.
- R5 Plants against the new withhold rules:
  a. a judge's own line "D2 vs C1 (...): STANDS -- [AUDIT: LINK 2 BROKEN BY A CONFIRMED CLOSING CONTRADICTION -- DEFENDER]" (link 2 not confirmed): SENT.
  b. the same line carrying the mark for LINK 6 (confirmed, but the line is a link 2 line): SENT.
  c. a judge's own "KEYSTONE: D4 -- BROKEN -- LINK 4 BROKEN BY A CONFIRMED CLOSING CONTRADICTION" (link 4 not confirmed): SENT.
  d. a judge's own KEYSTONE line that carries the exact engine line and then more words ("... CONTRADICTION, yet the defense stands"): SENT.
  e. luna's FORCED line of a pair NOT withheld (D4 vs C2) is unaffected: every FORCED or collision item of other links equals live.
- R6 KEYSTONE line forms (sol's stored STANDS line rewritten before Panel Cure Check): bold, bullet, em dash, colon, no separator. For each form that live code reads as a KEYSTONE STANDS line, ALL must end with BROKEN in the written row. A form live reads as STANDS and ALL leaves STANDS is a FAIL.
- R7 Confirmed list changed by plant: (a) the confirmed line moved to defender link 3 (not the keystone): KEYSTONE as the judge wrote it, and ALL's rows equal live's rows on the same plant; (b) moved to CHALLENGER link 6: same; (c) no confirmed line: same.
- R8 enforcer_log: rows the ALL chain produces that the live chain does not; if any, a rolled-back insert through record_enforcer_log accepts them.
- R9 Bloat: for each patch (K2 to K6, E1 to E3) say what fails without it, from the tests above or by reading; a patch with no shown need is named.

# REV 3 labels (W1 commit 9aa9c4f0, candidate pkgKSR/parent_s110_ALL.json = /mnt/project-files/wall2024/parent_s110_KSR_ECB_rev3.json). Committed before any run of the rev 3 file by me. I have read W1's README rev 3 section, the build patch list and W1's plant script text (not its outputs' conclusions).
- V1 Size by my own diff against the s110 fetch-back; only the Shared Library differs; connections equal. My own build from the patch files is byte-equal to the candidate.
- V2 Whole chain on execution 34626 to the written rows: KEYSTONE D6 BROKEN for luna, terra, sol; tags and RESULT as rev 2b; drv_uncured 2, 0, 0; no gate item against terra's RULING card; luna's FORCED lines of link 6 not sent and no new gate item from them (E3 is dropped: this is its check); every withheld item listed in sb_not_sent; rows differ from live only in verdict_raw.
- V3 KEYSTONE line forms on sol's stored line, planted before Panel Cure Check: "• ", "- ", "* ", bold, em dash, colon, no separator, two-space indent, "– " (en dash bullet), "1. " (numbered). For each form live reads as a KEYSTONE STANDS line (an E-KEY item is built for sol on live), the rev 3 written row must not read STANDS. A form live reads and rev 3 leaves STANDS is a FAIL.
- V4 My rev 2 withhold plants (a judge's own line carrying the mark or the eight words on a link not confirmed, or a line of another link, or the engine line followed by more words): all SENT. Confirmed list moved to defender link 3 / challenger link 6 / none: KEYSTONE as the judge wrote it.
- V5 The K2, K3, K5 need, by MY OWN plant, made upstream of Panel Cure Check so cureRecompute itself runs on it: a judge-written "D6 vs C<j> ...: DEFENDER LINK BROKEN" line (no engine mark) in each judge's stored judgment. First: does live cureRecompute leave that line unmarked (W1's premise)? Then ALL against ALL without K2, without K3, without K5: for each, state KEYSTONE, tag, drv_uncured, send-back and gate items. A guard whose removal changes nothing in this plant and in W1's P1 plant (run by me) is NOT SHOWN NEEDED.
- V6 Anti-cheat reading of that plant: a judge who changes its own DEFENDER LINK BROKEN line of the confirmed link in a send-back reply must still end BROKEN on that link (the operator's rule: the chain is broken by default).
- V7 enforcer_log rows the rev 3 chain produces that live does not: rolled-back insert through record_enforcer_log.
- V8 Stored executions with no confirmed closing line (34299): Panel Cure Check and Send Back Build outputs equal live.
- NOT REACHED expected: Alt and R2 Alt Send Back Build (no stored alternate send-back in 34626).
