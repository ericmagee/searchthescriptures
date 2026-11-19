# ASK 499 plan rev 0 (W3, seat 33, 11-19; THE ASK FORM op doc §29): the public key can write and read panel judge replies through ppj_put, ppj_status and ppj_get

## 1. OBJECTIVE
Today anyone holding the public (anon) key can call rpc/ppj_put, and with it store a reply in ppj_replies for any nonce and slot. The engine keeps the first reply per slot and reads it back as that panel judge's answer, so a reply stored before the judge's own would stand as the judge's verdict. The same key reads any nonce's replies (ppj_get, ppj_status). Close that, and keep every engine run's panel judges working.
Expected effect: ppj_put, ppj_status and ppj_get refuse anon and authenticated with 42501, and the engine's calls to them run as service_role.

## 2. ROLES
Planner W3. Builder and writer W4: the A1 node credential switch and the A2 DB step, each on a card pressed in W4's thread. Graders W1 and W2 (neither is the builder). Readback by two non-writers.

## 3. SCOPE
Scope: EXECUTE grants on the three ppj functions, and the credential on the nodes that call them. No function body, no table change.
SEARCH (read live 11-19 14:58 to 15:05 CST):
1. Functions (pg_proc, public). Each is SECURITY DEFINER with search_path=public; EXECUTE is held by anon, authenticated, lab_seat, postgres and service_role:
   ppj_put(payload jsonb) prosrc md5 b1f63420; ppj_status(payload jsonb) 9a576cf2; ppj_get(payload jsonb) 6e14e48d.
   - ppj_put checks only that the nonce starts "ppj-" and is at least 24 characters, slot 1 to 3, and response_text starts "{". It inserts with ON CONFLICT (nonce, slot) DO NOTHING (first reply wins), then deletes rows older than 3 days.
   - ppj_status returns the stored slot numbers for a nonce; ppj_get returns slot, provider, seat and response_text for a nonce.
2. Table ppj_replies: RLS on, no policy, no table grant to anon or authenticated. 39 rows; oldest 2026-11-16 22:02Z. Nonces seen are 42 characters, "ppj-<execution id>-<32 random characters>" (pkgPPJ README).
3. Callers over REST, Supabase edge logs, last 24 h (path, JWT role and user agent only; no key value read): ppj_put 9 calls, ppj_status 46, ppj_get 3, every one role anon, user agent n8n, HTTP 200. First 11-18 21:37Z, last 11-19 19:49Z. No other caller.
4. Callers inside the database: no other public function names ppj_ (prosrc search).
5. n8n, engine fetchback (ask494/w4/fetchback_a494a1_engine.json): Panel Judges Poll (rpc ppj_status) and Panel Judges Fetch (rpc ppj_get) use the header credential "Supabase Anon Key" (genericCredentialType httpHeaderAuth). The engine's write nodes already use "Supabase account" (predefined supabaseApi) since 494 A1, proven service_role by run 40891.
6. Store Reply (rpc ppj_put) is in the webhook workflow "WALL-2024 Panel Judge Call", with the "Supabase Anon Key" credential and 5 retries (pkgPPJ README). NOT READ LIVE by W3: W4 reads it back before the build.

Key fact:
As with 494, the engine itself calls these with the public key (item 3). A plain REVOKE would stop every panel judge reply. So: first the three nodes get the service credential, then anon loses EXECUTE.

Options:
A. (recommended) Two phases, the 494 pattern.
   A1. W4 switches only Store Reply, Panel Judges Poll and Panel Judges Fetch to the existing "Supabase account" credential (the one 494 A1 used). Touched nodes only; no wording, model or reasoning setting. Before the build, W4 reads back, by header NAME only, that none of the three sends its own apikey or Authorization header.
       Proof: the next run's edge logs show role service_role on rpc/ppj_put, ppj_status and ppj_get, and the panel judges' replies are collected (no ppj_transport error).
   A2. DB card (step499.sql): REVOKE EXECUTE on the three FROM PUBLIC, anon, authenticated. postgres, service_role and lab_seat keep it. Only after A1 is proven by a run.
