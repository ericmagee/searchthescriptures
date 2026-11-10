# pkgEHL (W3): the judge enforcer's record step reads an answer line that has lost its "ENFORCER:" head

Built 10:31 CST 2026-11-10 on live s108, offline. NOT WRITTEN. Assigned by the coordinator after my scan (Wall 4168, 4170). A write needs two non-builder grades (W1, W2) and the operator's own word.

## What it does
The record step of the judge enforcer (Judge Enforcer Record and its two alternate copies) reads a reply line only when it starts "ENFORCER:". A line that starts with its id ("Y6.1 -- DISAGREE -- RIGHT: OVERSTATED -- ...") or with a list mark before it is not read and the row is left NO VERDICT. pkgEHL puts the head back before the existing patterns run:
`.replace(/^(?:[-•>]\s*)?(?:ENFORCER\s*:\s*)?(?=[A-Z]\d+(\.\d+)?\s*(--|[(,—–]))/i,'ENFORCER: ')`
The line must still pass the unchanged pattern (an id letter of the rule set, then AGREE, DISAGREE or NO ANSWER). Nothing else changes.

## Size (measured)
- Shared Library 913,804 to 914,006: +202 code characters. Only the Shared Library node changes; all 42 stubs are byte-equal to live. No prompt text, no new call, no new log row kind.
- The rebuilt source changes in three nodes only, +94 each (the line is stored twice in the library: the alternates' pattern has one more id letter).

## What it changes in stored data, stated plainly
- Real headless lines in the stored replies: 3, all in debate 33815 (one call returned Y6.1, Y7.1, Y8.1 without the head).
- Rows changed by the fix across the 37 stored debates (Judge Enforcer Record) and 24 (Alt): 0. In 33815 the retry step already resent that call ("0 ENFORCER line(s) for 3 item ids") and the retry's lines stand, in live and with the fix.
- With the retry's reply taken away, live reads none of the three and the fix reads all three as written (DISAGREE, AGREE, AGREE).
- The lost send-back is shown on a PLANT, not in a stored debate: a real DISAGREE line of debate 34108 (B3.1, rule E-ANS) with its head removed reads NO VERDICT in live and DISAGREE with the fix. One uncovered id does not start the retry (it needs two or more), so in live that send-back would not be made. W2's hand reading (Wall 4173): in 33815 the first reply's DISAGREE on Y6.1 was false and the retry's AGREE right, so no true send-back was lost in stored data.

## Limits
1. The retry step (Judge Enforcer Retry Build) is not changed: it still counts only lines with the head, so a reply with two or more headless lines is still resent, and the retry's lines stand. The fix acts where no retry is sent (a single headless line) or the retry fails.
2. The debater enforcer (Enforcer Record, rules K-W and K-S3) is not in the Shared Library and is not changed; no headless line was found in its 1,804 stored lines.
3. A headless line whose first word is a seat name ("sol (B3.1) -- ...") is not covered; none was found.

## Build
1. `node pkgEHL/build_EHL.cjs strip` (pkgLIB/strip_R1 to pkgLIB/strip_R1_EHL, one edit in three sources)
2. `FB=/mnt/project-files/wall2024/fetchback_live_s108.json node gate/pack.cjs pkgLIB/strip_R1_EHL pkgLIB_R1_EHL`
3. `node pkgEHL/build_EHL.cjs write /mnt/project-files/wall2024/fetchback_live_s108.json pkgEHL/parent_s108_EHL.json`
Write file: pkgEHL/parent_s108_EHL.json. pkgRLF rev 2 changes only Close Enforcer Record and pkgEHL only the Shared Library; if rev 2 is written first, step 3 is rerun on the new fetch-back and the library is the same. pkgCMS strips the library sources: whichever of pkgCMS and pkgEHL is written second is rebuilt on the other.

## Tests (pkgEHL/test_EHL.cjs, output test_EHL_out.txt): ALL OK, 20 checks
- T1 structure and size. T2 every stored debate equal to live (37 and 24).
- T3 plants P1 to P13 on the real line of 34108: no head, list dash, bullet, bold id, seat beside the id, en dash: read. Not read, as before: a quoted judge line without a verdict word, an id letter outside the rule letters, a sentence that only starts like an id, an id the call does not hold. A headed line followed by a headless one on the same id: the later stands, as two headed lines do today.
- T4 debate 33815 with and without the retry.

## Engine manual part (enters on write)
Judge enforcer answer lines (pkgEHL): Judge Enforcer Record and its alternates read an answer line that lacks the "ENFORCER:" head or carries a list mark before it, when the line starts with an item id and a separator. The verdict pattern is unchanged. The retry step still counts only headed lines.
