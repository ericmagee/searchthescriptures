# ASK 494 plan rev 2 (W2, 11-19; replaces rev 1 6bffd9ec; rev 2 is headings only, THE ASK FORM op doc §29, per W1 9772): the public key can write debate rows through the engine's RPCs

## 1. OBJECTIVE
Today anyone holding the public (anon) key can call rpc/record_debate_row and the other engine write functions. With them they can write a forged debate row, judgment or outcome. Close that, and keep every engine run saving.
Expected effect: the nine engine write functions refuse anon with 42501, and the engine's saves run as service_role.

## 2. ROLES
Planner W2. Builder and writer W4: the A1 node credential switch and the A2 DB step, each on a card pressed in W4's thread. Graders W1 and W3 (neither is the builder). Readback by two non-writers. A1's new credential is made by the operator in the n8n UI.

## 3. SCOPE
Scope: EXECUTE grants on the nine functions, and the credential on the engine's 11 write nodes. No function body.
SEARCH (read live 11-19 ~11:55 CST):
1. Write functions (pg_proc). Each is SECURITY DEFINER, owned by postgres, and anon holds EXECUTE:
   record_debate_row(jsonb) b6e8e638; record_debate_row_tokens 7fcaf1b3; record_debate_judgment(jsonb) ffa3a7f8; derive_debate_outcome(uuid) 1f79a931 (7b568ff9 before the ASK 488 write at 18:03:57Z; re-read 18:10Z); odv1_record_panel_substitution 91083e19; odv1_record_panel_alternates ccaa64d7; record_enforcer_log b3924b1c; record_replay_judgments b920b715; odv1_mark_grading_failed 9d7e7054.
   - authenticated also holds EXECUTE on all of them except record_replay_judgments. PUBLIC holds it on odv1_record_panel_alternates and odv1_mark_grading_failed.
2. Callers inside the database (prosrc search): derive_debate_outcome is called by odv1_record_panel_alternates, odv1_record_panel_substitution (both definers, unaffected) and d5_selftest (SECURITY INVOKER: it fails if run as anon after the step). odv1_record_panel_substitution is called by odv1_record_panel_alternates. No other function calls any of the nine.
3. Callers over REST, from Supabase edge logs (JWT role and user agent only; no key value read), last 24 h: every call to seven of the nine came from user agent n8n with JWT role ANON. Those seven are record_debate_row, record_debate_row_tokens, record_debate_judgment (6 calls), derive_debate_outcome, odv1_record_panel_substitution, odv1_record_panel_alternates and record_enforcer_log. Newest call 16:05:44Z (run 440). No other caller appears. record_replay_judgments and odv1_mark_grading_failed were not called in the window.
4. n8n (REST scan, git 0aafde28): the engine (moMxiV4Irg1uRBZN) calls all of them through its header credential (Save to DB, Salvage Save, Write Judgment 1 to 3, Derive Outcome, Write Tokens, Record Substitution, Record Alternates, Write Enforcer Log, Write Replay). Nine inactive W1-series workflows call record_debate_row. No other active workflow calls any of them.
5. Dashboard (git a482_w1/base) and the edge function ask: they call none of them.

6. W1 9765 (engine fetch): all 11 engine write nodes use the one header credential named "Supabase Anon Key", with no node-level headers. The child workflow has 0 calls to the nine. W1 cannot read the Cure Call (c7366RPLb8vdMQg6) or SX4Z, so their calls are not traced; edge logs show no non-engine caller in the last 24 h.
7. odv1_mark_grading_failed (W1 N2): its only caller is the pg_cron job odv1_grading_failed_watchdog, every 30 minutes, run as postgres. A2 does not affect it.

Key fact:
The engine itself writes with the PUBLIC key (role anon, item 3). A plain REVOKE would stop every engine save. So the fix has two phases: first the engine gets a key that is not public, then anon loses EXECUTE.

Card notes (W3 9766):
- N4: this ASK reverses the ASK 466 decision to keep the engine on the anon key. The card must say so.
- N2: for A1, instead of a new credential, W4 may point the write nodes at the existing native n8n credential "Supabase account" (predefined credential type). W4 reads back, by name and type only, which role it carries. The proving run's edge logs (role service_role) settle it either way. No key value enters a transcript.

