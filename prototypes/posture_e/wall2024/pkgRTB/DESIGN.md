# pkgRTB design: one rule table, K-W family first (tracker D50; W2, 11-08)

Approved redesign item 1 (Eric 07:42 CST 11-08, Wall 3161): one rule table; one rule family per gap (K-W first, then retractions,
then "unanswered"); byte-match on all saved runs before each switch. Absorbs pkgKWF. Design posted on the Wall before building (W3 3167).

## What drifts today (live s63 df871acd, read from fetchback_live_s63.json)

K-W has 16 hand-kept copies in 12 nodes. They do not agree:

| Where | Copies | Forms it gives | Drift |
|---|---|---|---|
| Judge agreement ("For every withdrawal or concession ... (K-W), I answer in one of three forms") | 11 nodes: Panel Build, Reserve Build, Accept Build, Accept Check, Accept Return Build, Accept Final, Accept DS Return Build, Enforcer Build, Judge Enforcer Build, Alt JEB, R2 Alt JEB; plus 1 string copy in Shared Library | STANDS, CONCEDED, REASSERTED | NOT HELD missing |
| Audit marks v30 / v31 (Shared Library) | 2 | STANDS, CONCEDED, NOT HELD (quotes 6 words) | REASSERTED missing |
| Cure ask (Shared Library) | 1 | STANDS, CONCEDED | REASSERTED, NOT HELD missing from the K-W sentence; and it says "K-W is a TRIAL rule: an item left unanswered removes no seat" while ENF_STATUS has 'K-W':'LIVE' and the audit mark says LIVE. Judges are told the wrong stake. |
| DeepSeek RULE K-W (Enforcer Build, Alt JEB, R2 Alt JEB) | 3 | all four | NOT HELD "with a reason"; the reader needs a reason that QUOTES the flagged sentence (6 words in a row) |
| Cure reader (Shared Library, the source of truth) | 1 | kwSt (STANDS WITHOUT IT because + [L1-3]), kwCo (CONCEDED), kwRe (REASSERTED IN <round> "<quote>"), NOT HELD + 6-word run (KW_NH) | none |

Side note: /mnt/project-files/w3/judge_requirements_status.md (11-05) still lists K-W as Record only.

## Design

1. **Table.** A delimited block in the Shared Library, `/*RTB:BEGIN*/ ... /*RTB:END*/`, plain data plus small render functions:
   `RTB2024.KW = {status: from ENF_STATUS['K-W'], forms: [{id, text, reader, example}, x4], render: {agreement, audit, cureAsk, enforcer}}`.
   - forms are copied from the reader, in reader order: STANDS WITHOUT IT because <layer> (with [L1], [L2] or [L3]); CONCEDED;
     REASSERTED IN <round> "<quote>"; NOT HELD with a reason that quotes the flagged sentence (six words in a row, or all of it when shorter).
   - each form has a reader id (kwSt, kwCo, kwRe, KW_NH) and one example line the reader must accept.
   - status is read from ENF_STATUS, so the cure ask's LIVE/TRIAL sentence can no longer disagree with the engine.
2. **Library nodes** (Shared Library users) call the render functions directly for the audit marks and the cure ask.
3. **The 11 non-library prompt nodes** read only the RTB block: `$('Shared Library').params.jsCode`, slice between the markers, `new Function`.
   This is the mechanism the pkgLIB stubs already use live (31 nodes). Each gets the `if(false){$("Shared Library")}` line so the task runner
   sends it. Fail-closed: if the block is missing or does not parse, the node throws (no silent fallback to old text).
4. **Conformance test (feeds W1's pkgFCT):** for each form, the example passes its reader and fails the other three; every rendered copy names
   exactly the table's forms; no node's code still holds a hand-kept K-W form sentence (grep for "in one of three forms" and the old audit text).
5. **Replay bar before the switch:** all saved runs, all touched nodes, live vs patched. Expected: only prompt text changes (the four strings
   above); cure outcomes (CURED/UNCURED per item) and removals byte-equal, since the reader is untouched. Any outcome change is a FAIL.

## Not in this package

- The reader itself (no change). Retractions and "unanswered" families: next gaps, same table.
- Whether a judge who answers NOT HELD under the agreement wording (which never offered it) should be graded differently: no change; the reader
  already accepts it.

## Ask

ASK 1 (W3): confirm K-W LIVE is current (ENF_STATUS 'K-W':'LIVE'), so the table renders "LIVE rule: removes the seat" into the cure ask.
