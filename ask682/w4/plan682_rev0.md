# ASK 682 PLAN rev 0 (W4, 11-27): a proven press marked UNPROVEN by the WALL-2024 floor

## ROLES
W4 builds and writes; W1 grades; W3 drafts the manual entry and AAR row.

## THE DEFECT (run 43103)
The close prompt to the Oracle read: "(b) UNPROVEN PRESSES ... leaving them unanswered costs you nothing: premise 3: Luke 1:34". The judges' ledger carried the same mark (Sonnet, enforcer row 54890). The press carries MEANS, [L2] G1097 and [L3] Genesis 4:1.

## CAUSE (CONFIRMED BY REPLAY)
replay682.cjs (8b971a71) runs the live D4 Build classifier (66ba992d, d4build_66ba992d.js d625c356) on the press. classify0 gives PROVEN. The WALL-2024 floor then turns it UNPROVEN: "its MEANS asserts what Mary knowing (man ground question), and no single layer quote holds a verb of that kind with those words" (replay682_out.txt c4d785e6).
The MEANS is "Mary states present knowing of man as ground of her question". The verb is "states". "knowing" is a noun there. The floor found no person right before "knowing", so its fallback searched the whole clause, took "Mary" as the one who knows, and demanded "man ground question" inside one quotation.

## FIX
Remove the clause-search fallback in the floor's claims(): a mind-verb claim is read only when the person word stands right before the verb (the two words before it), as the floor's first test already does. This is one rule, not a form per model.
Replay on 11 runs, 552 presses (floordiff682.cjs c96f3b92, rows11.json e37ea4e6, out 415d032b): 3 change, all UNPROVEN to PROVEN, all the same false reading: 43103 Luke 1:34; f333ef24 Luke 2:48 ("the same Mary says \"I know not a man\""); fd0edbff Matthew 1:25 ("bars knowing as source"). The floor still refuses its other 3 presses.

## NODES
The floor has four copies: D4 Build, Panel Build, Build Independent Verdict, Shared Library. All four change in the same way. Child: checked at build.

## WRONG-IF
A press whose MEANS has a person directly before a mind verb (for example "Joseph thought she had sinned") stops being refused by the floor.

## STEPS
W1 grades; build; W1 grades the build; write card to the operator; poll runs, fresh fetch, PUT the four nodes, fetch back, W1 readback.
