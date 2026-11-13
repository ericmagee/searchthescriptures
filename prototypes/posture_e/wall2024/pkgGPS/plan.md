# pkgGPS: get_pending_snapshots picks its rows once (part A); anon and authenticated lose EXECUTE (part B, separate choice)

## Fault
The live function runs two statements: a SELECT ... ORDER BY triggered_at LIMIT n that builds the returned rows, then an UPDATE whose
own subquery (same ORDER BY and LIMIT) chooses the rows to mark exported. Each statement takes its own snapshot (READ COMMITTED), and
triggered_at defaults to now(), the inserting transaction's START time. A queue row committed between the two statements with an
earlier triggered_at is marked exported without being returned (never reaches Drive), and one returned row stays pending (saved twice).
Ties (live: 7,043 groups, 27,104 rows, largest 1,084) leave the order inside a group undefined, so the two choices are not bound to agree.

## Change (ddl_A_function.sql)
One UPDATE ... RETURNING over rows chosen once, ORDER BY (triggered_at, id), FOR UPDATE SKIP LOCKED. Signature, five keys per row,
SECURITY DEFINER, search_path unchanged. CREATE OR REPLACE keeps owner and grants. No table change. Workflow unchanged.

## Size (MEASURED, local PG16)
prosrc 617 -> 572 (-45); pg_get_functiondef 816 -> 785 (-31). Workflow +0.

## Tests (test.sh, test_out.txt, 13/13, local throwaway server; nothing written live)
- Drain of 5,321 rows (one tie group of 1,084, 300 small groups, shuffled heap) at 100 per call: per call returned = marked; every row once; order triggered_at then id.
- Same keys as the old function; empty queue returns [].
- Two concurrent calls of 500: disjoint, 1,000 marked = 1,000 returned.
- Gap: old function with a 2 s pause inserted between its statements (instrumented copy) and a row committed in the gap with an earlier
  triggered_at: 1 row marked but not returned (lost), 1 returned but left pending. New function, same timing: 0 and 0.
- Reported, not a pass: the old function WITHOUT a concurrent commit gave returned = marked on all calls of the same tie drain. The
  tie risk alone did not reproduce here; the demonstrated loss needs a commit inside the gap (live: whether one has happened is unmeasured).

## Part B (ddl_B_grants.sql): REVOKE EXECUTE FROM anon, authenticated
Live proacl gives anon and authenticated EXECUTE on a SECURITY DEFINER function that reads and marks protected rows. Before applying,
W4 confirms the snapshot workflow's Supabase credential is service_role. Revert: GRANT EXECUTE ON FUNCTION public.get_pending_snapshots(integer) TO anon, authenticated.

## Plan to done
1. Two non-builder seats grade (W3, W4): re-read live pg_get_functiondef (unchanged since the 15:15 CST read), read the table's CHECK and triggers, run test.sh.
2. Ask to Eric with the 20-minute snapshot schedule proposal (Wall 5961): A, B, schedule are separate choices.
3. On his word, W4 applies A (and B if chosen), reads back pg_get_functiondef and proacl.
4. Revert: old_function.sql (CREATE OR REPLACE); B by the GRANT above.
5. Live check: next snapshot run; rows marked exported at that run's exported_at = rows the run's Build Snapshot Content received; Drive files present.
6. Done when live and that run checks clean.
