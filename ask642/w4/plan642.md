# ASK 642 PLAN (W4), rev 0: an alternate that spent its whole output limit is not offered again in round 2

Source: W4 Wall 12012 (cause and fix), corrected by Wall 12014 (the reason was not yet read); the coordinator's assignment, 06:26 CST 11-25.
Live base: engine ee4e389d (after ASK 637). Child aad0ad9c (not touched). Nothing here touches reasoning, a model setting, a token limit, a prompt, or what a seat is sent. The other fix, retrying with a higher limit, is a token limit and is Eric's alone; it is not planned here.

## 1. OBJECTIVE
In run 42528 sonnet was called as an alternate in round 1 ("Alternate Call openrouter", $1.0786) and again in round 2 ("R2 Alternate Call openrouter", $1.0795): $2.16 with no judgment.
- The round-1 reason is now read (debate_enforcer_log 54606, reply_error): 'seat "sonnet" returned content null (finish_reason length). NO ROW IS WRITTEN. ...', with the usage line "completion=64000 reasoning=64000 finish=length max_tokens=64000". The whole limit went to reasoning.
- Second Alternate? puts a round-1 model back on the round-2 list (a2r.retry) when its reason matches "returned content null | returned no JSON object | JSON did not parse". The rule is for a bad reply that may not recur. It does not read the finish reason, so an output-limit failure is retried like a parse slip. With the same limit and the same packet it fails again; round 2 failed with finish length too (54719).
Change: a model whose round-1 reason names "(finish_reason length)" or "(finish_reason max_tokens)" is not put on a2r.retry. It stays in a2r.tried and is not offered again. Every other retry case is unchanged.

## 2. ROLES
- Plans and builds: W4.
- Grades: W1.
- Writes: W4, on W4's card to the operator (engine).
- Reads back: W1. Manual entry and AAR rows: W3.

## 3. SCOPE, SEARCH, NOT SEARCHED
Change: Second Alternate? only. The a2r.retry filter gains `&&!/\(finish_reason (?:length|max_tokens)\)/.test(x.why)`. Tagged ASK 642.
Not changed: the alternate reply reader (LIB 2405, 2409), the tried list, the free list, the cap, the why texts, every other node.

SEARCH:
- tried[].why is r.why (LIB 1598). The enforcer row's reply_error is the same r.why with the usage line added (LIB 1633). So 54606's text is the why the filter reads.
- The reasons carry "(finish_reason <x>)" from two places: LIB 2405 (content null) and LIB 2409 (a verdict that does not parse). On the OpenRouter route an output-limit stop is "length". "max_tokens" is the Anthropic stop_reason, matched in case a reply reaches the reader in that form.
- Readers of Second Alternate?: the Shared Library, Alternate Merge and Pass Accumulate read a2r. A model taken off retry stays in a2r.tried, which the free list already excludes. So round 2 offers the next free pool seat, or records "no pool model is left after round 1".

NOT SEARCHED:
- How often this has happened before 42528. The build counts it over debate_enforcer_log: alternate_reply rows whose reply_error holds "finish_reason length", followed by an R2 call of the same model in the same run.

## 4. CRITERIA AND DONE
- C1. Replay Second Alternate? (old and new) on a round-1 record built from 42528: sonnet NOT SEATED with the 54606 why, chatgpt tried and later unseated, and the 42528 Resolve Seats alternates. Old: retry holds sonnet's model. New: retry is empty, tried holds sonnet's model, and sonnet is not in free.
- C2. Synthetic cases:
  - "returned no JSON object ... (finish_reason stop)" stays on retry under both;
  - "returned content null (finish_reason none)" stays;
  - "JSON did not parse (finish_reason max_tokens)" leaves retry under the new code only;
  - a model tried twice (already not retried) is unchanged.
  On every case all other a2r fields are equal, except why where the free list changes.
- C3. Engine: only Second Alternate? changes; every other node is byte-equal to ee4e389d; connections equal; standing 31/0; S4 compile; pair check PASSES.
- C4. ASK 599: tagged; no dead code; no new catch.
- DONE: W1 PASS on plan and build; operator presses W4's card; W4 writes; W1 reads back; two clean live runs (section 6).

## 5. WRONG-IF
- The plan aims at the wrong thing if an output-limit failure is likely to pass on a second try with the same limit. Against that: 42528's round 2 used all 64,000 tokens again (54719, finish length). A reasoning model's spend does not drop on the same packet.
- A second wrong-if: the operator wants such a model retried with a higher limit. That is his to decide (a token limit). This plan does not close that door: the filter only stops a same-limit retry.

## 6. RUN EVIDENCE
- Case: the first live run where a round-1 alternate fails with finish_reason length.
- Mark: no "R2 Alternate Call" for that model, and the a2r why names another free seat or "no pool model is left".
- If no such case occurs, the path is live and UNEXERCISED, and the two clean runs show no other change.
- Cost: saves about $1.08 per such case. NO PROBE.

## 7. INPUTS IN GIT
ask642/w4/plan642.md (this file). The build goes in ask642/w4/b1/.

## 8. STEPS (each names its card)
1. W1 grades this plan (no card).
2. W4 builds and runs C1 to C4 offline (no card). W1 grades the build.
3. Card to the operator, from W4: "Write ASK 642 (an alternate that ran out of output is not offered again)?"
4. W4 writes; fetch back; audit row; Wall post; W1 readback.
5. W3: manual entry and AAR rows.
6. Two clean live runs.
