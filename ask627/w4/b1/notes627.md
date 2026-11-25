# ASK 627 BUILD (W4) on live engine 6b2cc236 / child 04704b68 (fetched 00:06Z 11-25, base_eng 462391d3, base_child c85297af)
Plan: ../plan627.md a5330f48. C3 read: ../c3/out_c3_c4.txt cf4b7cfe (Wall 11811).

## CHANGES (two nodes, nothing deleted)
1. Engine Panel Tokens: the list of priced calls (__CL) gains 13 entries at its end, with one ASK 627 tag:
   QR Answer D anthropic, QR Answer C anthropic, QR Answer C openrouter, QR Follow Ask, QR Follow D anthropic, QR Follow D openrouter, QR Follow C anthropic, QR Follow C openrouter,
   Enforcer Resend Call openrouter, Judge Enforcer Resend Call openrouter, Alt Judge Enforcer Resend Call openrouter, Close Group Retry Call openrouter, and __A379('R2 Alt Judge Enforcer Resend Call openrouter').
2. Child Alternate Pass Out: its carried-back list (NM and A) gains R2 Alt Judge Enforcer Resend Call openrouter, with one ASK 627 tag.
NOT ADDED: Close Group Batch Call and Enforcer Group Batch Call. C3 showed every one of their replies is already counted, by the same id, in Close Enforcer, Assume Check, Enforcer and Judge Enforcer Call. Adding them would change nothing (scope rule).
No price, prompt, reasoning or model setting changes. record_debate_row_tokens unchanged.

## TESTS
t627.cjs 946d7831 -> out_t627.txt e49a7ff6: ALL PASS (34 checks; corrected 19:04 CST 11-24 from "35": the file holds 34 PASS lines, W1 Wall 11845).
- C1 coverage: all 72 engine model-API nodes priced or out with the C3 reason; all 8 child nodes carried back and priced.
- C2 shapes: each added node, each reply shape (anthropic; openrouter cost; openrouter BYOK): one entry, right family and fields; the live code gives 0. Not run gives nothing. One id in two nodes counts once.
- C4 run 42373: the 9 QR replies read at 00:08Z (c4/qr42373.json e8548031, usage only): live code prices 0 of 9, new code 9 of 9:
  QR Answer D anthropic 0.6601, QR Answer C anthropic 0.2225, QR Follow Ask 0.4490; missing 1.3316; true cost 11.4533 against stored 10.1217.
  (Anthropic priced at model_prices list rates read 00:09Z: opus 4/20, sonnet 2/10 per million; openrouter by billed figure.)
- C5: only the two nodes change; connections unchanged; both compile; standing 31 PASS 0 FAIL (out_standing_627.txt); pair Library Check PASSES (out_pair_627.txt).
Targets: target_engine_627.json 86716be4, target_child_627.json 5747ea34. Build b627.cjs cc1822ad. Write ../write/write627.sh 4355e7a5 (refuses on a live run, a moved base node, or any failed check; revert files made at write).

## RUN EVIDENCE
First live run in which the question round runs: call_costs holds the QR entries and run_cost_usd equals the sum of the entries. Two live runs.
CORRECTED 00:15Z (W1 N1): base and target hash labels were swapped; the values above are now right (sha256 prefixes).
