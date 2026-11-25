ASK 652 PLAN rev 1 (W4; rev 1 answers W1 F1, Wall 12101). The press-list reader counts supporting verses inside a press as if they were presses.

DEFECT
The premise reader in D4 Build, Panel Build and Build Independent Verdict loops over every reference in the PRESSED WITH block (refs(xw)). That includes the [L3] verse and the MEANS words of each press line. PRS.premise classes only the pressed verses (the head of each line). Any reference it did not class falls into "UNPROVEN, not a witness (no MEANS sentence)". The same loop also counts those references toward the cap of 8 pressed verses (nk>=8), so real presses can be cut as "over the cap ... not witnesses".
The Shared Library reader is already built on PRS.premise verses (H from P.verses and P.over); this ASK brings the other three into line with it.

EVIDENCE
- 42528, to the Oracle (D4 Build open_list (b)): Matthew 1:20 and Galatians 4:4 were called costless. They are the [L3] lines of John 3:6 and Hebrews 2:14 in premise 2, not presses.
- 42373, to the Oracle: all 14 verses on the costless list are layer verses. Every pressed verse of premises 1-6 was PROVEN (replay). Among them were Matthew 1:18 and Matthew 1:12.
- 42528, to the JUDGES (Panel Build ledger, AGAINST THE CHALLENGER): the Oracle pressed 23 verses, and 22 of them are PROVEN by PRS.premise (2 Samuel 7:12 fails the WALL-2024 floor). The ledger told the judges that 25 verses were "UNPROVEN, not a witness (ruling 398) ... (no MEANS sentence)". All 25 are layer verses inside the Oracle's presses (premise 1: Matthew 1:25, 1:18, 1:20, 1 Samuel 1:19; premise 6: Luke 1:34, Luke 1:35, 2 Samuel 7:14, Luke 24:49, Luke 9:34; and others). In premise 3 the cap set aside the Oracle's proven press Job 14:1 as "over the cap of 8 pressed verses, not witnesses".

CHANGE (each of the three copies, tagged /* ASK 652 */)
At the top of the refs(xw) loop, before the seen, cap and count steps:
  if(PRSP&&!r.cvs.some(cv=>{const z=(r.book||r.ctx||'')+' '+cv;return PRSP.verses.some(v=>v.key===z)||(PRSP.over||[]).includes(z);}))continue;
When PRS.premise has classed the premise, a reference that is neither one of its pressed verses (PRSP.verses) nor one of its presses past its own cap (PRSP.over) is skipped: it is not counted as a press, not counted to the cap, and not labelled. Presses in PRSP.over still reach the cap step, so the "over the cap of 8 pressed verses" line stays (F1). When PRS is absent (PRSP null), nothing changes.

EFFECT, replayed offline with live D4 Build code
- 42528 open_list (b): with 651 and 652 together, only "premise 4: Luke 1:34" is left (see the next item). With 652 alone: "premise 2: Luke 1:35; premise 3: Luke 1:35; premise 4: Luke 1:35, Luke 1:34".
- 42373 open_list (b): from 14 items to none; it reads "none: every verse those premises carry ... is named".
- Panel Build / Build Independent Verdict: to be replayed in the build on the stored 42528 and 42373 inputs, with before/after ledger text for W1.

LUKE 1:34 (premise 4, 42528): NOT THIS CAUSE. It is a pressed verse, classed UNPROVEN by the WALL-2024 floor on premise 4's MEANS ("Mary denies knowing a man"). Under premise 6's MEANS the same verse is PROVEN BY REFERENCE. That is the floor rule working as written; whether it should apply here is a ruling question, not this bug. Left out of 652.

TESTS (t652)
1. 42528 and 42373: every verse that PRS.premise classes is listed exactly as before, by class.
2. No layer verse appears as UNPROVEN or as counted to the cap.
3. A premise with more than 8 real presses still gets the cap, and the "over the cap of 8 pressed verses" line names the presses PRS.premise put in PRSP.over (W1 F1).
4. PRSP null (no PRS) gives the old output byte for byte.
5. Panel Build and Build Independent Verdict ledgers on 42528: the AGAINST THE CHALLENGER UNPROVEN list falls from 25 layer verses to the one floor item (2 Samuel 7:12); Job 14:1 is counted.

ORDER: 651 and 652 touch the same three nodes, so build them together or rebase one on the other. Panel Build and Build Independent Verdict are judge-facing, and both changes alter text the judges read.
Build and write wait on Eric's card.
