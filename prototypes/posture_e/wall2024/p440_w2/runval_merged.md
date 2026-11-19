# ASK 440 run validation: the 24 live items (W2 1 to 12, W1 13 to 24)

Detail: p440_w2/runval_1to12.md (W2) and a440_w1/validation_13_24.md (W1). This page is the one list the AAR grades from.

## Steps after the run ends (all read only)

1. `node tools/exercise.cjs <token>`, run the SQL (rows 443, 444 A2, 422(c) for 454, 455, 455 D, 456).
2. p440_w2/runval_1to12.sql with the token (446, 447, 448 to 451).
3. a440_w1/validation_13_24.sql with the token (458 to 475).
4. n8n checks N1, N2; fetch the engine execution and run `python3 -I a440_w1/check_exec.py <file>` (N3: 468, 475).
5. Hand reads: 455 (c), 456, 470 when its mark is 0, Q474.

## The 24

| # | ASK | Check | Run can show it? |
|---|-----|-------|------------------|
| 1 | 443 Library Check | exercise 443 | Yes |
| 2 | 444 A2 | exercise 444 A2 | Only with an alternate seated |
| 3 | 445 one card, several writes | none | No (write procedure; exercised on the 06:37Z card) |
| 4 | 446 runstart GO quoted | runval 446 | Yes |
| 5 | 447 tools/ | runval 447 | Yes |
| 6 | 448 Wall guard | runval 448 | Partly (no refusal record; HELD only) |
| 7 | 449 Wall guard | runval 449 | Partly |
| 8 | 450 Wall guard | runval 450 | Partly |
| 9 | 451 Wall guard | runval 451 | Partly |
| 10 | 454 (422(c)) | exercise 422(c) | Only if a judge writes the form |
| 11 | 455 A to D | exercise 455, 455 D; hand (c) | (b), D yes; (a) no, deepseek row still ACTIVE; (c) no in practice |
| 12 | 456 | exercise 456 + hand read | Only with a COUNTED BOTH NOT STATED fact |
| 13 | 458 | W1 SQL 458 | Yes, absence mark |
| 14 | 459 | W1 SQL 459, N1 | Yes with a cure row, absence mark |
| 15 | 460 | W1 SQL 460 | Yes, absence mark |
| 16 | 461 | W1 SQL 461, 461b | Yes |
| 17 | 462 | none | No (Wall guard, exercised by grade posts) |
| 18 | 464 | W1 SQL 464, N2 | Yes, absence mark |
| 19 | 465 | none | No (op doc text) |
| 20 | 468 | N3 | Yes, positive mark |
| 21 | 470 (TRIAL) | W1 SQL 470, hand | Only with a judge-written BROKEN keystone |
| 22 | 472 | W1 SQL 472, 472b | Only with a SEND-BACK ITEM line |
| 23 | 474 | W1 SQL 474, Q474 | Only with a send-back on CONCEDED LINKS |
| 24 | 475 | W1 SQL 475, N3 | Yes |

Cannot be shown by any run: 445, 455 (a), 462, 465. Shown only in part: 448 to 451 (the guard is seen to have held, not to have refused), and every absence mark (458, 459, 460, 464, 475, 443, 455 D), which also reads clean on a run before the change (control 39266).
