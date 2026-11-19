# ASK 482 build (W1, 11-19), on W3 plan rev 2 (a482_w3/plan_rev2.md, 0cf23296)

Objective (operator, 16:03Z and 16:04Z): the dashboard shows the current models; Any vs Any offers every model the engine can debate with, each with its version in the drop-down.

## What changes
1. Database (one transaction, build482.sql):
   - NEW dash_debaters(): 10 rows (claude, chatgpt, gemini, grok, mimo, haiku, opus, glm, qwen4max, spark) with display name, model_config seat, api_model and active read live from model_config. EXECUTE revoked from PUBLIC, anon and authenticated (reached only through dash_api and dash_launch_odv1, both SECURITY DEFINER).
   - dash_api: one new line, action odv1_engines, returns dash_debaters() as a JSON array.
   - dash_launch_odv1: one line, v_eng := array(select key from dash_debaters()). qwen is now refused; haiku, opus, qwen4max and spark are now accepted. Everything else unchanged.
   - dash_odv1_judges: display order only, from the dead list (deepseek, gemini, grok, chatgpt, mimo, glm, qwen) to Init Seats ORDER0 (chatgpt, sol, sol62, haiku, gemini, hydrogen, spark, qwen4max, argon, sonnet).
2. Dashboard: odv1.js only (diff in odv1.diff, 5 hunks):
   - ODV1_PICK (the selectable list) is filled from rpc('odv1_engines'); each option reads "Defender: Haiku (anthropic/claude-haiku-5.5)". Static fallback of the same 10 without versions if the read fails.
   - ODV1_ENG becomes a display-name map only (adds haiku, opus, qwen4max, spark and the panel judges sol, sol62, hydrogen, argon, sonnet, luna; keeps qwen and deepseek for old records).
   - Help text: the panel order that named DeepSeek is replaced by "The engine seats a panel of three judges, none of them a debater or of a debater's family; Claude never judges." Run time "12 to 14 minutes" becomes "20 to 45 minutes" (twice).
   - Poll timeout 80 checks (20 min) becomes 240 checks (60 min). BUG FIX: run 440 took 22 min (15:43:28Z to 16:05:49Z), so the page gave up before the result.
   - index.html, patch.js, patch-base.js, queue.js, retire.js unchanged. Their DeepSeek drop-downs belong to the retired Debate and Challenger tabs, which retire.js removes; they are not shown.
3. vercel.json {"ignoreCommand":"exit 1"} so the project's Ignored Build Step does not stop this deployment (W4 9626 option b).

## Criteria
- C1 PASS (rolled-back): dash_debaters() returns 10; version_match 10 of 10 against model_config.
- C2 PASS (rolled-back, test482_run.sql): 15 of 15. Each of the 10 accepted as defender and as challenger (status fired); deepseek, minimax, qwen, "outsider" and "" refused on both sides (status error). Afterwards: dash_debaters absent, dash_launch_odv1 prosrc md5 still 0e6fe0f3, 0 odv1_launches rows for the test topic, http_request_queue 0, 0 audit rows, newest pg_net response 16:19:39Z (before the test). The test topic is not fenced.
- C2b PASS (sim482.cjs on engine e0a61271, out sim482_out.tsv): 100 ordered pairs, 0 refused, every pair has 3 panel seats; minimum panel plus alternates is 4 (chatgpt vs gemini and gemini vs chatgpt: haiku, spark, qwen4max on the panel). Same engine on both sides: allowed, as today (plan 3g).
- C3 UNCHECKED: no rendered screenshot (the page needs the passphrase). Checked instead: node parses odv1.js; rpc passes an action missing from ACT unchanged (p_action:(ACT[fn]||fn)); esc is global in index.html.
- C4: the deployed files differ from dpl_5n4sLu6gKhDk6DEfEgBAiE8Q9kNj only in odv1.js (odv1.diff) and the added vercel.json. Base files in base/ with sha1 equal to the live file uids.
- C5: no engine change.
- C6 mirror482.cjs: prints the read-only check. Rolled-back: known-good (today's 10) MATCH; known-bad (qwen in place of qwen4max) MISMATCH. registry_482_entry.json is the ASK 417 entry to append at readback.

## Card (W4's thread)
1. Run build482.sql (prefix SET LOCAL truth.session_id, the DDL audit trigger needs it). Readback: prosrc md5 of the four functions; mirror482 SQL reads MATCH.
2. mcp__Vercel__create_deployment, project truth-app-dashboard, team team_bBqtXgj58bdGw1brsCIdjyMs, files: src/index.html, src/patch.js, src/patch-base.js, src/queue.js, src/retire.js (unchanged, by sha), src/odv1.js (new), vercel.json. No projectSettings (they would be saved to the project). Wait for READY.
3. mcp__Vercel__assign_alias truth-app-dashboard.vercel.app to the new deployment. Readback: fetch /odv1.js, sha1 equals the new file.
Revert: assign_alias back to dpl_5n4sLu6gKhDk6DEfEgBAiE8Q9kNj; run revert482.sql (restores the three bodies read live, then drops dash_debaters).

## Gemini
Stays in the list. W3 traced the operator's 21:51 CST 11-18 words (W4 9126): "we keep gemini 3.8 flash.. it's good. my mistake on that.. we keep spark too." No ruling is owed.
