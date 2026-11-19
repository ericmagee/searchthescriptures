# ASK 418 build (W4): stored-row replay, and the ASK 374 challenger path with built facts

Plan: a418_w4/plan_rev1.md (65ef20a6), graded W1 8927 (C1-C3, N1) and W2 8928 (W2-C1, W2-C2).

OBJECTIVE (plan rev 1): a code-only change is shown on every stored row it reads, before its card, with one committed tool and one spec,
so a grader reruns one command instead of reading a new script each time; and the ASK 374 challenger mirror is shown to refuse before
any run reaches it.

## Conditions
- W1 C1: a throw or a timeout on either side is its own class, ERROR, listed by row id; exit is non-zero unless the spec sets allow_error.
- W1 C2: "node:<name>" rebuilds a library-stub node from the Shared Library (tools/lib.cjs rb) before cutting; a plain Code node is read as
  written. Each CUT line says which ("stub rebuilt from the library", "plain Code node", "library MAP <key>").
- W1 C3: the claim is NARROWED to the two scripts reproduced here: t424 (R1 to R6, a424_w4/r6/) and t422c (specs/spec422c.json).
  t423, a374/stored and a376b/rp are not claimed.
- W1 N1: FREE NAMES are printed for both sides before any row runs.
- W2-C1: the (b) plant is in D3 Build's form, "STEP: ... -- ASSUMES: ... -- ROWS GIVE: ..." on its own line before PRESSED WITH:,
  ending in "--"; Assume Check Build reads ASSUMES as "<fact> --" (the trailing "--" the 374 Limits line names).
- W2-C2: the three negative cases are scenarios 3, 4 and 5 of b374.cjs.

## Commands
    node replay418.cjs --base A.json --cand B.json --spec SPEC.json --rows ROWS.json [--ms 2000] [--out OUT.txt]
    node replay418.cjs --base a422c/pre_eng.json --cand a422c/back_eng.json --spec specs/spec422c.json --rows specs/rows422c.json   # out/out422c.txt
    node replay418.cjs --base ENG --cand ENG_OUT --spec specs/plant_<missing|twice|timeout>.json --rows ../a424_w4/r6/rows_d1.json --ms 500
    node b374.cjs LIVE_ENGINE.json PRE374_ENGINE.json b374_stored.txt                                                          # b374_out.txt
- rows422c.json: the 1,600 lines of a422c/pop.json (judgment lines with "exclu", K-V lines, alternate lines), id = source-row-index.
- b374_stored.txt: run 39266 challenger round 3, LINK 2 block, first 1,452 characters (md5 88c2e566920b18f7931a103dda8e76ea, equal by SQL).
