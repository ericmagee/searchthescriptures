-- ASK 375 revert: swap the two anchors back (each must occur once).
DO $r375$
DECLARE d text; o1 text := $o1$'luna','haiku']; --$o1$;
  n1 text := $n1$'luna','haiku','hydrogen','gemini','argon','spark','ernie','ember','sonnet']; -- ASK 375: the reserve and alternate seats of ORDER0 on s253 (operator 13:16 and 13:55 CST 11-17; W2 Wall 7839);$n1$;
  o2 text := $o2$AND v_alt <> 'haiku' /* pkgJGR rev 6: haiku exempt from G1 (operator 08:34Z 11-09) */$o2$;
  n2 text := $n2$AND NOT (v_af = 'anthropic' AND v_deb_f <@ ARRAY['anthropic']::text[]) /* ASK 375: a Claude judge only when both debaters are Claude (operator 14:09 CST 11-17); replaces the 11-09 haiku exemption */$n2$;
BEGIN
  SELECT pg_get_functiondef('public.odv1_record_panel_substitution(uuid,jsonb)'::regprocedure) INTO d; EXECUTE replace(d, n1, o1);
  SELECT pg_get_functiondef('public.odv1_record_panel_alternates(uuid,jsonb,jsonb)'::regprocedure) INTO d; EXECUTE replace(d, n2, o2);
END $r375$;
