# ASK 562 plan, draft 3 (W1): "against" heads that LAY reads as blocks, built on ASK 581

DRAFT 3, re-cut 19:10 CST on the corrected 581 target (581 draft 2, commit 70003e6b). Nothing is written. Plan grader: W3. Builder and writer: W4, on its own write card, after the operator approves the build.
Draft 2 (fairjudge/w1/ASK562_plan.md) stands for the head change; its replay classing is fairjudge/w1/a562/CLASS562.md, as corrected on Wall 11137 (FALSE 9, TRUE 27).
Draft 3 changes two things:
1. It is built on top of ASK 581 draft 2 (Wall 11141), which clears 7 of the 9 FALSE items. #24 stays an item under 581 draft 2 (see 5.3).
2. It adds one rule for the 9th FALSE item, #10.
Order (coordinator): v237, then 581, then 562 draft 3.

## 1. OBJECTIVE
A side's presses written under heads such as "## Against D1: ...", "**Against D1 (Matthew 1:16).**", "## Against the answer to D1" or "D3 against C5:" are not read by LAY today. Such a head is not a CP head, and a markdown head ends the block before it and opens none. So an unfooted press under such a head is never sent back.
After 562, those heads open blocks, and the layers check applies to them as it applies to a PRESS block.

## 2. ROLES
Planner W1. Plan grader W3. Builder W4, on a fresh live readback, after the 581 write. Build grader: a non-builder seat. Write card: W4's own.

## 3. SCOPE, with the SEARCH that set it
1. SEARCH: the draft 2 replay (50 stored rounds), its 36 new items read in full and classed (CLASS562.md). The one FALSE item that 581 does not reach is #10, 32605 DR1. There, "### Against D5 (the keystone) and the defender's §6" is a section title; its body is PRESS 13 to PRESS 16, each a PRESS head of its own. Under draft 2 the title becomes an empty block, and the block draws "no verse quoted".
2. SEARCH: the code. structure() in LAY: a block is skipped when it is shorter than 60 characters, a withdrawal, or a recap. A long title with no body passes those tests.
3. OUT of scope: every head other than an "against" head. The new skip applies only to a head that begins "against" (optionally "D<n> against"), so CP heads, PRESS heads and markdown heads behave as before.

## 4. THE CHANGE (fairjudge/w1/a562d3/edits562.cjs; build build562.cjs, the same build as 581)
Two LAY lines in the Shared Library, both copies: LIB 3504 (the CP literal) and LIB 3547 (the structure() block loop). No LIB line is added.
1. CP, the draft 2 text unchanged: `Point\s+\d+\b)/i;` becomes `Point\s+\d+\b)|^\s*(?:#{1,6}\s*|\*\*\s*)against\s+(?:the\s+answer\s+to\s+)?[CD]\d+\b|^\s*(?:D\d+\s+)?against\s+[CD]\d+\b[^\n.]{0,80}:\s*$/i;`
2. NEW in draft 3, right after the recap skip: an "against" head opens no block when both of these hold.
   a. It has no non-blank line under it before the next head.
   b. It is a title only: a markdown head, a line ending in ":", or a bold head with nothing after the bold.
   A bold head with its point on the same line ("**Against D6.** D6 stands on D1 to D5, ...") still opens a block.

## 5. EVIDENCE (base: /mnt/project-files/fairjudge/w1/a581/target_engine_581.json and target_child_581.json; targets: /mnt/project-files/fairjudge/w1/a562d3/target_engine_562.json and target_child_562.json)
1. build562.cjs on the 581 target:
   a. LIB 3504 and 3547 change in both copies. The library sha becomes 0e1cce8f1b596ea4, with 3,582 lines. Targets: engine md5 aa9e5cdf, child md5 44e9c851.
   b. MAP LAY n goes from 15,842 to 16,191, and no other MAP entry changes.
   c. The engine Library Sha fed to the child Library Check gives the same value on both sides (map 1c16aec5da4a85e9).
   d. Shared Library size: engine 1,159,950 to 1,160,332; child 1,159,771 to 1,160,153 (+382 each).
2. test562d3.cjs, 9 checks with stored KJV rows: ALL PASS.
   a. Under the four head forms, an unfooted block goes from 0 items to 1.
   b. A footed block passes.
   c. A prose line "Against D1 the challenger ..." is no head.
   d. The #10 form (a title over PRESS heads) gives 0 items. Draft 2 alone gave 1 here (checked).
   e. A bold head with its point on its line still opens a block.
   f. A title-only bold head with no body opens none.
3. replay562d3.cjs, 581 against 581 + 562 draft 3, on 64 checks (75 with the C1 runs of 5.3f; a to e below are the 64): the 50 stored rounds, the 41822 and 41418 Oracle drafts, and 41822's 8 stored rounds.
   a. Items go from 303 to 329: 28 new in 12 checks, 2 gone.
   b. The 28 new items are the 27 TRUE items of the corrected classing (the 26 of CLASS562.md plus #17), and #24 (33389 CR2, "**Against D6 (Isaiah 8:3-4, Genesis 4:25, Matthew 11:11).**", one verse only).
   c. #10 is gone by the new rule. 581 draft 2 cleared 7. #24 remains: its second verse is written as a bare "24:16", and 581 draft 2 gives it the book only when the row of Genesis 24:16 is held (581 plan 7.4). The replay runs with rows=[]. The item asks the writer to state the reference, which is the note's own rule, so I class it as an item the writer can satisfy, not a false reading of a full reference.
   d. The 2 gone items are the two "## PRESSES AGAINST THE DEFENDER'S CHAIN" blocks (32725 and 36791 DR1). Their against heads now split that text into the against blocks, which carry the items instead. This was the same under draft 2.
   e. Run 41822: no change. Its rounds hold no "against" head.
   f. C1 (W3, Wall 11145): the Oracle gate on the defender rounds. D2B, D3B and D4B Build pass {oracle:true} for an Oracle defender, and an against block is then also tested for an [L2] and an [L4] line. The replay now also runs the 11 stored defender rounds (CR2, CR4) with the gate (75 checks in all):
      - plain, the 11 defender rounds give 8 new items;
      - with the gate, they give 13 new items, and 11 of them name a missing [L2] or [L4] line;
      - with the gate, 1 item is gone: 37113 CR2 "## PRESSES AGAINST THE CHALLENGER'S CHAIN", whose text now falls into its against blocks, as in 5.3d.
      These figures equal W3's own measure.

## 6. RISK STATED
This widens the send-back. In the 50 stored rounds, 28 against blocks fall short of their layers as LAY reads them, in 12 rounds. Each now gets the STRUCTURE item in the one send-back, as a PRESS block does today. For an Oracle defender, the gate also asks each against block for an [L2] and an [L4] line. In the 11 stored defender rounds, that gives 13 new items instead of 8, and 11 of the 13 name a missing [L2] or [L4] (5.3f). This is the operator's ruling of 16:52 and 16:54 CST 11-23 applied to the Oracle's replies: the Oracle breaks its opponent's replies down with the layers. Run 41822 is not affected.

Limits (W3 notes, Wall 11145):
1. An against line inside a PRESS block now ends that block. A PRESS block whose verses stand after such a line is flagged. None of the stored rounds has this.
2. A prose line that begins "Against D1 ...", has no full stop, and ends in ":" within 80 characters reads as a head.
3. A title-only head with a blank line and prose under it still opens a block, as planned.

## 7. ORDER AND WRITE
After the 581 write; built on what is live then. The write script follows write573.sh c232934c (`|| code=000` on both PUTs, an engine revert with `|| rc=000`, and test562d3 plus the pair check before the PUT).
