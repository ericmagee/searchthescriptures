# ASK 682 PLAN rev 1 (W4, 11-27; rev 0 dbf014b9 graded PASS WITH C1 TO C3 by W1, Wall 12821): a proven press marked UNPROVEN by the WALL-2024 floor

## ROLES
W4 builds and writes; W1 grades; W3 drafts the manual entry and AAR row.

## THE DEFECT (run 43103)
The close prompt to the Oracle read: "(b) UNPROVEN PRESSES ... leaving them unanswered costs you nothing: premise 3: Luke 1:34". The judges' ledger carried the same mark: Sonnet's sentence "Premise 3's Luke 1:34 is UNPROVEN in the ledger, so it is not a witness and costs nothing" stands in E-PREM rows 55006, 55009, 55012, 55015 and 55018 (C3). The press carries MEANS, [L2] G1097 and [L3] Genesis 4:1.

## CAUSE (CONFIRMED BY REPLAY)
replay682.cjs (8b971a71) runs the live D4 Build classifier (66ba992d, d4build_66ba992d.js d625c356) on the press. classify0 gives PROVEN. The WALL-2024 floor then turns it UNPROVEN: "its MEANS asserts what Mary knowing (man ground question), and no single layer quote holds a verb of that kind with those words" (replay682_out.txt c4d785e6).
The MEANS is "Mary states present knowing of man as ground of her question". The verb is "states". "knowing" is a noun there. The floor found no person right before "knowing", so its fallback searched the whole clause, took "Mary" as the one who knows, and demanded "man ground question" inside one quotation.

## FIX
Remove the clause-search fallback in the floor's claims(): a mind-verb claim is read only when the person word stands right before the verb (the two words before it), as the floor's first test already does. This is one rule, not a form per model.
Replay on 11 runs, 552 presses (floordiff682.cjs c96f3b92, rows11.json e37ea4e6, out 415d032b): 3 change, all UNPROVEN to PROVEN, all the same false reading: 43103 Luke 1:34; f333ef24 Luke 2:48 ("the same Mary says \"I know not a man\""); fd0edbff Matthew 1:25 ("bars knowing as source"). The floor still refuses its other 3 presses.

## NODES AND BUILD b1 (C2)
The floor has four copies. D4 Build, Panel Build and Build Independent Verdict hold it as plain code. The Shared Library holds it in LIB line 64, stored as escaped text inside the JSON line list. That line is used by 39 MAP entries (gate, cure, payload and merge nodes, the child's R2 nodes among them through ASK 578).
build/b1/build682.cjs (7bd12b82) replaces the fallback in the three plain nodes. In the Shared Library it patches LIB line 64, rebuilds all 39 MAP entries, sets each n to its rebuilt length, checks that each parses, and recomputes the header sha the way Library Check (ASK 422a) does. Base sha recomputed fb8658437cad8fbf, equal to the live header; new sha c680f62ad3fcdc3b.
Proof of 0 copies left (b1/build682_out.txt 2bd17c0a): the plain form is left 0 times and the escaped form 0 times, in all 4 nodes. No other engine node holds either form. The child holds no copy of its own (it reads the engine library, ASK 578).
Target engine e9d8d2de (b1/target682.json). The built D4 Build gives PROVEN on all 4 presses of 43103, Luke 1:34 included (b1/replay682_target_out.txt 3de57fc4).

## WRONG-IF (C1)
The fix gives up the claims where the person stands farther back in the clause. For example, "Joseph in his heart thought she had sinned": the two words before "thought" are "his heart", so after the fix no claim is read there, and the floor no longer refuses that MEANS. It is wrong if a run shows a press with such a MEANS, unheld by its layers, passing as PROVEN and deciding a link. The replay on 11 runs found no such press: the 3 refusals that remain are all of the direct form.

## STEPS
W1 grades; build; W1 grades the build; write card to the operator; poll runs, fresh fetch, PUT the four nodes, fetch back, W1 readback.
