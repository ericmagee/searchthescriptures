# W3 study: luna's two uncured items in execution 34626 (dry regrade of debate 34108 on s110)
Written 12:09 CST 2026-11-10 (database clock). Findings only, no build. Script g5_form.cjs, output g5_form_out.txt.

## Item 1: send-back item S12, rule E-UNG (missing collision grade), link D3
- The item: the challenger presses D3 in the list that closes [DR2]; luna's COLLISION POINTS had no graded D3 line. The engine asked for
  "D3 vs C<j> (<verse>): DEFENDER LINK BROKEN | CHALLENGER LINK BROKEN | UNDERDETERMINED ... A KEEP does not cure this item."
- luna's reply: "SENDBACK: S12 || CHANGE TO: D3 vs C3 (Matthew 1:16): STANDS -- the narrowed claim that Jesus was born of Mary fits the verse's 'of whom' and the angel's 'born of thee.' -- GROUND: [L1] Matthew 1:16 ... | [L3] Luke 1:35 ..."
- Engine: UNCURED, "the CHANGE TO has no graded D3 vs C<j> line". The reader (GRADED1) takes only DEFENDER LINK BROKEN, CHALLENGER LINK BROKEN, UNDERDETERMINED or WITHDRAWN AFTER. STANDS is not a grade for a pressed link, by design (pkgUND).
- Reading: TRUE judge failure. The three grades were named and luna wrote a fourth. On the same kind of item for D2 (S11) and D5 (S13) she wrote UNDERDETERMINED and was cured.
- Stored runs (measured, debate_enforcer_log): luna has 67 rows in 2 debates and no E-UNG row. All judges: 23 E-UNG send-back rows (gemini 19 cured, terra 1 cured and 2 uncured, sol 1 uncured); none answered with a STANDS line. So this failure is new: 0 earlier cases.
- Countermeasure: exists and worked (E-UNG is enforced, counted, and removed luna). Nothing is missing in code.
  One wording point: the item text says 'A "D3: STANDS" line does not grade a pressed link', which names only the bare form; luna wrote "D3 vs C3 (...): STANDS". The smallest change, if wanted, replaces those words with 'A STANDS line does not grade a pressed link' (9 characters fewer per item, estimate). Not shown that it would have changed luna's answer.
  Open, not resolved by me: the same send-back message offers "a STANDS line that quotes the answer's positive fit" as a valid change in the E-HOLD rule text on UNDERDETERMINED lines, so STANDS is offered in one item and refused in another.

## Item 2: gate item G5, CONTRADICTION (E-GATE M), Luke 1:36 against D4
- The item: luna's ANSWER CHECK on Luke 1:36 [CR3] graded the answer MISSES, yet D4 vs C2 and D4 vs C3 were graded UNDERDETERMINED. "Change one of these lines so they agree."
  The gate text asks, for a change to LINK BROKEN: the collision line in full, and "one FORCED line for that pair as the reason of its GATE line".
- luna's reply: "GATE: G5 || CHANGE TO: D4 vs C2 (Luke 1:36): DEFENDER LINK BROKEN -- ... -- GROUND: [L1] Luke 1:36 ... | [L3] Luke 1:13 ...; FORCED: D4 vs C2 -- MEANS [DR2]: "the angel's own sign for 'how' is a conception by a husband's seed under God's power." -- ANSWER [CR3]: "The ground is God's power, not a husband's seed." -- FAILS: "not a husband's seed." || [CR3] says ..."
  She wrote the FORCED line, with the round and the quotations, but inside the CHANGE TO field after a semicolon, not in the reason field.
- Engine: the change was applied, the re-read raised two new rule items (K-G4: the break counts a witness as unanswered without the quoted pressing sentence; K-F: no FORCED line), so G5 stayed UNCURED and was counted once.
- MEASURED (g5_form.cjs, live s110 code, the same words): with the FORCED line moved to the reason field, G5 is CURED, no new item is raised, the gate reads 5 of 5 cured, and luna's written row has drv_uncured 1 in place of 2.
- Reading: a form failure by luna (right content, wrong field). The instruction was given. But the engine dropped a FORCED line that was present, which is the class of a reader gap.
- Stored runs (measured): no gate row for luna in the 2 stored debates; no E-GATE M row for any judge in the log; one gate row of any judge carries a FORCED line inside the CHANGE TO field (grok, another item kind, cured). So 0 earlier cases of this failure.
- Countermeasure: none exists for this form. The smallest one: the gate reader, on a CHANGE TO that holds a collision line followed by "FORCED: D<i> vs C<j>" for the same pair, reads that FORCED line as it reads one in the reason field. Reader only, no prompt text. Size not measured (not built).

## Effect on the removal
luna was removed on 2 uncured items. With item 2 read, 1 would remain (item 1), and one uncured item still removes a seat under the count rule (a row with drv_uncured above 0 is out). The removal stands on item 1 alone.
