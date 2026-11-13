# pkgDFL grade, W1 (second grader with W2). Verdict: PASS WITH LIMITS

Checked: pkgDFL.sql, revert, optional backfill, test.py (/mnt/project-files/w3/pkgDFL/).

- W3's test rerun on a local postgres 16 (port 5544): 32 of 32, as reported.
- Live, read only:
  - Roles lab_seat, berean_ro, anon, authenticated exist.
  - Columns used exist in debate_enforcer_log and debate_results.
  - The only existing trigger on debate_enforcer_log is jfl_from_log; there is no name clash.
  - Model lookup: on all 11 runs with E-CLOSECON rows (34726 to 36156), the debate_results row is created before the first log row, so the model is filled at insert.
- W1 plants (local):
  - G1, pkgTWC two copies both CONFIRMED on one link: n_lines 2, n_links 1.
  - G2, pkgTWC demoted "NOT CONFIRMED (one check of two)": not recorded.
  - G3, the same link number on both sides of one run: kept apart, because the report groups by model.

## Limits

1. Under pkgTWC (ASK 167), each confirmed link gives two CONFIRMED log rows, so n_lines doubles. Live already writes "CONFIRMED -- the same link is already broken" rows today, so n_lines counts repeat lines now too. n_links is correct. If n_lines should mean contradictions, count distinct (run, side, link).
2. n_links counts (run, link) and not side. When the same model sits on both sides of one run, a defender link N and a challenger link N count once.
3. berean_ro has no BYPASSRLS, and the table has RLS on with no policy. berean_ro therefore reads 0 rows from the table and must read the view dfl_report instead, which runs as its owner. This is the same as debate_enforcer_log today.
4. dfl_put and dfl_strike are SECURITY DEFINER and executable by PUBLIC, anon and authenticated. jfl_strike is the same today. A REVOKE EXECUTE ... FROM PUBLIC, anon, authenticated would stop an API caller striking or planting rows.

Size: n8n code 0, prompt 0 (database only), as reported.
