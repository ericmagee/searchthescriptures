-- BB-6904 (g), step 7 undo: everything migration7.sql adds, removed. Run before 5B's undo if both are undone.
BEGIN;
DROP VIEW IF EXISTS public.odv1_drv_removals;
DROP FUNCTION IF EXISTS public.odv1_record_panel_alternates(uuid, jsonb, jsonb, boolean);
DELETE FROM public.model_config WHERE seat IN ('alt_haiku', 'alt_minimax');
ALTER TABLE public.debate_results DROP COLUMN drv_removed;
COMMIT;