Options:
A. (recommended) Two phases.
   A1. The operator, in the n8n UI, creates a new Header Auth credential that carries the service_role key. No key enters any transcript.
       - W4 switches only the engine's write nodes (item 4) to it: touched nodes only, and no wording, model or reasoning setting.
       - Reads stay on the current credential.
       - Before the build, W4 reads back, by header NAME only, whether those nodes also send their own apikey or Authorization header. A node-level header would override the credential, and the build must cover it.
       - Proof: the next run's edge logs show role service_role on each of the write paths, and the row saves.
   A2. DB card (step494.sql): REVOKE EXECUTE on the nine functions FROM PUBLIC, anon, authenticated. postgres, service_role and lab_seat keep EXECUTE. This runs only after A1 is proven by a run.
B. Put the service key into the engine's existing credential instead of a new one. That needs no node edits, but every other workflow that shares that credential silently gains the service role. Credentials are not listed (standing rule), so the sharing is untraced. Not recommended.
C. Launch-ticket gate inside record_debate_row: refuse a row with no matching odv1_launches entry. Rejected on evidence: since 10-01 there are 249 ODV1 rows but only 21 launches (the first was 10-17). Most runs do not start from the dashboard launcher, so the gate would refuse real runs.
D. No build. The write guard and data_class stay the only defence, and forging stays open.

NOT SEARCHED: the Cure Call (c7366RPLb8vdMQg6) and SX4Z cannot be read by n8n MCP (W1 9765); the edge logs show no caller of the nine other than the engine in the last 24 h.

Not changed: No wording, model or reasoning setting. No function body.

## 4. CRITERIA and DONE
Before A1: W4 reads back, by name only, the credential on each of the 11 write nodes and that none carries a node-level apikey or Authorization header.
Before A2: one engine run after A1, whose edge_logs show role service_role on each write path, and whose row saves.
Before the A2 write: test494_rollback.sql passes in full.
- C1: anon record_debate_row before: recorded (shows T1 can fail).
- T1: anon record_debate_row after: refused 42501.
- T2: anon record_debate_judgment after: refused 42501.
- T3: anon derive_debate_outcome after: refused 42501.
- T4: service_role record_debate_row after: recorded.
- T5: lab_seat record_debate_row after: recorded.
- T6: after the step, anon holds EXECUTE on none of the nine.
- R1: after the revert, the EXECUTE grantees for all nine equal today's, compared without regard to order.
- The test does not prove A1: only a live run proves the n8n side.
Revert:
Restore each function's ACL exactly as it is today (item 1). That includes the PUBLIC grant on odv1_record_panel_alternates and odv1_mark_grading_failed, and no authenticated grant on record_replay_judgments.
Done: step494.sql's closing checks pass, the audit row is written, two non-writers read it back, and the next run saves with no 42501.

## 5. WRONG-IF
1. A2 runs before A1 is proven: the next engine run fails at Save to DB with 42501, after its paid calls.
2. A write node sends its own anon apikey or Authorization header, which overrides the new credential. The A1 readback must rule this out.
3. A caller outside this SEARCH uses one of the nine as anon: d5_selftest run as anon, a republished W1-series workflow, or an outside client.

## 6. RUN EVIDENCE
For A1: the next engine run's edge_logs show JWT role service_role on rpc/record_debate_row, record_debate_judgment, derive_debate_outcome and record_debate_row_tokens. For A2: the following run saves its row and judgments with no 42501. No new ASK 417 registry case is needed: this is a log read, by request path and role only.

## 7. INPUTS IN GIT
plan494.md, step494.sql fc32cec9, revert494.sql dfcfdd2f and test494_rollback.sql b6f77465, in /mnt/project-files/ask494/. The commit hash is posted on the Wall when the commit is made.

## 8. STEPS
A1 is a credential and node change, so it needs the operator's approval, two grades and a W4 card. A2 needs its own W4 card after the proving run. 492 (direct insert) is independent and can go first.
1. A1 credential: the operator creates it (or W4 uses "Supabase account", per the card notes). Waits on: the operator's approval.
2. A1 node switch on the 11 write nodes. Waits on: W4's card.
3. Proving run. Waits on: the operator's release.
4. Rolled-back test. Waits on: the operator's approval prompt.
5. A2 write (step494.sql). Waits on: W4's card.
6. Readback by two non-writers. Waits on: step 5.
