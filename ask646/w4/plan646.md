# ASK 646 PLAN (W4), rev 0: the row says why each judge in the order was left out

Source: W4 Wall 12026 (cause and fix); the 42528 AAR (the row does not state why the Google judges were not seated); the coordinator's assignment, 06:26 CST 11-25.
Live base: engine ee4e389d. Child aad0ad9c (not touched). Record only: nothing here touches reasoning, a model setting, a token limit, a prompt, who sits, or what a seat is sent.

## 1. OBJECTIVE
The row's line "[JUDGE ORDER v<n>: panel list ...; alternates list ... | SEATED: panel ...; reserve ...; alternates ...]" names who sat but not why the others did not. In 42528 gemini, hydrogen, argon and neon are in the order and not seated, and the row gives no reason.
- Init Seats already records a reason for every seat it drops, in __DROP, at the point it drops it. Examples: "did not accept the posture", "is a debater", "not a panel seat", "family <f> debates in this debate", "runs the same model as a debater (...)", "not an OpenRouter seat", "removed for judge time".
- Init Seats outputs only the alternates' part (alt_dropped), and only Format Markdown reads it. Build Save Body writes the JUDGE ORDER line and reads neither.
Change: Init Seats outputs every order seat that was not seated, with its reason, and the JUDGE ORDER line ends with "; LEFT OUT: <seat> (<reason>), ..." or "; LEFT OUT: none".

## 2. ROLES
- Plans and builds: W4.
- Grades: W1.
- Writes: W4, on W4's card to the operator (engine).
- Reads back: W1. Manual entry and AAR rows: W3.

## 3. SCOPE, SEARCH, NOT SEARCHED
Change, two nodes:
1. Init Seats: one new output field, seat_left_out = for each seat of the order (panel list, then alternates list, in order) that is not in panel_order, not panel_reserve and not in alt_order: {seat, reason: __DROP[seat] or "not reached"}. "not reached" means the seat was eligible but the panel and lists were already full. The seating code and every other output field are unchanged.
2. Build Save Body: in the JUDGE ORDER line builder, after the alternates part, append "; LEFT OUT: " + the list "<seat> (<reason>)" joined by ", ", or "none". A seat or reason is passed through the same bracket-safe replace the line's other parts need: "[" and "]" removed.
- Tagged ASK 646.
Not changed: alt_dropped and Format Markdown; the seating; the AGREEMENT lines; every other node.

SEARCH:
- __DROP is filled by __d(s, reason), first reason wins, at each filter of Init Seats: the agreement filter, the debater filter (free), the panel-family and same-model filter (pfree0), "sits on the panel", and the alternate filters (ALT_ORDER). A seat in panel_order is never left out. "is a debater" applies to a debater's own seat.
- Readers of the JUDGE ORDER line: the dashboard (not searched); Format Markdown builds its own text from alt_dropped. Nothing in the engine or the DB parses the line (to be confirmed by a text search in the build).
- With ASK 637 live, a family-barred seat is no longer asked to agree, so its reason is its family drop, as the line will show.

NOT SEARCHED:
- Dashboard pages that parse the JUDGE ORDER line. The new part is appended at the end, so a reader of the earlier parts is unaffected.

## 4. CRITERIA AND DONE
- C1. Replay Init Seats (old and new) on every pairing of the launch list with judge order v6 and the model_config_jfl rows (the 637 fixture), with every asked seat accepting. All old output fields are equal. Every order seat is in exactly one of panel, reserve, alternates or left out.
  - The 42528 pairing (hydrogen against spark): hydrogen "is a debater"; gemini, argon and neon "family google debates in this debate"; spark "is a debater" if it is in the order.
- C2. Replay Build Save Body's line on those outputs: equal to the old line plus the LEFT OUT part. Synthetic: a seat that did not accept the posture shows that reason; a seat with "[" in its reason prints without it.
- C3. Engine: only Init Seats and Build Save Body change; every other node byte-equal to ee4e389d; connections equal; standing 31/0; pair check PASSES; reg385 PASS.
- C4. ASK 599: tagged; no dead code; no new catch.
- DONE: W1 PASS on plan and build; operator presses W4's card; W4 writes; W1 reads back; two clean live runs (section 6).

## 5. WRONG-IF
- The plan aims at the wrong thing if a seat's stored reason is not why it was left out, for example a later filter that drops it after an earlier one already wrote a reason. Against that: __d keeps the first reason, and every filter runs in order on the survivors of the one before, so the first reason is the one that removed it. C1 checks that every listed seat is out of all three seat lists.
- A second wrong-if: the operator wants the reasons on the dashboard only, not in the row. The row is where the AAR looks, and the line already carries the order.

## 6. RUN EVIDENCE
- Case: every live run (the line is written on every run).
- Mark: the JUDGE ORDER line ends with a LEFT OUT part. Its seats and the seated seats together are the whole order, and each reason matches the pairing.
- Cost: nil. NO PROBE.

## 7. INPUTS IN GIT
ask646/w4/plan646.md (this file). The build goes in ask646/w4/b1/.

## 8. STEPS (each names its card)
1. W1 grades this plan (no card).
2. W4 builds and runs C1 to C4 offline (no card). W1 grades the build.
3. Card to the operator, from W4: "Write ASK 646 (the row says why each judge was left out)?"
4. W4 writes; fetch back; audit row; Wall post; W1 readback.
5. W3: manual entry and AAR rows.
6. Two clean live runs.
