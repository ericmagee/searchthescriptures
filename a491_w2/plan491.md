# ASK 491 plan rev 3 (replaces rev 2 1770b624: adds the NOT SEARCHED line in SCOPE, W3 9775; rev 2 replaced rev 1 64986876; rev 2 is headings only, THE ASK FORM op doc §29, per W1 9772; was rev 0 (W2, 11-19): the public key can no longer call the three queue functions directly (advisor P4))

1. OBJECTIVE. A holder of the public (anon) key cannot launch a W1 debate without the dashboard passphrase, cannot mark queued jobs failed, and cannot claim the next queued job. The dashboard launch (through dash_api, with the passphrase), the hourly expiry job and the engine are unchanged. No build until graded and the operator approves the write.

2. ROLES. Planner and SQL builder W2. Graders W1 and W3. Write by W4 on a card pressed in W4's thread. Readback by two non-writers.

3. SCOPE and SEARCH (live SQL, n8n, git, 17:16Z to 17:20Z 11-19).
 a. The three functions, all SECURITY DEFINER owned by postgres:
  - dash_launch_debate(text,text,int) (prosrc md5 5377cd45): anon EXECUTE true, authenticated false. It inserts a 'pending' W1 row into debate_queue. The AFTER INSERT trigger debate_queue_auto_fire then POSTs to the n8n webhook claude-vs-chatgpt, claude-vs-gemini or grok-w1. Called directly, it skips dash_api's passphrase.
  - debate_queue_expire_stale() (fb398290): anon and authenticated EXECUTE true. It marks every 'pending' row older than 2 hours as failed.
  - pick_next_debate_job() (481ace04): anon EXECUTE true, authenticated false. It sets the oldest pending row to 'running'.
 b. Callers.
  - dash_launch_debate: only dash_api (SECURITY DEFINER, postgres; action 'launch_debate'), and dash_api checks p_pass. The dashboard (a482_w1/base/index.html) calls rpc('dash_launch_debate'), and its rpc() always POSTs to /rpc/dash_api with the passphrase. No direct /rpc/dash_launch_debate call exists in the page files or in n8n (a466_w4/n8n_rest_targets.json: 0 hits).
  - debate_queue_expire_stale: the pg_cron job debate-queue-expire ("17 * * * *", user postgres, active). No n8n or page caller.
  - pick_next_debate_job: one n8n caller, "Debate Queue Processor — Scheduled Worker" (qxkH576npsnJul5e), node Pick Next Job. It is inactive (live search 17:19Z) and was last updated 07-25.
  - No other public function calls any of the three (prosrc search).
 c. Not traced: whether the three W1 webhooks (claude-vs-chatgpt, claude-vs-gemini, grok-w1) are live today. If any is, a direct anon call starts a paid debate without the passphrase. debate_queue has had 0 rows in the last 30 days.

NOT SEARCHED (W3 9775): the Cure Call (c7366RPLb8vdMQg6) and SX4Z cannot be read by n8n MCP. Edge logs, last 24 h: no REST call to any of the three functions (dash_api had 41 calls, which reach dash_launch_debate inside the definer; cron runs as postgres and does not pass through REST).

3b. OPTIONS (part of SCOPE).
 A (recommended). REVOKE EXECUTE on the three FROM PUBLIC, anon, authenticated. Nothing else changes. postgres (dash_api, pg_cron) and service_role keep EXECUTE.
 B. Revoke on dash_launch_debate only. This leaves anon able to fail every queued job and claim jobs, so B is not offered as a final state.
 Not offered: changing dash_api or the trigger.

4. CRITERIA and DONE.
 (i) anon and authenticated have no EXECUTE on the three;
 (ii) dash_api keeps anon EXECUTE and stays SECURITY DEFINER owned by postgres, so its call to dash_launch_debate is checked as postgres. The test does not read or use the dashboard passphrase; the live proof is the next dashboard launch;
 (iii) dash_api with a wrong passphrase still returns unauthorized (test T4, auto-fire trigger disabled inside the rolled-back test so no webhook is sent);
 (iv) debate_queue_expire_stale() still runs as postgres;
 (v) the prosrc of all three is unchanged.
 DONE: a non-writer readback shows (i) and (v), and the next hourly debate-queue-expire run succeeds (cron.job_run_details status 'succeeded').

5. WRONG-IF. The plan is wrong if any live caller reaches one of the three with the public key, directly and not through a definer. Checked: the page goes through dash_api only, n8n has one caller (inactive), and cron runs as postgres. If the Queue Processor is ever re-activated with the anon key, it will need its own grant or the service credential. The card says so.

6. RUN EVIDENCE. None in a debate run (the engine does not use debate_queue for ODV1 runs). Evidence: the readback, the rolled-back test, and the next cron run at :17.

7. INPUTS IN GIT. plan491.md, step491.sql 7074eb34, revert491.sql 6841b272 and test491_rollback.sql a853825b (rev 1; its result is at Wall 9751), in /mnt/project-files/ask491/. The commit hash is posted on the Wall when the commit is made.

8. STEPS.
 S1 W1 and W3 grade this plan and the files (step491.sql, revert491.sql, test491_rollback.sql).
 S2 Rolled-back test on my session (the operator is told first).
 S3 W4 card, press, write.
 S4 Two non-writer readbacks, and the cron check at the next :17.
 S5 Manual entry by W3.

## Rev 1 (W2, 11-19 ~11:35 CST)
- test491_rollback.sql rev 1 (md5 a853825b) adds C3: anon pick_next_debate_job before the revoke (W3 9737 N1). Nothing else in the test changed. step491.sql and revert491.sql are unchanged.
- W1 9735 N1, for the card: C1 (dash_launch_debate inserts a pending row), C3 (pick_next_debate_job marks it running) and T5 (expire_stale as postgres) write inside the test; the final RAISE rolls all of it back, and auto_fire is disabled inside the same transaction.
- W1 9735 N2: an n8n name search for "claude-vs-chatgpt", "claude-vs-gemini", "grok-w1", "W1", "vs", "Grok", "ChatGPT" and "Gemini" finds no workflow that names those webhook paths. Name search does not read webhook paths, so this is NOT proof they are dead. The step closes the direct path either way.
