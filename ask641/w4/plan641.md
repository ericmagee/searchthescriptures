# ASK 641 PLAN (W4), rev 0: a run that stops before the panel still stores its call costs

Source: W4 Wall 12014 (cause and fix); the coordinator's assignment, 06:26 CST 11-25.
Live base: engine ccaf4660. Child aad0ad9c (not touched). Nothing here touches reasoning, a model setting, a token limit, a prompt, or what a seat is sent. No DB change.

## 1. OBJECTIVE
Run 42505 (row 12957d6e) stopped at C4 on the Anthropic usage limit. Its rounds were called and billed. Failure Salvage marked the row, but call_costs and run_cost_usd are NULL.
- Costs are gathered only by Panel Tokens. Its collector runs over every call node, each behind an isExecuted guard. Write Tokens then sends the result to rpc/record_debate_row_tokens.
- Panel Tokens is reached only from Panel Done and Dry Failed?, which come after the panel. The salvage path (Failure Salvage, Salvage Save?, Salvage Save, Save Incomplete to Drive, Salvage Stop) never gathers or writes costs.
Change: on the salvage path, after Salvage Save, the same collector runs and the same RPC is called with the call list. call_costs and run_cost_usd are then stored. The four token columns are sent as null, so they stay unset (section 3).

## 2. ROLES
- Plans and builds: W4.
- Grades: W1.
- Writes: W4, on W4's card to the operator (engine).
- Reads back: W1. Manual entry and AAR rows: W3.

## 3. SCOPE, SEARCH, NOT SEARCHED
Change (one copy of the collector, ASK 599 and the ASK 576/578 library form):
1. Shared Library: a new entry "Panel Tokens" holds the Panel Tokens body, unchanged, inside `function panelTokens($){...}`. The LIB lines and the MAP entry are added by the library tooling.
2. Panel Tokens becomes the standard stub that rebuilds that entry, checks its length, and returns panelTokens($). Its output is byte-equal on every input (C1).
3. New nodes on the salvage path only:
   - "Salvage Tokens" (Code): the same stub.
   - "Salvage Write Tokens?" (If): true when Init Seats' regrade and dry are not true.
   - "Salvage Write Tokens" (HTTP, onError continueRegularOutput, the same credential as Write Tokens): POST rpc/record_debate_row_tokens with p_run_token = $('Failure Salvage').first().json.run_token, p_input, p_output, p_cache_write and p_cache_read all null, and p_calls = $('Salvage Tokens').first().json.calls.
   - Wiring: Salvage Save -> Salvage Tokens -> Salvage Write Tokens? -> (true) Salvage Write Tokens -> Save Incomplete to Drive; (false) -> Save Incomplete to Drive. The Salvage Save? false branch (save failed, so there is no row) is unchanged.
- Why null tokens: on the salvage path Build Save Body never ran, so the totals Panel Tokens adds to (pre) do not exist. With null the RPC's token UPDATE matches no row (null >= x is not true), and its separate call_costs UPDATE still runs. No new count rule is made.
- Tagged ASK 641.
Not changed: Write Tokens, Write Tokens?, Failure Salvage, Salvage Save, record_debate_row_tokens, every call node, a run that reaches the panel.

SEARCH:
- Panel Tokens reads $('Init Seats') and Pass Accumulate. It reads Build Save Body and every call node inside try or behind isExecuted. It does not use $input, $execution or $prevNode, so it runs the same anywhere after Init Seats.
- Only Write Tokens reads $('Panel Tokens').
- Failure Salvage is reached only from nodes after Init Seats. Its run_token is TOK: in test mode "ODV1-TEST-..." and otherwise S.run_token. That is the token of the row Salvage Save writes, so the RPC finds that row.
- record_debate_row_tokens: it updates only a row under 6 hours old, never lowers a token figure, prices each call, and sets call_costs and run_cost_usd from p_calls independently of the token update.
- Library: 74 MAP entries today; none is named Panel Tokens or Salvage.

NOT SEARCHED:
- Whether n8n gives a stub the same $ when it is reached from the salvage path after an error output. C2 shows it on the 42505 node outputs if they can be read node-filtered. If not, the first live salvage is the proof.

## 4. CRITERIA AND DONE
- C1. Panel Tokens' output under the old and new engine is byte-equal on the stored node outputs of a completed run (42528 if node-filtered reads allow, else 42517), and on synthetic inputs: regrade, dry, and a run with no Build Save Body.
- C2. 42505 replay (node-filtered outputs of the round call nodes): Salvage Tokens' calls list holds every billed round call. The SQL pricing of that list, run read-only as a SELECT of the function's own expression, gives a run cost. The build reports the figure.
- C3. Salvage Write Tokens' body: p_run_token equals the salvage row's token, in test and normal mode (synthetic $execution.mode).
- C4. Engine: Panel Tokens and Shared Library change, and the three new nodes are added with only the connections in section 3. Every other node is byte-equal to ccaf4660. Standing 31/0; S4 compile; Library Check pair PASSES; one-copy check (reg385) PASSES.
- C5. ASK 599: tagged; no dead code; no new catch.
- DONE: W1 PASS on plan and build; operator presses W4's card; W4 writes; W1 reads back; two live runs that end on the salvage path, or the path stays UNEXERCISED, with two clean completed runs showing no change in their stored costs.

## 5. WRONG-IF
- The plan aims at the wrong thing if 42505's NULL cost was caused by the RPC refusing the row (for example the 6-hour window), not by the RPC never being called. Against that: no node on the salvage path names the RPC (searched), and 42505's row was written by Salvage Save in the same run.
- A second wrong-if: the operator wants the token columns filled on a salvaged row. That needs a count rule for the rounds alone, which is not asked. They stay unset, as now.

## 6. RUN EVIDENCE
- Case: the first live run that stops on the salvage path.
- Mark: its row has call_costs with one entry per billed call made before the stop, and run_cost_usd not NULL.
- If no run stops, the path is live and UNEXERCISED. Completed runs show unchanged costs (Panel Tokens byte-equal).
- Cost: nil. NO PROBE.

## 7. INPUTS IN GIT
ask641/w4/plan641.md (this file). The build goes in ask641/w4/b1/: the library rebuild script, the target engine, the tests and the fixtures.

## 8. STEPS (each names its card)
1. W1 grades this plan (no card).
2. W4 builds and runs C1 to C5 offline (no card). W1 grades the build.
3. Card to the operator, from W4: "Write ASK 641 (a stopped run still stores its call costs)?"
4. W4 writes; fetch back; audit row; Wall post; W1 readback.
5. W3: manual entry and AAR rows.
6. Live runs as in section 6.
