# ASK 466 step 2 draft (W4). NOT APPLIED. Built offline on live fetches 11-19 ~14:30Z.

## 2a. Three n8n nodes (restw.py, one card; each workflow one write; base versions below)
| workflow | id | base version | node |
|---|---|---|---|
| TRUTH — Daily Drive Sync | ABtaFpBlEuCc0ZFl | 19a02b5b | Log Sync |
| TRUTH — Every-3-Day Orphan Tables Snapshot | ROh4Px5Eap2tGKIc | b4c71d9e | Log Orphan Snapshot to audit_log |
| TRUTH — Every-3-Day SQL Snapshot | YWk9m3grughoRpWi | 12e28dd7 | Log Snapshot to audit_log |
Each node, the same change (before/after in step2_nodes.json, public key masked):
- remove the header "Authorization: Bearer <public JWT>";
- keep headers apikey (public), Content-Type, Prefer;
- add authentication = genericCredentialType, genericAuthType = httpHeaderAuth, credentials.httpHeaderAuth = Supabase_Service_Role (pXKaH407uaHabRxo).
Only that node changes in each workflow (checked: other nodes byte-equal); body, URL, method unchanged.
ASSUMPTION TO PROVE FIRST (T6a): the credential's one header is "Authorization: Bearer <service_role key>". Its value is not readable
through the API. If its header is "apikey" instead, keep Authorization out and drop our apikey header; T6a decides which.

## 2b. tools/audit_row.py (a466_w4/audit_row_step2.py; diff in the plan post)
- KEY from env SUPABASE_SERVICE_KEY only; the publishable default is removed.
- With no key: prints the hand SQL and exits 3 (fatal) or returns None, as on any failure today; never silent.
- The operator supplies the key to W4's container; never written to repo, memory or a post.

## 2c. database
REVOKE EXECUTE ON FUNCTION public.log_audit_event(text,text,text,date), public.complete_session_close(text,text),
  public.complete_security_check(integer,text) FROM anon, authenticated;   -- service_role, postgres, lab_seat keep it
(no PUBLIC grant exists on these three; acl read 14:25Z)

## Order and tests (branch)
T6a: one GET with only the credential to a service-only probe (anon denied) on the branch: proves the header and role.
T6b: the 3 nodes, run once each against the branch URL: rows written as service_role.
T6c: after 2c, log_audit_event as anon: denied; audit_row_step2.py with the service key: row written; without: exit 3 with hand SQL.
Live order: 2a and 2b first (both still work before 2c, since service_role already executes log_audit_event), then 2c.

## Rev 1 (11-19 09:05 CST, after W2 9520)
- C-1: 2c revert written as revert2c.sql (anon on all three; authenticated on log_audit_event).
- C-2 / T6a: the httpHeaderAuth credential Supabase_Service_Role (pXKaH407uaHabRxo) has never been proven: BB-4367 dropped its node B.
  The proven credential is the native "Supabase account" (supabaseApi, 0Ap4HeISSH05ZS9s): proof run 23760 on 2026-10-02 (BB-4414, BB-4416),
  GET audit_log_b4_probe (service-only) returned 200 with one row; gateway log showed apikey and Authorization both service_role, node had no own headers.
  PROPOSED 2a: use authentication predefinedCredentialType, nodeCredentialType supabaseApi, credential 0Ap4HeISSH05ZS9s, and remove the node's own
  apikey and Authorization headers (keep Content-Type, Prefer). T6a is then the existing proof; a fresh proof needs a temp workflow (a system change, card).
