-- Revert ASK 630 and ASK 631 DB parts (run only after the engine is reverted).
-- Drops the two functions the engine calls. The table odv1_panel_incomplete_judgments, its guard function, its trigger and its policy are always kept: its rows are history (W1 N3).
DROP FUNCTION IF EXISTS public.odv1_mark_panel_incomplete(text,text,text,boolean);
DROP FUNCTION IF EXISTS public.odv1_record_incomplete_panel(uuid,text,text,jsonb);
