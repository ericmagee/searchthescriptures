# ASK 635 PLAN (W4), rev 1 (replaces rev 0; W1 N1 to N3, Wall 11960): raise hydrogen's output-token limit so its reasoning leaves room for the verdict

Source: the operator, 04:41 CST 11-25, project chat (message cmsg_017ZQamDMHrS6fqMHnQDVo589SHYu1ca6GGbyLrQ8xVXBq, the same message that answered 630, 631 and 624): "let's increase hydrogen tokens." Run 42517 (ASK 629): hydrogen, as a panel judge, used 65,536 of 65,536 output tokens, 65,533 of them on reasoning. It finished with finish_reason "length" and returned no text.
Live base: model_config row seat 'hydrogen' (api_model google/gemini-4-hydrogen, max_tokens 65,536, active). Engine dc258730 (no engine change).
Reasoning: no reasoning setting is touched. Ruling 541 ("no reasoning setting") stands.

## 1. OBJECTIVE
Give hydrogen enough output room that, after its reasoning, it can still write the judgment.
- Change: the model_config hydrogen max_tokens goes from 65,536 to 131,072. This is twice the present value. It is the value qwen4max already carries, and it is within OpenRouter's limit of 943,718 for this model.
- Expected effect: when hydrogen judges, the reply ends "stop" with judgment text, and the run no longer fails for want of text from hydrogen.
- Not promised: the record cannot show that 131,072 is enough. hydrogen has filled every limit it was given as a judge (see section 5).

### Evidence (call_costs, ppj_replies, model_config notes)
- As a judge, hydrogen has hit its cap every time:
  - Check calls on 11-12 used 58,777 of 64,000 tokens on reasoning.
  - Run 42517 used 65,536 of 65,536 (reasoning 65,533). Its finish was "length" and its content was null.
- As a debater in run 42528, under the same row, it stayed under the limit. D1 used 27,754, D2 35,815, D3 64,084 and D4 41,663.
- Speed: in run 42517, hydrogen's 65,536 tokens took about 343 s, measured from Panel Judges Prep to its ppj_replies row at 22:18:48 CST. That is about 191 tokens a second.
- Price: from the 42517 and 42528 entries, solved from two calls. Output is about 7.5 dollars per million tokens and input about 1.5 dollars per million. The 42517 judge call cost 0.605 dollars.

## 2. ROLES
- Plans and writes: W4.
- Grades: W1 (one seat that is not the builder).
- Manual entry and AAR rows: W3.
- Approves: the operator, on W4's card. This is a model setting, so it needs his word.

## 3. SCOPE, SEARCH, NOT SEARCHED
Change: one value, model_config.max_tokens for seat 'hydrogen', from 65,536 to 131,072. A note line is added with the undo value. Nothing else changes: no engine or child node, no reasoning, temperature or model id, and no other seat.

SEARCH: how max_tokens reaches a hydrogen call.
- Engine Resolve Seats:
  - need() refuses a seat with no max_tokens.
  - judges, reserve0 and alternates take max(max_tokens, 4000).
  - Debaters take tok(fam, max_tokens), which passes the value unchanged for openrouter.
- Engine Panel Build:
  - It takes max(max_tokens, 8000).
  - For openrouter google/ models the body is {model, max_tokens: j.max_tokens, messages}.
  - No Math.min and no fixed cap was found on any max_tokens line in the engine or the child.
- Timeouts:
  - Every OpenRouter call node in the engine and the child has a timeout of at least 900,000 ms. One exception is Panel Judges Parallel, at 60,000 ms. It only sends the request to the webhook and returns at once (505 ms in 42517), so it does not limit the judge call (W1 N1).
  - WALL-2024 Panel Judge Call (Y1VIsNB6KBrs1znP) "Call openrouter" has a timeout of 900,000 ms.
  - The engine's Panel Judges Done? stops waiting at 980,000 ms after Panel Judges Prep.
- DB functions that read max_tokens:
  - dash_judge_lineup (only that it is above 0).
  - debate_judgments_write_guard and debate_results_write_guard (finish_reason length or max_tokens, which they flag).
  - None caps the value.

