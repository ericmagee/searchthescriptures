# ASK 418 plan rev 1 (W4 plans and builds; W1 and W2 grade). Tools in git; no system change.

Assignment (W3 Wall 8826, from W4 8817 item 3 and W2 8820 item 3): (a) a reusable stored-row replay for code-only changes;
(b) the ASK 374 challenger path proven now with built facts, since no stored challenger fact exists.

## OBJECTIVE
A code-only change is shown on every stored row it reads, before its card, with one committed tool and one spec, so a grader reruns
one command instead of reading a new script each time. Expected effect: the ASK 374 challenger mirror is shown to refuse before any
run reaches it, and each later reader change carries the same EQUAL / CHANGED / NEWLY NON-EMPTY counts.

## (a) replay418.cjs: one tool in place of the per-ASK scripts (t422c, t423, t424, a374/stored, a376b/rp)
- Inputs: --base and --cand (two fetches of one workflow); --spec spec.json; --rows rows.json; --sql rows.sql (committed with the rows, ASK 414).
- spec.json names what to cut and how to call it:
  {"cut":[{"from":"node:<name>" | "lib:<MAP key>" | "lib:line", "names":["declared","dlinks"]}],
   "call":"<expression over the cut names and row>", "empty":"<expression: true when an output holds nothing>", "cases":[{"id","row","want"}]}
- Each named declaration (function, or const/let arrow or value) is cut by acorn from the base text and from the candidate text alike;
  a name that is missing or found twice stops the tool. The cut code runs in a node:vm context with a time limit per call; it gets no $()
  and no network, so a reader that needs one is given a stub named in the spec.
- Output: per row, base and candidate results; counts EQUAL, CHANGED, NEWLY NON-EMPTY, EMPTIED; the lists of row ids per class;
  each case's result against its "want". Exit 0 only when every case passes and no row is CHANGED outside an "allow" list in the spec.
- Also prints: the sha256 of each cut text on both sides (so "copies identical" is a printed fact when one name is cut from several nodes).

## (b) ASK 374 challenger path with built facts
Today's plants (a374/plants.cjs) start at bnsRefuse2024 with facts given by hand. The built-fact proof starts upstream:
1. Assume Check Build on a built run: a stored run's rounds with one planted challenger premise in the list that Assume Check Build
   reads for the challenger side (vp4List(F.cr3,'CHALLENGER'), the UNSUPPORTED-L4 PREMISES list of cr3:
   "2. LINK 2 ... ASSUMES: Joseph begat Jesus ROWS GIVE: ..."). It must produce the challenger premise 2 check item.
2. Assume Check Record on a built checker reply to that prompt (BOTH NOT STATED). It must record the fact with side CHALLENGER,
   n 2, link 2, both_not_stated true.
3. Gate Build's bnsRefuse2024 with that record and a CHANGE TO "D4 vs C2: DEFENDER LINK BROKEN": REFUSED with the ASK 374 text;
   with "CHALLENGER LINK BROKEN" or "STANDS": applied (the mirror refuses only the defender-broken change).
4. The same three steps with a STATED reply: no fact, the change applied.
The model call between steps 1 and 2 is not made; the reply is built. Each step's code is cut from live with replay418.cjs (a), so (b) is
also (a)'s first use beyond the readers.

## DONE WHEN
1. (a) reproduces t424_out.txt DONE WHEN 1 and 2 counts (R1 to R5: 241, 229, 16 newly read) on the 424 base and target, and
   t422c's population replay counts, each from a spec file in git.
2. (a) stops on a name cut twice, a name missing, and a call over its time limit (planted).
3. (b) steps 1 to 4 pass on the live engine (version named in the output).
4. Specs, rows, SQL and outputs in git.

## Limits
(a) replays cut code only: nodes whose result depends on upstream node outputs need those outputs in the row (the gate/replay.cjs chain
replay covers library node chains). (b) proves code on built text; a run still has to show it live.
