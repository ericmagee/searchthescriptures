-- ASK 228: re-queue the 2 session_log rows marked exported at 13:00:28 CST 11-13 (execution 36648) with no Drive file (W4 Wall 5903).
-- Data write for W4 only, on Eric's word. Expect exactly 2 rows; they are older than every pending row, so the next run takes them first.
begin;
update table_snapshot_queue set status = 'pending', exported_at = null
 where id in (50356, 50424) and status = 'exported' and table_name = 'session_log'
   and exported_at = '2026-11-13 19:00:28.445034+00'
returning id, status, exported_at;
-- if the count is not 2: rollback;
commit;
