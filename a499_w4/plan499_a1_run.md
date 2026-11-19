# ASK 499 A1 proving-run checks and A2 test, rev 0 (W4, seat 35, 11-19 ~15:15 CST), for grading by W1 and W2
Follows the ASK 494 A2 proving-run plan (ask494/w4/plan494_a2_run.md rev 1), which run 40891 passed (Wall 10044).

## 1. OBJECTIVE
Prove that ASK 499 A1 (Store Reply in Panel Judge Call Y1VIsNB6KBrs1znP, and Panel Judges Poll and Panel Judges Fetch in the engine, moved to the "Supabase account" credential) stores and reads panel judge replies as service_role. Then remove EXECUTE on ppj_put, ppj_status and ppj_get from PUBLIC, anon and authenticated (A2, step499.sql 73d82a72).
Expected effect: after A2, the public key can neither store nor read a panel judge reply, and every run still collects all 3 panel replies.

## 2. ROLES
Builder and writer W4. Graders W1 and W2. The A1 push and the A2 write each need a card pressed in W4's thread. The proving run needs the operator's explicit release; per plan499 section 8 it may be the next planned engine run, so no separate paid run is required. Readback by two non-writers.

## 3. SCOPE
SEARCH: Wall 10089 (live reads at 21:11Z: engine d491f4a5, Panel Judge Call 15a91429, the three nodes on "Supabase Anon Key" with no node headers; only these two of 196 workflows call ppj_; edge logs since 11-16 show only n8n as the caller, always anon).
The run: any live run of the engine after the A1 push, with no other engine change between the push and the run.
COST: none of its own if the next planned run is used. The rolled-back test and A2 cost nothing.

## 4. CRITERIA (read after the run; record the A1 push time T_A1 from the fetchback)
Q1. The run ends, and its debate_results row exists with outcome and the three panel judgments.
Q2. The edge logs from T_A1 to the run's end, read by request path, JWT role and user agent only (no key value), show role service_role on every call to rpc/ppj_put, rpc/ppj_status and rpc/ppj_get, and at least one call to each.
Q3. In the same window, no call to the three comes with role anon.
Q4. Every Panel Judge Call execution started in the run window ends in success, and its Store Reply node has no error (these executions are small and can be read node by node; status first, data only for Store Reply). The engine execution is read by status only; if its data is readable, Panel Judges Collect shows 3 replies and no ppj_transport error. If not, Q1 and Q2 stand in for it (as at 494 P4, W1 C1 at 10046).
Q5. ppj_replies holds 3 rows for the run's nonce (slots 1 to 3), counted by nonce prefix "ppj-<execution id>-" only; no response text is read.
Q6. Before the A2 card: the edge logs from T_A1 to that moment show no anon call to the three.
If Q1 to Q5 hold, A1 is proven. If any of the three calls shows anon, or a reply is lost: no A2. A1 is reverted by writing back live_engine_499.json (8197ec2e) and live_pjc_499.json (26ab0bac), on the operator's word.

## 5. A2 ROLLED-BACK TEST (before the A2 card, on the operator's approval prompt; W4 tells the operator first)
test499_rollback.sql (f169e22c), one DO block that ends in a RAISE, so all of it rolls back (W2 N2 at 10080):
- C1: anon ppj_put before the revoke is accepted (shows that T1 can fail).
- T1, T2, T3: anon ppj_put, ppj_status and ppj_get after the revoke: refused 42501.
- T4a, T4b, T4c: authenticated on each of the three: refused 42501.
- T5a, T5b, T5c: service_role ppj_put returns ok true; ppj_status returns [2]; ppj_get returns the stored text byte-equal, non-ASCII included.
- T6: no anon or authenticated EXECUTE is left on the three.
- R1: the grantees after the in-test re-grant equal those before, compared without regard to order, and the before list is printed (W2 N1: no PUBLIC).
On a timeout after approval, W4 reads the live grants and the postgres_logs RAISE text, as for 498.

## 6. WRONG-IF
1. Panel Judge Call cannot use the "Supabase account" credential (a different n8n project or sharing). The push or the first Store Reply fails. Then A1 is reverted for that workflow, and no A2.
2. A ppj caller outside the two workflows appears (Q3 or Q6 shows anon). Then A2 waits.
3. The run fails before the panel for an unrelated reason. Then it proves nothing, and another run is needed.

## 7. STEPS
S1 W1 and W2 grade the build (10089) and this plan. No card.
S2 A1 card in W4's thread; on the press, PUT both workflows, fetch back and compare with the targets (8ca5c722, 5b79316b), and record T_A1.
S3 The operator releases a run (explicit words), or the next planned run is used.
S4 W4 reads Q1 to Q5 and posts them; two non-writers check.
S5 Q6, then the rolled-back test on the operator's approval prompt.
S6 The A2 card in W4's thread; step499.sql via apply_migration with SET LOCAL session and card.
S7 Two non-writer readbacks. The next run after A2 collects 3 panel replies with no 42501.
