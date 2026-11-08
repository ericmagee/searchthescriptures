# pkgE4: earlier alternate start (Eric approved 12:03 CST 11-07; W2)

## What it does
- After Panel Cure Check, the seats that will need an alternate (drv_uncured > 0 after the cure) are known for most removals.
- Early Alternate Build runs Alternate Build's own code on that output. Early Alternate Start hands each alternate request to the sub-workflow "WALL-2024 Early Alternate" without waiting.
- The sub-workflow makes the call and stores the reply (table early_alternate) while the main run goes on through Enforcer, Judge Enforcer, Send Back and Gate (7 to 14 min).
- At Alternate Build the stored reply is used only when EVERY alternate call of the run has a stored reply for the same removed seat and the same request (hash of the body). Then Early Reply? routes to Early Alternate Reply, which hands Alternate Payloads those replies in the same order, as Alternate Call openrouter would. Otherwise the output is today's, byte for byte, and the normal call runs.

## Measured (saved runs)
- measure_E4 / replay_E4: 21 of 35 removals were candidates at Panel Cure Check, with 0 wasted. The early request equals the gate-time request in 11 of 11 runs.
- Removals decided only at the send-back or gate stage (all 6 since 33497) gain nothing; there the normal call runs.
- Saving when used: the whole alternate call, 2.5 to 12.8 min.

## Test: test_E4.cjs gives 56 OK, 0 FAIL
- In 11 runs the early reply is used. Every call matched. Early Alternate Reply equals the call output, and Alternate Payloads output is identical.
- In 6 runs a removed seat was not a candidate, and the output equals today's.
- With no stored rows, the patched Alternate Build output equals today's on every run.

## Parts (build: node pkgE4/build_E4.cjs; base fetchback_live_s61, Alternate Build stub from LIB v24_RMR)
1. DB: e4.sql. Table early_alternate (RLS on, no policies) and the RPCs record_early_alternate and get_early_alternate, granted to anon. Rolled-back test: insert 1, duplicate 0, bad token 0, read back.
2. Sub-workflow: out/subworkflow_early_alternate.json.
   - Execute Workflow Trigger, then the openrouter call: Alternate Call's own body expression without the x-ai reasoning-carry block, since this is the first turn of the alternate's conversation. Its grok conv id is the parent execution.
   - Then Shape, then Record (RPC).
3. Main: out/main_nodes_new.json holds 5 new nodes: Early Alternate Build, Early Alternate Start (wait off; its workflowId is filled in when the sub-workflow exists), Get Early Alternate, Early Reply? and Early Alternate Reply.
4. Main: out/main_nodes_patched.json holds 39 patched nodes.
   - Alternate Build: it reads Alternate Needed? (Get Early Alternate now sits between them) and makes the all-or-nothing match.
   - 38 nodes: every lookup list or accessor map that names "Alternate Call openrouter" also names "Early Alternate Reply". That keeps grok's reasoning carry into the alternate's cure, send-back and gate calls, and its token count.
   - Alternate Payloads (a LIB stub) is unchanged.
5. Connections: plan_E4.json. Early Alternate Build must sit ABOVE Enforcer Build on the canvas, so that executionOrder v1 runs it first. It returns in seconds.

## Revert
Restore the 39 nodes from the prewrite copy, delete the 5 new nodes and the sub-workflow, and run the DROP lines in e4.sql.
