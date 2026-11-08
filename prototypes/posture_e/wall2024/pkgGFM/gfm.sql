-- pkgGFM: failure marker (feedback_rulings_2026-11-07 item 9, W2). A run whose grading dies after the rounds are saved leaves a debate_results
-- row with outcome NULL and no quarantine_reason (33322 out of memory, 33530 Panel Payloads error), so it reads like an unfinished run.
-- The watchdog marks such a row after 3 hours (the longest saved run is 72 min). It touches only rows created after the deploy cutoff,
-- never a row that already has an outcome or a quarantine_reason. Record-only: it removes no seat and changes no verdict.
CREATE OR REPLACE FUNCTION public.odv1_mark_grading_failed(p_cutoff timestamptz)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE n integer;
BEGIN
  UPDATE debate_results
     SET quarantine_reason = 'GRADING FAILED: the rounds were saved but no verdict was stored within 3 hours of the row (watchdog pkgGFM, '
                             || to_char(now() at time zone 'America/Chicago','YYYY-MM-DD HH24:MI') || ' CST). No verdict stands on this row.'
   WHERE outcome IS NULL
     AND quarantine_reason IS NULL
     AND created_at >= p_cutoff
     AND created_at < now() - interval '3 hours'
     AND claude_r1 IS NOT NULL;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END $f$;
-- Schedule (every 30 minutes). Replace the cutoff with the deploy time.
-- SELECT cron.schedule('odv1_grading_failed_watchdog', '*/30 * * * *', $c$SELECT public.odv1_mark_grading_failed('<DEPLOY TIME>'::timestamptz)$c$);
