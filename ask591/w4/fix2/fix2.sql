-- ASK 591 fix 2 (W4): the dashboard save failed with "DELETE requires a WHERE clause" (code 21000).
-- Cause: odv1_judge_order_save clears the table with a bare "DELETE FROM odv1_judge_order;". The dashboard's
-- database role runs with the safeupdate guard, which refuses a DELETE with no WHERE; the save rolled back
-- whole, so nothing changed (version stays 1, 8 rows). My SQL-editor tests do not load that guard, so T3 missed it.
-- Fix: one line, "DELETE FROM odv1_judge_order WHERE true;". Exact text replacement of the live definition (md5 f0dae4d1...).
DO $d$
DECLARE f text := pg_get_functiondef('public.odv1_judge_order_save'::regproc);
  a text := '  DELETE FROM odv1_judge_order;';
BEGIN
  IF md5(f) <> 'f0dae4d180609a2b0f15778299dd3ca7' THEN RAISE EXCEPTION 'odv1_judge_order_save is not the ASK 591 text; nothing changed'; END IF;
  IF (length(f) - length(replace(f, a, ''))) / length(a) <> 1 THEN RAISE EXCEPTION 'anchor not found exactly once; nothing changed'; END IF;
  EXECUTE replace(f, a, '  DELETE FROM odv1_judge_order WHERE true;');
END $d$;
