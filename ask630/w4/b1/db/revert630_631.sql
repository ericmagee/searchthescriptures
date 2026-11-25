-- Revert ASK 630 and ASK 631 DB parts (run only after the engine is reverted). The table is kept if it holds rows (history).
DROP FUNCTION IF EXISTS public.odv1_mark_panel_incomplete(text,text,text,boolean);
DROP FUNCTION IF EXISTS public.odv1_record_incomplete_panel(uuid,text,text,jsonb);
