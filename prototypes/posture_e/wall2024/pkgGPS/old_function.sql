-- live get_pending_snapshots as read 2026-11-13 15:15 CST (pg_get_functiondef), for the local test only
CREATE OR REPLACE FUNCTION public.get_pending_snapshots(p_limit integer DEFAULT 50)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
DECLARE
  v_rows JSONB;
BEGIN
  -- Fetch pending rows
  SELECT jsonb_agg(row_to_json(q))
  INTO v_rows
  FROM (
    SELECT id, table_name, operation, changed_row, triggered_at
    FROM table_snapshot_queue
    WHERE status = 'pending'
    ORDER BY triggered_at ASC
    LIMIT p_limit
  ) q;

  -- Mark them as exported
  UPDATE table_snapshot_queue
  SET status = 'exported', exported_at = now()
  WHERE status = 'pending'
    AND id IN (
      SELECT id FROM table_snapshot_queue
      WHERE status = 'pending'
      ORDER BY triggered_at ASC
      LIMIT p_limit
    );

  RETURN COALESCE(v_rows, '[]'::jsonb);
END;
$function$;
