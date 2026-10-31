# BB-8634 S7: K-S2 and K-C flags per seat, last ten judged debates

Population: the ten most recent debate_results rows that have debate_judgments rows (created 2026-10-29 16:16 to 2026-10-30 21:55 CDT). Counted in debate_judgments.verdict_raw (panel seats), independent_verdict_raw (single judge, second opinion) and drv_removed[].verdict_raw (seats removed and replaced). Patterns: '(K-S2)' and 'VIOLATION (K-C)'.

| seat | judgments | K-S2 | K-C |
|---|---|---|---|
| deepseek | 8 | 6 | 8 |
| deepseek (removed) | 2 | 1 | 0 |
| gemini | 10 | 0 | 0 |
| glm | 6 | 13 | 9 |
| glm (removed) | 1 | 2 | 3 |
| grok | 5 | 5 | 6 |
| qwen | 1 | 0 | 0 |
| single judge (second opinion) | 10 | 9 | 7 |

Totals: K-S2 36, K-C 33. glm carries 15 of 36 K-S2 (42 percent) and 12 of 33 K-C; gemini carries none in 10 judgments. No single seat carries most of either flag.

Design note: K-S2 is marks-only by design (Panel Cure Build and its copies: "BB-8172 C2: marks only, never items, so nothing here reaches the cure, drv_uncured or a grade"; pair decision BB-8192, BB-8193: the cure route moves grades). The same block sits in 15 nodes.
