-- Revert panel rev 4 rows (after the code revert).
DELETE FROM model_config WHERE seat='sol62';
DO $r4$
DECLARE d text; o text := $o$'ember','sonnet']; -- ASK 375:$o$; n text := $n$'ember','sonnet','sol62']; -- panel rev 4: sol62 (operator 14:47 CST 11-17); ASK 375:$n$;
BEGIN
  SELECT pg_get_functiondef('public.odv1_record_panel_substitution(uuid,jsonb)'::regprocedure) INTO d;
  IF (length(d) - length(replace(d, n, ''))) / length(n) <> 1 THEN RAISE EXCEPTION 'revert rev 4: anchor count'; END IF;
  EXECUTE replace(d, n, o);
END $r4$;
