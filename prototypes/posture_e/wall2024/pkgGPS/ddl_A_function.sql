-- pkgGPS part A: get_pending_snapshots picks its rows ONCE. The rows it marks exported are exactly the rows it returns.
-- Before: a SELECT ... ORDER BY triggered_at LIMIT n returned the rows, and a second, separate subquery with the same ORDER BY and LIMIT
-- chose the rows to mark. triggered_at has ties (live: 7,043 tie groups, 27,104 rows, largest 1,084), so at a batch edge inside a tie
-- group the two choices are not bound to agree. Now: one UPDATE ... RETURNING over rows chosen once, ordered by (triggered_at, id),
-- locked FOR UPDATE SKIP LOCKED so two overlapping calls never take the same row. Signature, return shape (the same five keys per row),
-- SECURITY DEFINER and search_path are unchanged; CREATE OR REPLACE keeps the owner and the grants.
CREATE OR REPLACE FUNCTION public.get_pending_snapshots(p_limit integer DEFAULT 50)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
DECLARE
  v_rows JSONB;
BEGIN
  WITH picked AS (
    SELECT id
    FROM table_snapshot_queue
    WHERE status = 'pending'
    ORDER BY triggered_at ASC, id ASC
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED
  ), marked AS (
    UPDATE table_snapshot_queue q
    SET status = 'exported', exported_at = now()
    FROM picked
    WHERE q.id = picked.id
    RETURNING q.id, q.table_name, q.operation, q.changed_row, q.triggered_at
  )
  SELECT jsonb_agg(row_to_json(m) ORDER BY m.triggered_at, m.id)
  INTO v_rows
  FROM marked m;

  RETURN COALESCE(v_rows, '[]'::jsonb);
END;
$function$;
