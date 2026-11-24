-- ASK 594 write: the reserve recorder (odv1_record_panel_substitution) accepts qwen4max as the failed seat or the substitute.
-- Run in ONE execute_sql call, with SET LOCAL truth.session_id first. Refuses unless the live body md5 is the build base 58fb41afc2a7101b1e424037b73aae67.
-- Changes one array literal and its comment. Grants are kept (CREATE OR REPLACE). Revert: revert594.sql.
DO $d$ DECLARE f text := pg_get_functiondef('odv1_record_panel_substitution'::regproc); m text;
BEGIN
  SELECT md5(prosrc) INTO m FROM pg_proc WHERE oid='odv1_record_panel_substitution'::regproc;
  IF m <> '58fb41afc2a7101b1e424037b73aae67' THEN RAISE EXCEPTION 'ASK 594: live body md5 % is not the build base; NOTHING WRITTEN', m; END IF;
  IF position($o$'sonnet','sol62']; --$o$ in f) = 0 THEN RAISE EXCEPTION 'ASK 594: anchor not found; NOTHING WRITTEN'; END IF;
  EXECUTE replace(f,$o$'sonnet','sol62']; --$o$,$n$'sonnet','sol62','qwen4max']; -- ASK 594: qwen4max (ORDER0 and the alternate tail of the judge order) may be the failed seat or the reserve;$n$);
END $d$;
SELECT md5(prosrc), proacl::text, (prosrc ~ '''qwen4max''') has_q4m FROM pg_proc WHERE proname='odv1_record_panel_substitution';
