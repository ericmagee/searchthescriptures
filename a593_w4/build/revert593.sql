SET LOCAL truth.session_id='session_01H1X3AP1fjeQaEbxPP9UEZH';
-- ASK 593 revert, database part: the haiku row back in dash_debaters, haiku back in the reserve recorder's list, the model_config row active.
-- (dash_debaters: re-run its definition with the row (6,'haiku','Haiku','haiku') between mimo and opus; saved before the write in write/predef_dash_debaters.sql.)
DO $m$ DECLARE d text; BEGIN d := pg_get_functiondef('public.odv1_record_panel_substitution(uuid,jsonb)'::regprocedure);
 IF strpos(d, $q$'luna','hydrogen'$q$) = 0 THEN RAISE EXCEPTION 'anchor missing'; END IF;
 EXECUTE replace(d, $q$'luna','hydrogen'$q$, $q$'luna','haiku','hydrogen'$q$); END $m$;
UPDATE model_config SET active = true WHERE seat = 'haiku';
