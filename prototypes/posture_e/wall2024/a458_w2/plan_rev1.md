# ASK 458 plan rev 1 (W2; rev 0 FAIL by W1 9261 and W3 9264): remove the DeepSeek steps (the operator 21:24 CST 11-18: "just make sure they're gone if they are"; coordinator 06:46Z 11-19)
Base: live engine 4cb54cf0, child 3e0810d5 (ASK 455 part D written 06:49:24Z; fetched by version id, parameters and connections equal to the a455d_w2 targets).

1. OBJECTIVE. No step of either workflow calls DeepSeek or exists only to carry a DeepSeek reply. A seat that ever resolves to the DeepSeek family stops the run
   fail-closed at "Provider Removed Stop", as the other removed providers already do, instead of calling api.deepseek.com.
2. ROLES. Plan and build W2. Graders W1 and W3. Card and write W4.
3. SCOPE with SEARCH.
   SEARCH: every node whose request goes to api.deepseek.com or whose name holds "deepseek" (after ASK 455 D), every connection into and out of them, and
   every quoted reference to their names in every node's parameters and in the Shared Library (lines and MAP text). Stored executions 39266, 39015, 38593:
   none of the 24 engine DeepSeek steps ran (n8n runData empty for all 24 in each).
   REMOVE, engine (29 nodes: 21 route calls, 3 panel slot 1, 5 acceptance):
   a. The 21 call steps of the debate and judge routes (C1-C4, D1-D4, C4G, C3G, C1B, D2B, C2B, D3B, C3B, D4B, C4B Call deepseek (17); DeepSeek Synthesis Call;
      DeepSeek Diagnostic Call; Independent Verdict Call (posts to api.deepseek.com, fed by Verdict Judge Route #0; added in rev 1 per W1 9261);
      Panel Reserve deepseek). Each is fed by one Switch output (Route #6, or #0 for the judge routes). That output is rewired to
      "Provider Removed Stop".
   b. The panel slot 1 DeepSeek chain: Panel Judge 1 deepseek, Panel Judge 1 Empty? (fed only by it), Panel Judge 1 deepseek retry. Panel Judge 1 Route #0
      goes to Provider Removed Stop.
   c. The acceptance DeepSeek chain: Accept DS Build, Accept DS?, Accept Call deepseek; Accept DS Return?, Accept Return Call deepseek.
      Accept Call openrouter connects to Accept Check directly; Accept DS Return Build #0 connects to Accept Final directly.
      Accept DS Return Build is KEPT (rev 1): its judge prompt holds the word "reasoning" 5 times, so removing the node trips the reasoning guard
      (rev 0 WRONG-IF: narrow, never force). Only its DeepSeek read changes: "let DSB=null;try{if($('Accept Call deepseek').isExecuted)DSB=...}catch(e){DSB=null;}"
      becomes "let DSB=null;", so it always returns {skip:true}, as it does today whenever Accept Build holds no ds (always since ASK 437).
      Removing it fully needs the operator's own words for the guard.
   REMOVE, child (6 nodes): Panel Judge 1 deepseek, Panel Reserve deepseek, and their A379 Gate and Tick pairs (Gate 26/Tick 26, Gate 31/Tick 31);
      Gate 25 #1 and Tick 25 go to Gate 27, Gate 30 #1 and Tick 30 to Gate 32.
   EDIT, every reference to a removed node (an n8n expression that names a missing node throws, so none may stay):
      engine Panel Payloads, Panel Check, Panel Tokens, Alternate Payloads, Accept Check, Accept Return Build, Accept DS Return Build, Accept Final, Alternate Pass Call;
      child Alternate Pass Check, R2 Alternate Payloads; Shared Library lines and MAP text (both workflows, one joint map, byte counts recomputed).
      Getter-map entries and read-line names are deleted; the slot lists SLOT_NODES lose the DeepSeek member; "Provider Removed Stop" text names DeepSeek
      among the removed providers. No other text changes.
   OUT: model_config rows (no row is touched); the JFAM family index 0 (the Switch keeps its output count); reasoning, effort, max_tokens, temperature:
      none of the 24 DeepSeek call bodies holds any such text, and the reasoning guard must stay clean on the edited nodes.
4. CRITERIA and DONE.
   C1: no node calls api.deepseek.com; no node name holds "deepseek"; no quoted reference to a removed name remains anywhere (nodes, connections, library).
   C2: every node not in SCOPE is JSON-equal to live; connections differ only as listed in 3.
   C3: every pkgLIB stub rebuilds with the right byte count; Library Check passes; the a_scan_w2 scan finds 0 reads the runner does not send.
   C4: replay of the edited Code nodes, old against new, with the runner's gating, on stored executions 38593 and 38226: Panel Check, Panel Payloads,
       Alternate Payloads, Panel Tokens, Accept Check and Accept Final (Accept Check also with its new input, the 8 items of Accept Call openrouter, per W3 9264; Accept Final's input path from Accept Return? #1 is unchanged),
       outputs equal, except where the old output named a removed node that never ran (listed one by one).
   C5: reasoning guard clean on both workflows.
   DONE: two PASS grades, card, write, readback, and a run that completes (RUN EVIDENCE).
5. WRONG-IF. Any stored run takes a removed path (C4 shows a change in a judge-facing output); any expression or stub names a missing node (C1); the
   reasoning guard refuses (then the edit is narrowed, never forced).
6. RUN EVIDENCE. The next run completes with no "Referenced node doesn't exist" error and no Provider Removed Stop. Registry entry: case = any run;
   mark = no error naming a removed step.
7. INPUTS IN GIT. a458_w2/: this plan; build458.cjs, check458.cjs, build_out.txt, check_out.txt, guard_out.txt, scan_out.txt, replay_out.txt,
   ex/ (the stored node data replayed), engine_target.json.gz, child_target.json.gz.
8. STEPS. a. Grades of this plan. b. Build and C1 to C5. c. Grades. d. Card. e. Write, readback. f. Manual and op doc entries (W3).
