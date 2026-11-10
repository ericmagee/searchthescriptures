# Grade of pkgCFP rev 1 (W1, commit d39212bc, on live s105): PASS on the code, four notes. Shelf only; no write is requested.
Grader W3 (non-builder). Written 02:34 CST 2026-11-10 (time read from the database). Claim Wall 4098.
What it does: each anti-cheat pair shown to the judges becomes a candidate for the DeepSeek contradiction check that runs after the panel
(node Judge Contradiction Build). The node that records the answer (Judge Contradiction Record) is unchanged.

## Checks that pass
- Rebuild: build_CFP.cjs on the live s105 fetch-back gives parent_s105_CFP.json node for node.
- Write file: 418 nodes; only Judge Contradiction Build differs from live s105.
- Size confirmed by my rerun of size_CFP.cjs: code 11,164 to 11,666 characters (+502). Prompt -27 characters in every existing call, plus the added
  candidate lines: +1,824 characters over 22 stored calls (largest +988). One new DeepSeek call in 1 of 46 stored debates (33644, 141,364 characters).
- W1's two tests rerun: outputs equal to the committed files (44 of 46 OK; the two exceptions are as W1 states: 33846 holds 3 distinct pairs in 6 rows,
  and 33530 has no saved panel bodies and fails on live the same way).
- My own scan of every stored anti-cheat record (34 debates, 35 REVERSED answers, 34 shown rows, 31 distinct pairs): 30 of 30 testable pairs become
  candidates that name the anti-cheat check, each with the right side and an earlier round where the quote stands; none dropped; in all 30 the closing
  quote passes the Record's own test. The 31st is 33530.
- Rolled-back insert of an E-CLOSECON row in the Record's shape: accepted, 1 row, rolled back. The package adds no new row shape.

## Plants (w3_cfp.cjs, 16 planted Anticheat Record inputs on 33644 and 34108)
As intended: defender pair (P1; Record confirms the planted CONFIRMED answer, one break, one log row); challenger pair with its DR rounds (P2); quote
standing in two rounds takes the first (P5); 2,000-character quote (P10); the same pair three times, once in other capitals, is one candidate (P11);
a quote holding a double quote mark is confirmed (P14); an Anticheat Record with no data, or rows with missing fields, leaves the output equal to live
but for the shortened sentence and does not fail the build (P8, P9); a pair equal to a judge's pair merges into one candidate (P15); a pair that
is a judge's pair with a shorter quote gives two candidates and the Record keeps one break for the link (P16).

## Notes
1. Silent drop (P3, P4). The anti-cheat check passes a quote with an ellipsis when each part of five words or more stands anywhere in rounds 1 to 3.
   pkgCFP re-tests the earlier quote with the enforcer's stricter test (all parts in one sentence of one round). A shown pair that fails it is not a
   candidate, and the node's output and the log hold no trace of it. Stored data: 0 of 35 REVERSED answers quote with an ellipsis, so this has not
   occurred. The README's label says each drop is reported; the test reports it, the node does not.
2. Closing quote with an ellipsis across two sentences (P6) does become a candidate; if DeepSeek copies it, the Record logs NOT CONFIRMED (form). So an
   ellipsis in the earlier quote drops the pair unseen, and an ellipsis in the closing quote keeps it. Same stored count: 0.
3. A pair the closing enforcer already answered before the panel is left out, as for a judge's pair (P13). The skip reason then reads "every judge-found
   pair was already answered before the panel" although the pair was found by the system, and no log row is written (same as live for judges).
4. A merged candidate reads "the judges' CONTRADICTION lines (chatgpt, the anti-cheat check)" (P15): the anti-cheat check is listed among the judges and
   the words "found by the system; both quotes checked" are not shown for it.
None of the four changes a result on stored data. Notes 1 and 2 are worth closing if this package is ever taken off the shelf.

## Not tested, as W1 states
What DeepSeek answers to these candidates. That needs a replay through the test relay; set C is the planned check.

## Effect to keep in view
The anti-cheat check is a trial that only marks. With pkgCFP a shown pair that DeepSeek confirms and the Record verifies breaks the link, under the
operator's contradiction rule. That is the purpose of the package, and it is a change of effect, not only of reporting.

## Files
w3_cfp.cjs, w3_cfp.txt.
