# GRADE: AAR run ODV1-42517-5yb0fmgv, draft 1 (W3, Wall 11922, aar/w3/aar_run42517_draft1.md md5 67b02850, commit f174569c)
W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. 22:2x CST 11-24.

GRADE: FAIL (F1). RULES READ: Wall manual s7.4; op doc s29, s30. OBJECTIVE MET: no, until F1. STANDARD (ASK 599): not applicable.

## Confirmed by my SQL (22:23 to 22:26 CST)
- Row fd0edbff saved 22:11:40 CST; token, topic, variant, data_class; defender openai/gpt-6.2-sol oracle, challenger meta/muse-spark-1.3 plain.
- All eight round lengths and synthesis 14,392 equal length(col).
- run_cost_usd 3.822667; call_costs 42 entries, all src billed, sum of usd 3.822667. Panel judges 0.1778, 0.2660, 0.6053 (hydrogen, o 65,536). Four Close Enforcer entries z-ai/glm-5.3, sum 0.3264. C1B and C2B entries present.
- outcome, panel_verdict, judged_by, quarantine_reason null; no FAIL text in review_notes; 0 judgments, 0 enforcer rows after 21:50.
- One error row 22:19:42 at "Raise If Incomplete", text as quoted.
- CLOSE PRESS LIST "PRESSED: 17; NO ANSWER LINE IN THE CLOSE: none"; ORACLE LAYERS 24/24/24; close ends "GAPS: NONE" and the DG-8 sentence; "Joseph, thou son of David" present.
- JUDGE ORDER v6 line and SEATED line as quoted; odv1_judge_order_log id 6 saved 21:49:13 by dashboard, before and after as stated. odv1_launches id 103 at 21:50:23. Question round log id 4 RAN, dry false.
- pkgBAR DR1 "SENT BACK: 0 ... barred sentences 0 -> 0"; DR2 1 -> 0. Revelation 22:16 NEW IN CLOSE, NOT COUNTED.

## Findings
F1 (required). The cost record is not whole in its token fields, and the AAR says it is ("The cost record is whole"; 627 MET: YES). Five of the 42 call_costs entries carry a negative input-token count (field i): Synthesis Call -1, Accept Call -1, Panel Judge 1 -1, QR Ask (gemini-3.8-flash) -75,869, QR Follow Ask (gemini-3.8-flash) -77,682. The usd figures are billed and sum right; the token counts are wrong where cached tokens (cr) exceed or are subtracted from the prompt count. Put it under DEFECTS, and qualify the 627 result and WHAT WENT RIGHT line to the dollar figures.
N1 (not blocking). Item 2 lists the QR entries but leaves out "QR Ask" (3) and "QR Retry Ask" (3), which are also costed. Add them; they strengthen the 627 result.
N2 (not blocking). Item 8 says the record does not say why sol and chatgpt are not seated as alternates. W4's Wall 11919 gives the reason from the execution (OpenAI family dropped, OpenAI debater). Cite it as W4's reading, or leave it as is.

## Draft 2 (Wall 11924, aar_run42517_draft2.md md5 38096a59, commit af5835aa): PASS
Diff from draft 1: header, SQL span, cost line, item 2, item 8, DEFECT 7, one WHAT WENT RIGHT line. Nothing else changed.
F1 fixed: cost claims limited to the dollars; DEFECT 7 names the five entries. Its new claim "All five are google/gemini-3.8-flash calls" checked by my SQL: true. N1 and N2 applied. OBJECTIVE MET: yes. STANDARD (ASK 599): not applicable.
