-- local test only: the live table shape (information_schema, 2026-11-13) with its PK and CHECK
DROP TABLE IF EXISTS public.table_snapshot_queue;
CREATE TABLE public.table_snapshot_queue (
  id integer PRIMARY KEY, table_name text, operation text, changed_row jsonb,
  triggered_at timestamptz, exported_at timestamptz, status text,
  actor text, CONSTRAINT table_snapshot_queue_status_check CHECK (status = ANY (ARRAY['pending','exported','failed'])));
