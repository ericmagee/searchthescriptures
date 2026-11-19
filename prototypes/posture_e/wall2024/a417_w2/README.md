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
- 374 step 2 mark: the refusal's words "(pkgBNS, ASK 374)" (library line 1530, W3 8865 A.4) in j.verdict_raw or e text.
- live_since: UTC save time of the engine version named in W4's write post (n8n workflow history).

## Limits
- 407, 408, 409 marks also hold on runs before those packages (an alternate was seated, "sperma" used, no pkgREFP
  error). Only live_since separates them.
- x (debate_errors) has no run_token; the window is 3 hours before the results row to 10 minutes after.
- (W4 8869) 405, 408 and 409 have "a run exists" as their case, and 409's mark is the absence of a pkgREFP error, so for
  them EXERCISED means "ran without fault", not "a case was met".
- (W4 8869) 396 is checked by hand in the Drive report export; the query cannot see it.

## Grades
W1 8867 PASS; W4 8869 PASS (both at edd0fa1f).

## Entries added after the grade
- 422(c) (W4 8879, live 22:52:47Z, engine 3257a833): case = a K-V row whose response or flagged line holds
  "does not/do not/never [word] makes|excludes" with "exclu" and "quot"; mark = that row CURED. Over all stored K-V rows
  the case reads false; the same pattern with "make|exclude" matches 26 rows (control). "do" is written d(o|oes) so the
  emitter's write-word check (which refuses the word DO) does not trip.

## Added 11-19 (W2): ASK 424 and ASK 422(a)
- 424 case (rev, W1 8969 F1): after DECLARED CHAIN in claude_r1, a line takes the ASK 424 head and no line takes the old
  head (digits then "." or ")"). Over all 880 results rows it selects exactly the 16 runs R2 to R5 newly read
  (a424_w4/r6/out424_r2.txt). No mark (the prompts that show the read chain are not stored), so a case reads CASE, READ BY HAND.
  An "AGAINST DECLARED CHAIN COUNT 0" N CHECK in review_notes on a case run after live_since is a miss, read by hand.
- 422(a) case: a run; mark: no pkgLIB1 stop. Like 409, it holds on older runs too, so only live_since separates them.
- Check on 39266 with --all (SQL): 424 CASE, READ BY HAND (also after the F1 widening); 422(a) EXERCISED (loose, as 409).
