# ASK 327 / 328 grading baseline, REV 2 (W1, session_01H1X3ANxr57MZvsu7fHB9kh)

Run 37372 (n8n execution 37372, run token ODV1-37372-6n5n7sh9, debate 6c62698b-58d1-4f5f-9d8e-cd57f096e96c).
Ran on s211. Read 2026-11-15 from the stored execution and the live s218 code. Everything here is MEASURED unless it is marked GUESS.

## A. What is stored today

debate_results row:
- panel_split "2-0 (1 not counted: debate rule)"
- drv_removed NULL
- panel_substitution NULL
- panel_expected and judged_by both [chatgpt, luna, sol]
- panel_verdict BROKEN

Alternate Merge output (the final one, read from the execution record):
- drv_removed [] and alternates_seated []
- panel_effective [chatgpt, luna, sol]: sol is still listed even though it was not counted.
- alternates_tried holds 2 rows, both sol to hydrogen, NOT SEATED:
  - "returned content null (finish_reason length)"
  - "returned no JSON object ... (finish_rea" (the text is cut there)
- alternate_round2 = {seats:[sol], result:[{seat:sol, seated:null, lines:1}]}

Record Alternates output: {ok:true, written:false}.

Sol's verdict_raw holds 2 lines of the form `[AUDIT v21: ALTERNATE TRIED -- SEAT: sol; ALTERNATE: hydrogen; ... RESULT: NOT SEATED; WHY: ...; REMOVED FOR: drv_uncured 2: K-C (cure) x1; E-GATE CONTRADICTION x1]`.
So the removal rules ARE already in the record, inside sol's verdict_raw. They do not reach drv_removed or panel_split.

The enforcer log has 2 alternate_reply rows, 41081 and 41100 (item "replaces sol"). They hold no usage figures.

## B. Why drv_removed is empty (MEASURED in code, live s218 Shared Library)

There is only one `removed.push(` site. It runs only after the checks that pass the alternate ("ok" with drv_uncured 0, then "no duplicate model"). Every failure path does `tried.push(...NOT SEATED...); return;` before it reaches the push.
So a removal enters drv_removed only when an alternate sits. This settles W4's GUESS at 6864 item 1.

The panel_split text is built in the database by function aggregate_debate_panel:
`IF v_drv > 0 THEN v_split := v_split || ' (' || v_drv || ' not counted: debate rule)'`.
So ASK 327 item 2 touches that function as well as Format Markdown.

## C. Readers that must be checked (WRONG-IF)

REVISION 1 (Wall 6877, after W4 6875):
- The views odv1_drv_removals and debate_removals also read drv_removed. My first list missed them because it searched functions only.
- The recorder odv1_record_panel_alternates RAISES when the length of p_drv_removed differs from the length of p_alternates. On a write it also rewrites panel_expected.
- debate_removals already lists sol for 37372 as kind not_counted, with drv_uncured 2, replaced_by null and removed_rules null.


drv_removed is read by:
- Format Markdown: the SEATS order; DRV through drvRead "Panel judge (removed)"; DRM and the Alternate judges section.
- Alternate Merge.
- the Shared Library: Alternate Merge Seat and the R2 merge.
- Record Alternates, which passes it to rpc odv1_record_panel_alternates.

The risk: Format Markdown treats every drv_removed entry as a removed judge with a verdict_raw, and reads its CURED rows into COR. An entry for a removed seat that had no replacement must not:
- double-print sol's rows, which already print as "Panel judge sol";
- change any count.

reply_error is read by the Shared Library (33 sites), 8 Record nodes, and database function record_enforcer_log.

## D. ASK 327 criteria, REV 2 (per W4 6879 and W1 6883)

This is a view-only change to debate_removals. There is no table write, no n8n change, no change to drv_removed, and no change to the recorder. panel_split is left as is (option a). removed_rules is read at view time.

1. Run 37372, sol's not_counted row:
   - removed_rules = ["K-C (cure) x1","E-GATE CONTRADICTION x1"]. It is a jsonb array split on "; ", the same shape the replaced path uses. It appears ONCE, even though sol's text holds two identical REMOVED FOR lines.
   - The new last column alternates_tried has 2 entries. Each is {seat sol, alternate hydrogen, model google/gemini-4-hydrogen, result NOT SEATED, why}. The why texts are the two reasons: content null with finish_reason length, and no JSON object.
2. Every other row is identical in all old columns, and the row count is identical. That covers every replaced row, including the 41 with removed_rules NULL. Those stay NULL, with no back-fill from text.
3. A not_counted row with no REMOVED FOR or ALTERNATE TRIED text gets NULL in both fields, never a guess.
4. Plants and variants. Ten judgment rows carry REMOVED FOR. Two forms must each give a stated, consistent result:
   - "drv_uncured 2: K-W (cure) x1 (read 1, count differs)": the builder states whether the suffix is kept or stripped.
   - "drv_uncured 26: K-S3 (cure) x6; K-W (cure) x20": gives 2 elements.
   The 38 judgment rows with "ALTERNATE: none" must parse without error.
5. Readers: none. No function, view or n8n node reads debate_removals or odv1_drv_removals (checked at 6883). The new column goes at the end.

## E. ASK 328 criteria (USAGE line on a failed alternate)

Measured figures available in the execution record for 37372:

| | call 1 (Get Early Alternate reply) | call 2 (R2 Alternate Call) |
|---|---|---|
| prompt tokens | 104,006 | 104,006 (101,957 cached) |
| completion tokens | 64,000 | 64,000 |
| reasoning tokens | 63,997 | 56,380 |
| finish_reason | length | length (native MAX_TOKENS) |
| content | null | 28,455 characters, cut off |

The request limit is alt.max_tokens = 64000, which is the same as alt.body.max_tokens.

Expected after the build: rows 41081 and 41100 (and Alternate Merge's alternates_tried why) end with:
- `USAGE: prompt=104006 completion=64000 reasoning=63997 finish=length max_tokens=64000`
- `USAGE: prompt=104006 completion=64000 reasoning=56380 finish=length max_tokens=64000`

Any field the provider does not give reads "not reported".

Further checks:
1. The request body is unchanged byte for byte. No max_tokens, reasoning or temperature value is added or changed. This is checked against Eric's 09:03Z rule.
2. Successful alternate rows are unchanged.
3. No reader parses reply_error in a way that the added line changes a status or a count. Check the 33 Shared Library sites, the 8 Record nodes and record_enforcer_log.
4. The "REMOVED FOR" audit line and the why text in alternates_tried still parse in Format Markdown's TRIED regex. The why text is the 5th capture group, `(?:; WHY: (.*))?\]$`, so an added "; USAGE:" must not break the closing "]".
