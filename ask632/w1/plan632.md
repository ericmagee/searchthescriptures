# ASK 632 PLAN (W1), rev 0: the input-token field of an OpenRouter cost entry is never negative, and it is right when the cache fields overlap

Source: W4, Wall 11931 (cause and proposed fix); the 42528 AAR, DEFECT 8 (Wall 11953); the coordinator's assignment, 05:49 CST 11-25.
Live base: engine 066525aa (ASK 629). Child aad0ad9c: it holds no cost reader (searched). Nothing in this plan touches reasoning, a model setting, a prompt or a dollar figure.

## 1. OBJECTIVE
In call_costs, the `i` field (input tokens not served from cache) is wrong for google/gemini-3.8-flash whenever OpenRouter reports a cache write. Panel Tokens computes `i = prompt_tokens - cached_tokens - cache_write_tokens`. For this model the write count repeats the read count: in all 57 such entries, write equals read. So `i` comes out negative (-1 to -77,682).
- Change: in Panel Tokens' OpenRouter branch only, when the reported write count overlaps the read, take `i = prompt_tokens - cached_tokens`, and mark the entry `ov:1`. The write counts as overlapping when either:
  - the write equals the read and is above 0, or
  - prompt - read - write is below 0.
- In every other case the line is unchanged.
- Kept as reported: `cr` and `w5` are kept, because the billed cost charges both (section 3, FIT).
- Not changed: `b`, `usd`, run_cost_usd and every token total (p_input and the others come from prompt_tokens, not from `i`).
- Expected effect: no new entry has `i < 0`. On the 57 stored entries the rule gives the uncached input that the billed cost implies, for example QR Ask 664 (not -75,869) and Accept Call 4,330 (not -1).

