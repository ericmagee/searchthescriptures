# Readiness checklist v2 for the next validation run (W2, on the coordinator's order 06:36Z 11-19)
Base: W4 9173 with 9176 and 9179, corrected by W2 9181 B, plus every package written since (W4 9242, 9248).
Live: engine c1256eec (06:38:29Z), child cd11b411 (06:38:34Z), library cad3b4f8239c2504 on both.
The machine form of each check is the ASK 441 registry (a417_w2/registry.json, 34 entries); this file says where a human reads what the registry cannot.
A run starts only on the operator's own word. An item the run does not reach is UNEXERCISED, not passed.

1. ASK 426, luna is the ENFORCER MODEL.
   Where: debate_enforcer_log.judge_model. Match the api id "openai/gpt-6-luna" (model_config seat luna), not "luna".
   Rows with judge_model null (the close enforcer, the assumption check, and 2 to 3 panel rows a run; 39015 had 3, 38593 had 2) do not show the model:
   read it from the n8n execution, or report those rows NOT SHOWN. Wrong if any enforcer call errors on the model or is skipped.
2. ASK 428, comments stripped (and ASK 444 A2, Alternate Build and Early Alternate Build).
   Where: the n8n execution ends with no Code node syntax or reference error; registry 428 and 444 A2. The two Alternate nodes are reached only when an alternate is seated.
3. ASK 429, the enforcer sees judges as "Judge k".
   Where: debate_enforcer_log.prompt_sent. It is stored only on the first row of each batch (Enforcer Record k===0; 39015: 14 of 127 panel rows).
   Check every stored prompt_sent (that covers every batch); do not expect one on each row. No seat name in any of them.
4. ASK 437, seats.
   Where: panel and single judge in debate_judgments.judge_seat and debate_results.judge_model; alternates in debate_enforcer_log seat_role 'alternate' and debate_results.panel_substitution.
   The qualify_alternate refusal is not reached by a normal run: UNEXERCISED unless a dry request is sent, and that needs the operator's word.
5. ASK 430, 436, 438 and 431, the L2 gloss check.
   Where: no table row holds the full gloss list. review_notes holds only the AUDIT v57 summary (counts, and the first 12 NOT IN THE KJV RENDERINGS rows).
   So "-d/-ed is FOUND", "ordered by count", "and N more", "at most 250 gloss and 100 number items" are read from the n8n execution, L2 Count Plan output.
   ASK 431 (word (Gnnnn), meaning "gloss"): judge prompts are not stored; read Quote Report's l2.gloss in the execution. Registry 431 finds the case in the round texts.
6. ASK 435, bare verse numbers.
   Where: the execution's Citation Scan output, and debate_results.citation_check for the bound reference (registry 435).
   "c:v,n" and "c:v, n" and "c:v, and n" and "c:v;n" read verse n of the same chapter; "c:v; n" is not read. No verse dropped or doubled.
7. ASK 434, the SUPERSEDED head names its step.
   Where: debate_judgments.verdict_raw and debate_results.independent_verdict_raw: "SUPERSEDED BY CURE|SEND-BACK|RECOMPUTE". Registry 434.
8. ASK 439, the AUDIT v57 clause.
   Where: review_notes reads "left out by the 250-gloss and 100-number caps)". Printed on every run with the ASK 340 block. Registry 439.
9. ASK 443, Library Check.
   Where: no "pkgLIB2" stop in debate_errors or the execution. Registry 443.
10. ASK 455 parts A to C, ENFORCER labels; no DeepSeek row needed.
   Where: debate_enforcer_log rows rule E-ASSUME, seat 'assumption check': cure_status/cure_reason read ENFORCER, none DEEPSEEK. Registry 455.
   Part A (Resolve Seats no longer needs the deepseek row) has no mark while that row is active.
11. ASK 456, stubs name every node they read.
   Where: by hand. For a BOTH NOT STATED fact that a judge COUNTED, that judge's Panel Payloads body (in the execution) must not carry the AUDIT v49 K-UNX line
   for that side and premise (as in replay 38593, a8456_w2). Also: no stub throws "rebuilt source is N bytes". Extract Independent Verdict and the child stubs: no stored case.
12. ASK 448 to 451, the Wall guard: not engine; no run check. Shown by every Wall post since 9242.
13. PENDING, not live: ASK 455 part D (22 enforcer steps renamed to "openrouter", W2 9251). If written before the run: the enforcer steps run under the new names,
   no "Node ... hasn't been executed" or missing-node error, and Assume Check Record, Judge Enforcer Record and Close Enforcer Record hold their rows.
14. Run 39266 (started 21:24Z 11-18, success, run token ODV1-39266-7g9lzgbr) is the last stored run, after 39015; it predates all of tonight's writes.