B. A1 for Store Reply only and A2 for ppj_put only. Closes the forged reply, leaves anon reads of judge replies open. Not recommended: the same two cards close both.
C. Bind the nonce in ppj_put (for example a server-issued token per execution). A function body change and more moving parts; the nonce secrecy question (item 7 below) remains. Not recommended.
D. No build. The 32 random characters stay the only guard, and anyone may still fill the table with junk rows.

7. Exposure of the nonce (why the guard is weak). The nonce travels in the POST body to the Panel Judge Call webhook and sits in n8n execution data. A forged reply needs the nonce before the judge's reply is stored (often 100 s or more). NOT SEARCHED: whether the webhook needs authentication. If it does not, an outsider can also start provider calls through it (cost). That is out of this ASK's scope and is reported for a separate ASK.

NOT SEARCHED: the Cure Call (c7366RPLb8vdMQg6) and SX4Z (not readable by n8n MCP, 494 plan item 6); the edge logs show no ppj caller other than n8n in 24 h. Logs older than 24 h for ppj paths (W4 may read further back, as W2 did at 10048).

Not changed: no wording, model or reasoning setting; no function body; no table change.

## 4. CRITERIA and DONE
Before A1: W4 reads back, by name only, the credential on the three nodes and that none carries a node-level apikey or Authorization header; and that no other active workflow calls the three.
Before A2: one engine run after A1 whose edge logs show role service_role on ppj_put, ppj_status and ppj_get, with all 3 panel replies collected.
Before the A2 write: test499_rollback.sql passes in full.
- C1: anon ppj_put before: accepted (shows T1 can fail).
- T1: anon ppj_put after: refused 42501.
- T2: anon ppj_status after: refused 42501.
- T3: anon ppj_get after: refused 42501.
- T4: authenticated, each of the three: refused 42501.
- T5: service_role ppj_put, ppj_status, ppj_get: accepted, and the stored text comes back byte for byte.
- T6: after the step, anon and authenticated hold EXECUTE on none of the three.
- R1: after the revert, the EXECUTE grantees of all three equal today's, compared without regard to order.
- All test rows use a nonce "ppj-test499-..." and are rolled back.
Revert: restore each function's ACL as read today (item 1).
Done: step499.sql's closing checks pass, the audit row is written, two non-writers read it back, and the next run's panel replies are collected with no 42501.

## 5. WRONG-IF
1. A2 runs before A1 is proven: Store Reply fails 42501 after its paid provider call, every slot reaches Collect as a transport error, and the run's panel fails.
2. One of the three nodes sends its own anon apikey or Authorization header, overriding the credential. The A1 readback rules it out.
3. Store Reply's workflow differs from the README (another node or credential). W4's live read is the source, not the README.
4. A caller outside this SEARCH uses the three as anon.

## 6. RUN EVIDENCE
For A1: the next engine run's edge logs show JWT role service_role on rpc/ppj_put, ppj_status and ppj_get. For A2: the following run collects all 3 panel replies with no 42501. A log read by path and role only; no new ASK 417 registry case.

## 7. INPUTS IN GIT
plan499.md in /mnt/project-files/ask499/w3/ (git a499_w3/). step499.sql, revert499.sql and test499_rollback.sql by W4 after the plan passes. The commit hash is posted on the Wall.

## 8. STEPS
1. A1 node switch on the three nodes. Waits on: the operator's approval and W4's card.
2. Proving run. Waits on: the operator's release (it can be the next planned engine run; no separate paid run).
3. Rolled-back test. Waits on: the operator's approval prompt.
4. A2 write (step499.sql). Waits on: W4's card.
5. Readback by two non-writers. Waits on: step 4.