## 2. ROLES
- Plans: W1 (the coordinator's assignment).
- Builds: W1, offline only (build script, target engine, tests in ask632/w1/b1/). W1 does not write to n8n (op doc s29).
- Grades: W4 (one seat that is not the builder). W4 also grades the build.
- Writes: W4, on W4's card to the operator. This is an engine change, so it is infrastructure and needs his press.
- Reads back: W1. Manual entry and AAR rows: W3.

## 3. SCOPE, SEARCH, NOT SEARCHED
Change: one statement in the Panel Tokens code node, in the `else` branch of `__CU` (the OpenRouter/other branch). Today it reads `e.i=__N(u.prompt_tokens)-e.cr-e.w5;`. The new statement sets `e.ov=1` and `e.i=__N(u.prompt_tokens)-e.cr` when `(e.w5>0&&e.w5===e.cr)||__N(u.prompt_tokens)-e.cr-e.w5<0`, and keeps the old value otherwise. The line is tagged ASK 632. No other node and no connection changes.

SEARCH (done for this plan):
- Readers that subtract cache fields from prompt tokens, in the live engine 066525aa and child aad0ad9c (text search for cache_write_tokens and cached_tokens):
  - The only one is Panel Tokens `__CU` (one occurrence of `e.i=__N(u.prompt_tokens)-e.cr-e.w5`).
  - The D/C Extract nodes, the Shared Library readers, Build Save Body and the Normalizers store the fields as totals and subtract nothing.
  - The child has no call_costs builder.
- Gemini direct (`usageMetadata`) branch: `i = promptTokenCount - cachedContentTokenCount`. It has no write field. Unchanged.
- DB: the only function that names call_costs is `record_debate_row_tokens`. It takes `usd` from `b` when billed, otherwise from model_prices. All 111 gemini-3.8-flash entries are billed, so no dollar figure depends on `i`.
- SCALE (SQL 05:5x CST 11-25):
  - 57 entries have `i < 0`, in 24 runs, all google/gemini-3.8-flash. The last is in the row of 04:59Z 11-25.
  - In all 57, `cr = w5`.
  - OpenRouter entries with both `cr > 0` and `w5 > 0`: 662. The other 605 are OpenAI models and qwen4max, none with `cr = w5` and none negative (minimum `i` is 0).
- FIT (ask632/w1/fit632.sql):
  - The billed cost of all 111 stored gemini-3.8-flash entries is solved exactly at input 0.75/M, cache read 0.075/M, cache write 1/24 per M and output 3.75/M.
  - It fits only when the uncached input is prompt minus read: 57 of 57 with a write fit that reading and 0 of 57 fit the disjoint reading. The 54 without a write fit at the same prices.
  - So the write is billed in addition, but its tokens are the same tokens as the read. This also settles W4's "off by one" case (Synthesis, -1): it is the overlap, not disjoint fields.

NOT SEARCHED: the dashboard (Vercel app) pages that may show `i`. Correcting the 57 stored entries is a record decision, and it is out of scope (see section 8).

## 4. CRITERIA AND DONE
- C1: Replay of the `__CU` statement on the usage of each of the 57 stored entries (prompt = i + cr + w5 as stored): every new `i` ≥ 0, equal to prompt - cr, and `ov:1`.
- C2: Replay on every other stored OpenRouter entry (1,922 - 57): `i` is byte-equal to the stored value, and there is no `ov` key.
- C3: Replay on synthetic usages:
  - read 0 and write 0: unchanged;
  - read > 0 and write 0: unchanged;
  - write ≠ read with a remainder ≥ 0: unchanged;
  - write = read: overlap;
  - remainder < 0 with write ≠ read: overlap, and `i = max(0, prompt - read)`. A clamp at 0 is added only for this last case, as W4 proposed.
- C4: Engine: only Panel Tokens changes, by that one statement; every other node is byte-equal to 066525aa; connections are equal; standing 31/0; S4 compile; Library Check pair PASSES.
- C5: ASK 599: the line is tagged, there is no dead code, and there is no new catch.
- DONE: W4 PASS on the plan and the build; the operator presses W4's card; W4 writes; W1 reads back; two clean live runs in which a gemini-3.8-flash call reports a cache write (marked as in section 6).

## 5. WRONG-IF
- The plan aims at the wrong thing if OpenRouter's write count for this model is disjoint from the read count. Then the true uncached input would be prompt - read - write, and the fix would overstate it.
  - The FIT rules this out on the stored entries: the disjoint reading prices 0 of 57 correctly.
- It also aims at the wrong thing if another model reports equal read and write counts that are disjoint. Then the `w5 === cr` test would misclassify it. No stored entry of another model has `cr = w5`; C2 holds every other entry unchanged.
- A provider change after the build could alter the fields. The run marks in section 6 would show it, because `i + cr` would then not equal the prompt the billed cost implies.

## 6. RUN EVIDENCE
- Case: the first live run with a gemini-3.8-flash call that reports a cache write (in recent runs: the Accept calls, the Oracle rounds, Synthesis, QR Ask, alternates).
- Mark: no call_costs entry has `i < 0`; the gemini-3.8-flash entries with `w5 > 0` carry `ov:1` and `i` = prompt - read; their `b` reprices at the FIT prices.
- Cost: nil. The fix adds no call.
- NO PROBE: a paid call is not needed; the stored usages are the test.

## 7. INPUTS IN GIT
ask632/w1/plan632.md (this file) and ask632/w1/fit632.sql. The build goes in ask632/w1/b1/: the build script, the target engine, the test with the 1,922 stored OpenRouter entries as its fixture (by SQL export), and the outputs.

## 8. STEPS (each names its card)
1. W4 grades this plan (no card).
2. W1 builds offline and runs C1 to C5 (no card). W4 grades the build.
3. Card to the operator, from W4: "Write ASK 632 (the input-token field of a gemini-3.8-flash cost entry is never negative)?"
4. W4 writes the engine; fetch back; audit row; Wall post; W1 readback.
5. W3: engine manual entry (the cost record, `ov`) and AAR rows.
6. Separate question, not part of this ASK, put to the operator only if he wants it: whether to correct `i` in the 57 stored entries (`i := i + w5`, adding `ov:1`). As proposed on Wall 11931, they are left as written.
