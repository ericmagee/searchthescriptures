# ASK 482 build REV 5 (W1, 11-19 17:1xZ), on W3 plan rev 2 (a482_w3/plan_rev2.md, 0cf23296)

Objective (operator, 16:03Z and 16:04Z): the dashboard shows the current models; Any vs Any offers every model the engine can debate with, each with its version in the drop-down.

## Rev 5 (the Queue tab; W2 9706 N1)
- md5: build482.sql 01ffad5c, revert482.sql 3eda592e, deploy/src/odv1.js efb5c5f9.
- New odv1_model_name(m) (the odMName rule in SQL; 15 of 15 live ids give the same string as odv1.js) and odv1_side_label(e, m); EXECUTE revoked from PUBLIC, anon, authenticated. odv1_eng_label: ChatGPT -> OpenAI (fallback only).
- dash_queue: each side is named by its model: a finished run by its own stored model; a launch not yet run by the engine's model now (dash_debaters). Rolled back: the queue's sides read "Muse Spark 1.3 as The Oracle defends · Gemini 3.8 Flash challenges"; 0 rows say ChatGPT.
- W2 9706 N1: DeepSeek and MiniMax keep their casing in both copies of the rule ("DeepSeek v4", not "Deepseek v4").
- Build check adds three lines (dash_queue uses odv1_side_label; odv1_model_name('openai/gpt-6.1-terra') = 'Terra 6.1'; odv1_eng_label has no ChatGPT). The revert restores dash_queue (9ccd1295) and odv1_eng_label (9d25f4a0), drops the two helpers, and checks.

## Rev 4 (W3 9696 C1, C2)
- odv1.js: the record page's D and C round headings call odSide with the run's own model (C1).
- dash_odv1_debates: each judge in the record list carries 'model' (judge_api_model), so the list's Judges line names models; display order as dash_odv1_judges (C2). Base prosrc ed3d654a -> 1fc8bc68; grants unchanged (rolled-back: EXECUTE postgres, service_role, lab_seat; run 440 judges show their models). Build check line added; revert restores the base and checks ed3d654a.
- md5: build482.sql 062698a7, revert482.sql 05645e82, deploy/src/odv1.js 6944e18b.

## Rev 3 (operator 17:00Z: "the model named \"chat gpt\" need to change to the model name (eg: terra 6.1 or sol 6.1)")
- odv1.js names every model from its id with one rule (odMName): openai/gpt-6.1-terra reads Terra 6.1, gpt-6.1-sol Sol 6.1, gpt-6.2-sol Sol 6.2; others title-cased from the id (Gemini 4 Hydrogen, Claude Haiku 5.5, GLM 5.3, MiMo v2.6 Pro, Muse Spark 1.3).
- Used in: the Any vs Any drop-downs ("Defender: Terra 6.1 (openai/gpt-6.1-terra)"), the record list, the record summary and result line, and every judge line (from the judgment's own judge_api_model). With no model recorded (old records), the engine name; "ChatGPT" is now "OpenAI" there and in the static fallback.
- dash_debaters row 2 name ChatGPT -> OpenAI (fallback only). Rolled back again: C2 15 of 15; payload checked.
- Other places checked: index.html and patch-base.js still say ChatGPT only inside the retired Debate and Challenger tabs, which retire.js removes from TABS; queue.js and patch.js have none.
- md5: build482.sql e368676c, test482_run.sql c0b71384, deploy/src/odv1.js 75b3e111 (sha1 ccfccb0b6315...), odv1.diff fb735b44 (12 hunks). Readback prosrc md5 dash_debaters b6084d5a.

## Rev 2 (after ASK 487 rev 1, W3 9682)
- dash_debaters row 3: key gemini now reads model_config seat gemini_deb (google/gemini-4-hydrogen, 64000), the debater row ASK 487 adds. Judge seat gemini stays on flash and is not shown in this list.
- ORDER: write ASK 487 (row gemini_deb, then Init Seats ENG) BEFORE this card. The closing DO check (10 active rows with a version) refuses this build if gemini_deb is missing, so a wrong order rolls back.
- ASK 486 rev 1 no longer touches ORDER0, so dash_odv1_judges is unchanged from rev 1.
- Re-tested rolled back with a stand-in gemini_deb row: C1 10 of 10 (gemini=google/gemini-4-hydrogen), C2 15 of 15; afterwards 0 gemini_deb rows, dash_debaters absent, dash_launch_odv1 0e6fe0f3, queue 0, 0 test launches.
- C6 mirror482 rev 2 compares key:mc_seat pairs: engine after 487 (gemini:gemini_deb) MATCH; today's engine eed7e2c8 (gemini:gemini) MISMATCH.
- md5: build482.sql 1a2ecb50, test482_run.sql 8f4e7a0b, mirror482.cjs 1bb483c9, registry_482_entry.json 9381ff2f, revert482.sql a9b631c0 (unchanged). Readback prosrc md5 dash_debaters 0616fc07 (was 663c511d); dash_api c541b307, dash_launch_odv1 3b74a293, dash_odv1_judges 9796ab3c unchanged.

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

## Card (W4's thread) (rev 1: W2 9649 N1 to N3)
1. Run build482.sql (md5 01ffad5c, rev 5; after ASK 487 is written; prefix SET LOCAL truth.session_id, the DDL audit trigger needs it). It ends in a raising DO check (10 active rows with a version; no 'qwen' in dash_launch_odv1; v_eng from dash_debaters(); dash_api has odv1_engines), so a failed check rolls the whole build back. Readback, prosrc md5: dash_debaters b6084d5a, dash_api c541b307, dash_launch_odv1 3b74a293, dash_odv1_judges 9796ab3c, dash_odv1_debates 1fc8bc68, dash_queue eb3d6380, odv1_eng_label 6598260b, odv1_model_name b5d222dd, odv1_side_label 3d597fe8 (dash_launch_odv1 3b74a293 was also produced live inside the rolled-back test, so the file and the test agree); mirror482 SQL reads MATCH.
   The poll-limit change (80 to 240 checks, 20 to 60 minutes) is its own card line: it is outside the plan (W2 N1).
2. mcp__Vercel__create_deployment, project truth-app-dashboard, team team_bBqtXgj58bdGw1brsCIdjyMs, files: src/index.html, src/patch.js, src/patch-base.js, src/queue.js, src/retire.js (unchanged, by sha), src/odv1.js (new), vercel.json. No projectSettings (they would be saved to the project). Wait for READY.
3. mcp__Vercel__assign_alias truth-app-dashboard.vercel.app to the new deployment. Readback: fetch /odv1.js, sha1 equals the new file.
4. Readback by a non-writer (W2 N3, since C3 is UNCHECKED): one load of the Any vs Any tab; the two drop-downs list 10 choices, each with its version.
Revert: assign_alias back to dpl_5n4sLu6gKhDk6DEfEgBAiE8Q9kNj; run revert482.sql (md5 3eda592e; restores the three bodies read live, then drops dash_debaters; ends in a raising DO check that the three prosrc md5 equal the bases and dash_debaters is gone. That check passes on today's live state, 16:3xZ).

## Gemini
Stays in the list. W3 traced the operator's 21:51 CST 11-18 words (W4 9126): "we keep gemini 3.8 flash.. it's good. my mistake on that.. we keep spark too." No ruling is owed.
