# ASK 500 plan rev 0 (W3, seat 33, 11-19; THE ASK FORM op doc §29; number assigned by the coordinator in its message to W3 at 21:10:43Z, and again at 21:16:21Z, "plan 500 around that webhook"): anyone with the URL can start a paid engine run

## 1. OBJECTIVE
Today the engine's start webhook (Debate Start, POST /webhook/oracle-debate-v1) has no authentication. Anyone who has the URL can start a full engine run (1.73 to 5.15 USD for this pair; run 40891 was 5.149) with any topic, engines and profiles. A direct POST also skips the topic fence, which lives in dash_launch_odv1. The URL is not a secret (W4 10095 B8). Close that, and keep every real launch working.
Expected effect: a POST to the start webhook without the right header is refused by n8n before the flow runs, and every real launch goes through dash_launch_odv1 (topic fence and odv1_launches log), which sends the header.

## 2. ROLES
Planner W3. Builder and writer W4: the function change and the node change, each on a card pressed in W4's thread. Graders W1 and W2 (neither is the builder). Readback by two non-writers. The operator makes the secret value (n8n credential and Supabase Vault), so no value enters any transcript.

## 3. SCOPE
Scope: the Debate Start node's authentication; dash_launch_odv1's net.http_post call (headers only); how W4's runstart.py launches. No wording, model or reasoning setting; no other node; no change to the fence logic.
SEARCH (W4 10095, read 21:11Z to 21:16Z; W1 10093; W3 live reads 15:17 CST):
1. Debate Start (engine moMxiV4Irg1uRBZN, version d491f4a5): httpMethod POST, path oracle-debate-v1, responseMode responseNode, options {}, no authentication key, so none (W4 10095 B4; n8n trigger info "No credentials required", W1 10093 item 3).
2. What a direct POST reaches: Debate Start, Library Check (checks the Shared Library sha only; not a gate), Accept Models, Accept Build, then Accept Call openrouter, the first paid call, 4 hops in. No engine node reads a header or secret from Debate Start (W4 10095 B5).
3. Callers: dash_launch_odv1 (SECURITY DEFINER; EXECUTE postgres, service_role, lab_seat; prosrc md5 3b74a293, 2,865 characters) applies the topic fence (debate_fence_overrides), then calls net.http_post(url, body, timeout 60000) with no headers argument, then logs to odv1_launches. W4's runstart.py posts straight to the URL. 89 engine executions since 11-07, all mode webhook (W4 10095 B6).
4. Extensions live: supabase_vault 0.3.1 (4 secrets stored now) and pg_net 0.20.3.
5. The Panel Judge Call webhook (Y1VIsNB6KBrs1znP) already has headerAuth, credential "WALL-2024 PPJ webhook" (W4 10089 A4, 10095 A1). It is the working pattern for this ASK.

Key fact:
dash_launch_odv1 is the only launch path with the fence and the log, and it sends no header today. If the node required a header first, every dashboard launch would be refused. So the function learns to send the header first, and the node requires it second.

Options:
A. (recommended) Header auth, in three steps.
   A0. The operator, outside any transcript: in n8n, creates a Header Auth credential "ODV1 start webhook" (a header name and a long random value); in Supabase Vault, stores the same value as secret "odv1_start_webhook". Seats read back only that both exist, by name.
   A1. DB card (step500a1.sql): dash_launch_odv1 reads the value from vault.decrypted_secrets by name inside the function and passes it in net.http_post's headers. Nothing else in the body changes. If the secret is missing, the function raises before any insert or post. Harmless while the node has no auth (n8n ignores an extra header).
   A1b. runstart.py launches through dash_launch_odv1 (W4 calls it through SQL as postgres) instead of posting to the URL, so W4's launches also get the fence and the log. W4 reads runstart.py first and states what else it does before the POST (registry checks) and keeps those.
   A2. n8n card: Debate Start gets authentication headerAuth with "ODV1 start webhook". Touched node only. Proven by the next launch through dash_launch_odv1 running, and a POST without the header being refused.
B. A launch ticket: dash_launch_odv1 writes a random ticket to odv1_launches and sends it in the body; a new engine node checks the ticket (service_role RPC) before Accept Call. No shared secret, but new engine nodes and a new function. Not recommended: more engine change for the same effect.
C. Change the path to a random one. The URL sits in pg_proc, files and the Wall (item 8 of 10095), so it would leak again. Not recommended.
D. No build. Anyone with the URL can keep starting paid runs.

Not in scope (noted): whoever holds the "WALL-2024 PPJ webhook" value gets OpenRouter calls with no model or token cap (W4 10095 A3). A cap is a separate decision.

NOT SEARCHED:
- Whether the 89 engine executions all match odv1_launches or Wall launch records (would show any launch from outside; W4 10095 B6). W4 reads this before the build and reports it.
- Whether any other active workflow has a webhook trigger with no authentication. W4 lists them before the build.
- Whether a body can raise a run's cost above 5.15 USD (W4 10095 B7).
- How runstart.py gets its URL and whether anything else posts to the URL (W4 reads runstart.py and the 196 workflows).

## 4. CRITERIA and DONE
Before A1: both secrets exist by name (n8n credential list by name; vault.secrets by name), with no value read or printed.
Before the A1 write: test500a1_rollback.sql passes in full, as one transaction that ends in RAISE (pg_net sends only after commit, so nothing is posted):
- T1: dash_launch_odv1 with a fenced topic is refused as today (fence unchanged).
- T2: with an allowed test topic, the queued request in net.http_request_queue carries the header name and a value whose md5 equals the vault secret's md5 (compared in SQL; neither printed), and the URL and body equal today's.
- T3: with the secret renamed inside the test, the function raises and queues nothing.
- R1: after the revert, prosrc md5 is 3b74a293 again.
Before A2: one real launch through dash_launch_odv1 after A1 runs normally (A1 proven), and runstart.py is changed (A1b).
After A2:
- Q1: the next launch through dash_launch_odv1 starts an engine execution and the row saves.
- Q2: one POST to the URL with no header (W4, an empty body) is refused by n8n with 403, and no engine execution starts. That call is free.
- Q3: engine executions after A2 each match an odv1_launches row.
Revert: A2, write back the saved live engine JSON on the operator's word; A1, revert500a1.sql restores prosrc 3b74a293.
Done: both writes read back by two non-writers, Q1 to Q3 pass.

## 5. WRONG-IF
1. A2 runs before A1: every dashboard launch is refused at the webhook.
2. The n8n and vault values differ: every launch after A2 is refused (Q1 fails; revert A2 on the operator's word).
3. A launch path outside this SEARCH (another workflow, a script) posts to the URL: it fails after A2. The pre-build reads must list every caller.
4. The value appears in a transcript, a file or a log line: the secret must be remade. No seat reads or prints it; the test compares md5s in SQL.

## 6. RUN EVIDENCE
Q1 is the next real launch; no separate paid run. Q2 is one free refused POST. No ASK 417 registry case.

## 7. INPUTS IN GIT
plan500.md in /mnt/project-files/ask500/w3/ (git a500_w3/). W4's step500a1.sql, revert500a1.sql, test500a1_rollback.sql, the runstart.py change and the node targets after the plan passes.

## 8. STEPS
1. A0 secrets. Waits on: the operator.
2. Pre-build reads (NOT SEARCHED items). W4.
3. A1 rolled-back test. Waits on: the operator's approval prompt.
4. A1 write. Waits on: W4's card. Then a real launch proves it.
5. A1b runstart.py change. Waits on: two grades.
6. A2 node write. Waits on: W4's card.
7. Q1 to Q3 and readbacks.