NOT SEARCHED: OpenRouter's per-provider limit for google/gemini-4-hydrogen. The model page gives 943,718 as the model's limit (read 11-24); the providers' endpoints were not re-read.

## 4. CRITERIA AND DONE
- C1. After the write, model_config hydrogen reads max_tokens 131,072, and every other column and row is unchanged (fetch back).
- C2. Offline, the live Resolve Seats and Panel Build run on the 42517 inputs with the new row. The hydrogen judge body then carries max_tokens 131,072 and nothing else in the body changes. Measured by replaying the two nodes from the engine text.
- C3. On a run where hydrogen judges, one of three results:
  - (a) Its reply ends "stop" with text and a stored judgment.
  - (b) The ASK 629 line "returned no text: finish_reason length; output tokens 131,072". This means 131,072 is not enough.
  - (c) A time-out: the call passes 900 s, or the wait passes 980 s, and the seat is treated as failed with a time-out error and not the 629 line (W1 N2). This means the limit is too high for the time allowed.
  Each result is a legitimate finding; (b) and (c) go back to the operator.
- DONE: the operator presses the card; the row is written and read back; W1 confirms the readback; two clean live runs in which hydrogen judges.

## 5. WRONG-IF
- The plan aims at the wrong thing if hydrogen's reasoning fills any limit it is given. On that reading, a larger limit buys a larger bill and still no verdict.
- The record so far fits that reading: hydrogen filled 64,000 and then 65,536 as a judge.
- No stored call can settle it. Only a call at the new limit can.
- The first live run in which hydrogen judges is the check. If the reply is "length" at 131,072, the right lever is the reasoning setting (Q1 of ASK 629) or hydrogen's place in the order (Q2). Both are the operator's alone.
- Time: at the measured 191 tokens a second, a full 131,072-token reply takes about 690 s. That is a guess from one call. The call timeout is 900 s and the wait limit is 980 s. A slower reply would time out, and the panel would treat it as a failed seat.

## 6. RUN EVIDENCE
- Case: the first live run in which hydrogen sits as a judge (panel, reserve or alternate).
- Mark:
  - ppj_replies (or the alternate's call_costs entry) for hydrogen shows finish "stop" and completion_tokens under 131,072, and a stored judgment for hydrogen.
  - Or, failing that, the ASK 629 "returned no text" line with output tokens 131,072, or a time-out error on hydrogen's slot (C3 (c)).
- Cost: the call_costs entry for hydrogen.
- NO PROBE before the write. A single paid replay of the 42517 hydrogen call at 131,072 (about 1.10 dollars at most) would answer the wrong-if before a run. It is offered on the card as an option and is not planned without the operator's word (live-not-trial rule).

## 7. INPUTS IN GIT
ask635/w4/plan635.md (this file). The figures above come from SQL (model_config, ppj_replies, debate_results.call_costs) and from engine dc258730 (ask629/w4/b2/base_eng.json, commit 8b9be4d7). C2's replay script goes in ask635/w4/b1/.

## 8. STEPS (each names its card)
1. W1 grades this plan (no card).
2. C2 offline replay (no card).
3. Card to the operator: "Raise hydrogen's output limit to 131,072?" (W4's card). Options: write it; write it after one paid replay of the 42517 hydrogen call; hold.
4. The write, in one call:
   `SET LOCAL truth.session_id=...; UPDATE model_config SET max_tokens=131072, notes=coalesce(notes,'')||E'\n<line with the press time, card, undo 65536>' WHERE seat='hydrogen' AND max_tokens=65536 RETURNING seat, max_tokens;`
   Then the fetch back, the audit_log row, a Wall post and W1's readback.
5. W3 drafts the manual and AAR rows (no card for the rows; the manual is on W3's card, if a part names the value).
6. Two clean live runs in which hydrogen judges.

UNDO: `UPDATE model_config SET max_tokens=65536 WHERE seat='hydrogen' AND max_tokens=131072;`
