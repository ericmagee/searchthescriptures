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
