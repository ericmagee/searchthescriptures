# Stored forgiveness counts for pkgGCCN (W1, 2026-11-10, offline)
Source A: debate_judgments verdict_raw, E-GATE audit lines "(E-APPLY Sn); ANSWER: ...; CURED: ..." (519 judgments; 342 replay judgments add 2 applied items).
Source B: debate_enforcer_log rule E-GATE, cure_status CURED, item "(E-APPLY Sn)" (164 rows; 57 CHANGE TO, 107 KEEP).
Every E-APPLY gate item comes from a send-back change the engine refused, so every cure counted here follows a refusal (form a).

Source A, 155 cured items in 46 judgments (+2 replay):
- KEEP (form c): 95 items. GCCN takes nothing off.
- CHANGE, "already in the corrected text" (form d): 17. GCCN takes nothing off.
- CHANGE, applied: 32 (29 NOT APPLIED, 2 RESULT DIFFERS, 1 CONTRADICTION). GCCN would take off if counted.
- CHANGE, a later gate change rewrote the line: 11; 10 of them end "and was applied" (2 judgments). GCCN's filter matches these 10.
- GCCN filter total: 42 items in 18 judgments. With a counted send-back attached: 1 (1062 gemini S8).

(b) run_b.cjs: the s110 Send Back Record readers (enf428Cure, pkgUND UND.cure), loaded from the library source, run on each of the 57 gate CHANGE lines in Source B with that debate's rounds (debate_results) and the KJV rows of every verse named (kjv_verses). Control: the same reader on the judge's original send-back answer.
- Control: E-COL 21 of 21 agree with the stored cure_status (1 more stored before pkgECF existed); E-HOLD (pkgUND) 4 of 4 agree.
- ENFORCED rules (counting): E-COL 22 gate lines: 21 pass, 1 fails (20367, a line a later gate change replaced; GCCN does not match it). E-HOLD on UNDERDETERMINED (pkgUND) 4: 4 pass. Of the 19 enforced-rule lines GCCN would match ("was applied"), 0 fail. 1062's S8 gate line passes pkgECF.
- Record-only reader (E-PREM, pkgEC2): 26 lines: 8 pass, 18 fail (17 for pkgPS, the whole CONCEDED LINKS line regrades premises beyond the item's own; 1 SPARED vs the enforcer's COUNTED). Limit: run with the item's own premise only, not the seat's set of E-PREM items on that line.
- No code reader in Send Back Record: E-RES 2, E-VOID 2, E-KEY 1.
