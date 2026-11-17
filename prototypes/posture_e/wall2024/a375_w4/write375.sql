-- ASK 375 (W4; coordinator 14:27 CST 11-17; W2 Wall 7839, W4 7836 B): seat bars in the two record functions follow s253.
-- Self-checking: refuses unless each function is byte-for-byte the version read 14:27 CST (md5) and each anchor occurs once.
DO $ask375$
DECLARE d text; o1 text := $o1$'luna','haiku']; --$o1$;
  n1 text := $n1$'luna','haiku','hydrogen','gemini','argon','spark','ernie','ember','sonnet']; -- ASK 375: the reserve and alternate seats of ORDER0 on s253 (operator 13:16 and 13:55 CST 11-17; W2 Wall 7839);$n1$;
  o2 text := $o2$AND v_alt <> 'haiku' /* pkgJGR rev 6: haiku exempt from G1 (operator 08:34Z 11-09) */$o2$;
  n2 text := $n2$AND NOT (v_af = 'anthropic' AND v_deb_f <@ ARRAY['anthropic']::text[]) /* ASK 375: a Claude judge only when both debaters are Claude (operator 14:09 CST 11-17); replaces the 11-09 haiku exemption */$n2$;
BEGIN
  SELECT pg_get_functiondef('public.odv1_record_panel_substitution(uuid,jsonb)'::regprocedure) INTO d;
  IF md5(d) <> '8bdd47020bc6f6dc2d95cb87c4ea10b3' THEN RAISE EXCEPTION 'ASK 375: odv1_record_panel_substitution changed since read (md5 %)', md5(d); END IF;
  IF (length(d) - length(replace(d, o1, ''))) / length(o1) <> 1 THEN RAISE EXCEPTION 'ASK 375: substitution anchor count'; END IF;
  EXECUTE replace(d, o1, n1);
  SELECT pg_get_functiondef('public.odv1_record_panel_alternates(uuid,jsonb,jsonb)'::regprocedure) INTO d;
  IF md5(d) <> '9e4b649dd633c5662b02c778960eece5' THEN RAISE EXCEPTION 'ASK 375: odv1_record_panel_alternates changed since read (md5 %)', md5(d); END IF;
  IF (length(d) - length(replace(d, o2, ''))) / length(o2) <> 1 THEN RAISE EXCEPTION 'ASK 375: alternates anchor count'; END IF;
  EXECUTE replace(d, o2, n2);
END $ask375$;
