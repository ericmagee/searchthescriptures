# pkgGFM: failure marker (feedback_rulings_2026-11-07 item 9; W2)

Fault: when grading dies after the rounds are saved (33322 out of memory, 33530 Panel Payloads error), the debate_results row keeps outcome NULL and has no quarantine_reason. Nothing says the run failed.

Change: DB only, no n8n node. It is record-only: it removes no seat and changes no verdict.
- Function public.odv1_mark_grading_failed(p_cutoff) (gfm.sql). It marks rows with outcome NULL, quarantine_reason NULL, claude_r1 present, created at or after the cutoff and more than 3 hours old. The longest saved run is 72 min.
- The text written is: "GRADING FAILED: the rounds were saved but no verdict was stored within 3 hours ... No verdict stands on this row."
- Schedule: pg_cron every 30 minutes (pg_cron is installed). The cutoff is set to the deploy time, so no old row is touched unless the cutoff is set earlier on purpose.

Test (rolled back, with a pg_temp copy of the function so no DDL persisted):
- With a cutoff of 2026-11-06 it marks 7 rows: 33322, 33530, 33222, 33249, 33261, 33276 and 33055. All 7 have outcome NULL and no verdict stored.
- A second pass marks 0, so it is idempotent.
- Backfilling those 7 is a separate choice: set the cutoff to 2026-11-06 for the first call.

Write: DDL (one function) plus one cron.schedule. W4 writes it, with the session stamp. Revert: SELECT cron.unschedule('odv1_grading_failed_watchdog'); DROP FUNCTION public.odv1_mark_grading_failed(timestamptz);
