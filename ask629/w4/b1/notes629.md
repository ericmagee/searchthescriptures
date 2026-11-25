# ASK 629 BUILD (W4): a free reserve past a JFL-moved seat; a "returned no text" failure line

Plan: ask629/w4/plan629.md 2d000472 (W1 PASS WITH R1, N1, N2, Wall 11930). Eric pressed "Build it" at 04:35 CST 11-25.
Base: live engine 2df7f6fa, fetched 04:37 CST 11-25 (b1/base_eng.json dd0d770c); child aad0ad9c (b1/base_child.json e3fb0d4f, unchanged, not written).
Build: b1/b629.cjs. Target: b1/tg/target_engine_629.json. Tests: b1/t629.cjs. Fixtures: b1/fx/ (is_<run>.json holds the Init Seats inputs and stored output of each run; r42517.json holds the node outputs Init Seats, Resolve Seats and Panel Check read, for run 42517).

## THE CHANGE (two nodes, two lines, each tagged /* ASK 629 */)
- Init Seats: `const panel_reserve=pfree.slice(3).find(s=>JUDGE_TIME_REMOVED.indexOf(s)<0&&!JFL_MOVED.has(s))||null;`
  - Was: `(pfree.length>3&&JUDGE_TIME_REMOVED.indexOf(pfree[3])<0&&!JFL_MOVED.has(pfree[3]))?pfree[3]:null`.
  - When pfree[3] is eligible, the reserve is the same seat as before. When it is not, the next eligible seat is the reserve, where before there was none.
- Panel Check envelope(): placed just before the old generic throw, after every parse branch (W1 N1).
  - A reply with choices[0].message whose content is not a string now throws "FAIL-CLOSED: seat "<s>" returned no text: finish_reason <f>; output tokens <n> (reasoning <r>); prompt tokens <p>. NO ROW IS WRITTEN."
  - A field that is absent prints "not given".
  - Every other envelope is unchanged.
- No other node, no connection, no model setting, no reasoning setting, no library line. The node count stays 423; the connections are byte-equal.

## FINDING FOR THE WRITE CARD: no recent run has had a reserve
Every live run that can be replayed since ASK 591 had panel_reserve null, because pfree[3] was JFL-moved:
- 42373 and 42505: chatgpt. The new reserve is qwen4max.
- 42517: argon. The new reserve is sonnet.
- 42528: chatgpt. The new reserve is sonnet.
So under live code, a single failed panel judge fails the run closed in every one of these pairings. With ASK 629, each would have had a reserve.

## R1 AND a1 (alternates)
- alt_order and Resolve Seats' alternates are unchanged. On 42517 they stay [argon, sonnet, neon], so the reserve is also in the pool, as live already does whenever pfree[3] is the reserve.
- A reserve that substituted never also sits as an alternate: the alternate guard G3 (LIB 3291) refuses any model already on the panel. On the 42517 replay with sonnet substituted for hydrogen, G3 returns "anthropic/claude-sonnet-5.5 already sits on this panel".
- A reserve that was not used is still offered: the guard returns null.
- The count of seats does not change. The change only fills the reserve slot that Panel Check already handles (one substitution per run, line 45). I did not read the majority count code; nothing in the change touches it.
- DB: odv1_record_panel_substitution lists in v_seats every seat of judge order v6 (gemini, qwen4max, hydrogen, sol, sol62, spark, chatgpt, argon, sonnet, neon). It refuses a substitute that is already on the panel or is a debater, so any reserve the new rule can seat is accepted there.

## TEST RESULTS (tg/out_t629.txt: 39 PASS, 0 FAIL)
- A: Init Seats, base code against new code, on the stored inputs of 42528, 42517, 42505, 42373, 42283, 42234 and 42071.
  - The base code reproduces the stored Init Seats (panel, reserve, alt_order) on all four replayable runs.
  - On each of the four, only panel_reserve changes (from null to qwen4max or sonnet). The new reserve is never JFL-moved, time-removed or on the panel.
  - 42283 and 42234 refuse alike (topic missing; a regrade and a crash). 42071 predates ASK 591 (no Judge Order Read stored) and is skipped.
- A2: constructed from the 42517 inputs.
  - With no seat JFL-moved, or with argon not JFL-moved, pfree[3] = argon is eligible and the new output is byte-equal to the old (reserve argon).
  - With every seat after the panel JFL-moved, the new reserve is null, as before.
- C: replay of 42517.
  - Init Seats: old reserve null, new reserve sonnet.
  - Resolve Seats: the base reproduces the stored reserve (null) and alternates; with the new Init Seats it gives reserve sonnet (anthropic/claude-sonnet-5.5, 64,000).
  - Panel Check (live) throws exactly as stored, with "[no reserve seat is free]".
  - Panel Check (new) makes one substitution, slot 3, hydrogen to sonnet, kind no_usable_judgment, reason "empty reply", and does not throw.
- B:
  - The 42517 detail reads "returned no text: finish_reason length; output tokens 65,536 (reasoning 65,533); prompt tokens 75,848."
  - With no reserve, the new throw carries the same line plus "[no reserve seat is free]".
  - envelope() is byte-equal, old against new, on a string reply, an empty-string reply, a Gemini reply, a Gemini thought-only reply, an error object, an unknown envelope, an empty object, a choices entry with no message, and null.
- R1: both cases above PASS.
- Standing set: 31 PASS, 0 FAIL, with S4 compile-all on engine 290 and child 67 (tg/out_standing_629.txt).
- The library is not changed, so the library pair is unchanged.
- ASK 599: two changed lines, both tagged; no dead code; no catch added.

NOT RUN: a live run. The two live runs after the write show the reserve in the JUDGE ORDER line of review_notes ("reserve <seat>") wherever pfree[3] is JFL-moved, as it was in every recent pairing.

## MANUAL (for W3, its own card)
Part 10.0: "The reserve is the next seat unless it is JFL-moved or time-removed, in which case there is no reserve." becomes "The reserve is the first seat after the panel that is neither JFL-moved nor time-removed; if none is, there is no reserve." Part 10.0 also gains the "returned no text" failure line.
