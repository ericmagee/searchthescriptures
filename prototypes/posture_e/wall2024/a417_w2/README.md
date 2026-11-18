# ASK 417 exercise query (build W2; plan W3 a417_w3/plan_rev1.md; grade W1, W4)

    node exercise.cjs <run_token>          # prints one read-only SQL statement
    node exercise.cjs <run_token> --all    # same, ignoring live_since (probe check on an older run)

Run the printed statement in the SQL editor. One row per registry entry: ask, title, grade, case, fired, live_since.
Grade words: EXERCISED, NO CASE, MISSED, NOT IN DB, NO PROBE (plan), plus three the build adds:
NOT LIVE (run older than live_since), CASE, READ BY HAND (case found, no mark defined), NO RUN (token not found).
The emitter refuses (exit 3) if the statement holds a write word.

## Results (run 22:36 UTC 11-18)
- 39266, default: EXERCISED 374 prompt (1), 404 (1), 405 (1), 407 (1), 408 (8), 409 (1); NO CASE 374 step 2, 376,
  394 s11, 399/402, 406; NO PROBE 400, 401, 403; NOT IN DB 396. Equal to the plan's DONE WHEN 1.
- 39015, default: every entry NOT LIVE (39015 finished 15:53Z; the earliest live_since is 17:48Z).
- 39015, --all: 399/402, 404, 405, 406 read MISSED (case present, mark absent before those packages); 407, 408, 409
  read EXERCISED: those three probes are loose and rely on live_since (see Limits).

## Sharpened or added (named on the Wall)
- 399/402 case: a v21 CORRECTED RESULT tag listing "RETRACTED: Dn vs Cm" (a plain "RETRACTED" also appears in
  statement text, e.g. glm_legal in 39266).
- 394 s11: no stored mark text is known; mark is null, so a case reads CASE, READ BY HAND.
- 374 step 2 mark: "ASK 374" in j or e text; the refusal's own wording is not yet seen in a stored row.
- live_since: UTC save time of the engine version named in W4's write post (n8n workflow history).

## Limits
- 407, 408, 409 marks also hold on runs before those packages (an alternate was seated, "sperma" used, no pkgREFP
  error). Only live_since separates them.
- x (debate_errors) has no run_token; the window is 3 hours before the results row to 10 minutes after.
