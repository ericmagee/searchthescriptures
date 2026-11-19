# Run ODV1-40891-umeouul3 (494 A2 proving run, released 19:22:48Z 11-19): which snapshot rows it can update (W3)

Pairing: spark (oracle) vs gemini (plain); panel expected chatgpt, sol, sol62 (W4 9944). Each new row is a new insert with prior_row set to the row it updates; rows are never edited. Fill only from posted, checked evidence.

| Row | ASK | What this run can show | Evidence to read |
|---|---|---|---|
| 16 | 494 A1 | Engine saves run as service_role, and the row saves (P1 to P5) | W4's result post; two non-writer checks; edge logs role on record_debate_row, record_debate_judgment, derive_debate_outcome, record_debate_row_tokens |
| 15 | 492 | "without breaking any live writer": the engine save succeeds after the direct-insert close | debate_results row for the run token exists |
| 3 | 484 | sol62 answers with no Azure cut | the sol62 call's provider in call_costs (not Azure); no content-filter error (W1 N2) |
| 8 | 487 | the gemini debater runs google/gemini-4-hydrogen | the run row's gemini model |
| 13 | 490 | the transcript names models, never "ChatGPT" or a bare seat key | the run's Drive transcript names (operator's view, or a seat that can read Drive) |
| 7 | 486 | only if a reserve or alternate is drawn: haiku is last | Init Seats output for the run |
| 4 | 485 | only if a reserve is seated: send-back sent, E-GATE rows | send_back and E-GATE rows for the reserve |
| 11 | 488 | only if the counted seats' RESULT words agree while tags split | derive_debate_outcome output and the judgments |
| 14 | 491 | not shown by a webhook run (no queue claim) | none |

Template for row 16: aar_494a1_run_template.sql in this folder.
