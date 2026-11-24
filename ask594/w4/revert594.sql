-- ASK 594 revert: removes qwen4max from the reserve recorder's seat list (back to body md5 58fb41afc2a7101b1e424037b73aae67).
DO $d$ DECLARE f text := pg_get_functiondef('odv1_record_panel_substitution'::regproc);
BEGIN
  EXECUTE replace(f,$n$'sonnet','sol62','qwen4max']; -- ASK 594: qwen4max (ORDER0 and the alternate tail of the judge order) may be the failed seat or the reserve;$n$,$o$'sonnet','sol62']; --$o$);
END $d$;
SELECT md5(prosrc) FROM pg_proc WHERE proname='odv1_record_panel_substitution';
