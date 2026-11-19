# ASK 440 run validation, items 1 to 12 (W2)

Items from W3's status table (Wall 9464): 443, 444 A2, 445, 446, 447, 448, 449, 450, 451, 454, 455 (A to D), 456.
Items 13 to 24 are W1's (Wall 9480, a440_w1/validation_13_24.*); merged list in runval_merged.md.

## How to run after the run ends

1. Registry items (443, 444 A2, 454, 455, 455 D, 456):
   `node tools/exercise.cjs <run_token>` and run the printed SQL. Read the rows for asks `443`, `444 A2`, `422(c)` (= 454), `455`, `455 D`, `456`.
2. Wall items (446 to 451): replace `ODV1-XXXXX-xxxxxxxx` in `p440_w2/runval_1to12.sql` with the run token and run it.
3. Hand reads: 455 parts A and C, 456 (below).

Grades: EXERCISED (case present, mark fired), MISSED (case present, mark absent: report), NO CASE (the run held no input that reaches the change), CASE, READ BY HAND, HELD (guard: nothing landed that it should refuse), CANNOT (no run can show it).

## Items

| # | ASK | Proof in the run | Check | Pass | Run can exercise? |
|---|-----|------------------|-------|------|-------------------|
| 1 | 443 Library Check (pkgLIB2) | run reaches Accept Models with no pkgLIB2 stop | exercise.cjs row 443 | EXERCISED, fired 1 | Yes, every webhook run. A pkgLIB2 stop is MISSED and goes to the operator first. |
| 2 | 444 A2 Alternate Build comments | an alternate_reply row and no "pkgLIB:" stub error | exercise.cjs row `444 A2` | EXERCISED, fired = alternate_reply rows | Only if an alternate is seated; else NO CASE. |
| 3 | 445 one card for several writes | none; it is a write procedure | none | CANNOT | No. Already exercised by the 06:37Z "Write all four" card (W3 9464 item 6). |
| 4 | 446 run-start post quotes runstart GO and body sha | W4's run-start post in the 3 h before debate_results.created_at | runval_1to12.sql row 446 | EXERCISED, evidence = post id | Yes. |
| 5 | 447 shared tools in tools/ | the same post names tools/runstart.py | runval_1to12.sql row 447 | EXERCISED | Yes, by the run start only. |
| 6-9 | 448, 449, 450, 451 Wall guard | no landed root 2024 post from 3 h before to 12 h after the run fails wall_2024_check | runval_1to12.sql rows 448 to 451 | HELD, failing 0 | Partly. Refusals are not stored (no refusal table), so a run shows only that nothing bypassed the guard. The read-through rule is passed as true, so it is not checked. |
| 10 | 454 (= 422(c) KV_EXCL makes/excludes) | a K-V enforcer row with a "never makes/excludes ... exclusion ... quote" line, cured | exercise.cjs row `422(c)` | EXERCISED | Only if a judge writes that form; NO CASE is likely (39266: NO CASE). |
| 11 | 455 (b) E-ASSUME labels | E-ASSUME "assumption check" rows say ENFORCER, none DEEPSEEK | exercise.cjs row 455 | EXERCISED, fired = ENFORCER rows | Yes when Assume Check runs (39266: case true, MISSED, as expected before the change). |
| 11 | 455 (a) no deepseek row needed | Resolve Seats runs without the deepseek row | none | CANNOT | No. The `deepseek` model_config row is still ACTIVE (read 14:4xZ 11-19), so need() is never missed. |
| 11 | 455 (c) skip text "no ENFORCER model_config row" | the skip text in an enforcer record | hand: `select * from debate_enforcer_log where run_token=<tok> and cure_reason ~ 'model_config row'` | none or ENFORCER only | No in practice: it appears only when the luna row is missing. |
| 11 | 455 D openrouter step names | no error naming deepseek, a missing node, or Provider Removed; enforcer rows present as before | exercise.cjs row `455 D`; hand: enforcer row count by rule against 39266 | EXERCISED | Yes. |
| 12 | 456 stubs name every node they read | a BOTH NOT STATED fact a judge COUNTED (E-ASSUME row) | exercise.cjs row 456 gives the case; then by hand: that judge's Panel Payloads body (execution JSON, runData['Panel Payloads']) must hold no "[AUDIT v49" K-UNX line for that side and premise | CASE, READ BY HAND, then no such line | Only if such a fact occurs; Extract Independent Verdict and the child stubs have no mark. |

## Smoke test on run 39266 (before these changes, so MISSED is the expected control)

- exercise.cjs (subset): 422(c) NO CASE; 443 EXERCISED; 444 A2 EXERCISED; 455 MISSED (labels still DEEPSEEK then); 456 CASE, READ BY HAND; 455 D EXERCISED.
- runval_1to12.sql: 446 MISSED, 447 MISSED (both rules came after 39266); 448 to 451 failing 123, 5, 32, 8 of 592 posts (the guard went live 11-19; no landed post after 9227 (06:11Z 11-19) fails any of them).

## Fix made while building this

tools/exercise.cjs refused the whole registry ("write word in statement: Call") since entry 459, because entry titles 459, 460, 461 and 464 contain node names ending "Call". The write-word scan now ignores quoted literals. Shown: the six-entry subset output is byte-equal before and after; a planted `delete` outside a literal is still refused (exit 3). Needs a grader.
