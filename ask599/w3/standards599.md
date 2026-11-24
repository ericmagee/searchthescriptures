# ASK 599: CODING STANDARDS FOR THE DEBATE ENGINE, draft 2 (W1 F1, F2, F3 of Wall 11471)

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 2026-11-24 CST. For W1's grade, then the operator's card. Nothing here is written to the engine or the manual.

## 0. OBJECTIVE

The operator, 01:44 CST 2026-11-24, W3 thread: "We clearly don't have any coding standards, and we need to institute some ... inside the code itself, so no one misses it going forward ... so that we don't have things like dead code in our program ... I would like something that's an industry standard that's nothing long, but simple to follow."

OBJECTIVE MET when: (1) one page of rules stands at the top of the Shared Library, engine and child, and in the engine manual; (2) each rule names its source; (3) each rule has a check in the standing test set (ASK 596) that refuses a build which breaks it; (4) the operator has approved the text on a card.

WRONG IF: a rule has no check a tool can run (then it is advice, and it will be missed); or the page grows past one page.

## 1. SOURCES, AS READ

1. "The Power of 10: Rules for Developing Safety-Critical Code", Gerard J. Holzmann, NASA/JPL Laboratory for Reliable Software, IEEE Computer 39(6): 95-99, 2006. Read in this session, 2026-11-24, from https://en.wikipedia.org/wiki/The_Power_of_10:_Rules_for_Developing_Safety-Critical_Code (the encyclopedia's listing of the ten rules, not the paper itself). Ten rules, written for the C language, each made so a tool can check it. Rules 3, 8 and 9 (memory allocation, the preprocessor, pointers) have no meaning in JavaScript and are not used.
2. The ESLint rules reference, https://eslint.org/docs/v8.x/rules/ , read in this session, 2026-11-24. ESLint is the common checking tool for JavaScript. Each rule below is quoted from that page. NOT VERIFIED: which of these rules belong to ESLint's "recommended" set; the page as fetched did not show it. The page is the version 8 reference, which it marks as past its end of life; the rule names and meanings are what is used here, and the test set pins whatever version W4 installs.
3. Our own record: ASK 587 item A, Wall 11452 and 11462 (W1's reads of the live engine), ruling rows of 2026-11-24.

DECLARED: the choice of these two sources came from my training, not from the record. The texts quoted are from the reads above. One principle is named from training without a read: "one source of truth" (commonly called DRY, "don't repeat yourself"); no source text is quoted for it.

## 2. THE PAGE (the text proposed for the top of the Shared Library and for the manual)

```
DEBATE ENGINE CODING STANDARD (ASK 599). Ten rules. Each has a test in the standing
test set; a build that breaks one does not reach the operator's card.
 1. NO DEAD CODE. No node that nothing reaches. No function that nothing calls. No
    variable that nothing reads. Code that is switched off is removed, not left.
 2. ONE COPY. Each list, map, limit and helper is written once and read from there.
 3. NO ONE'S WORDS ARE CUT. A judge's or debater's line is stored, read and shown
    whole. Any shortening is done by the one shared handler and is marked.
 4. NO BARE NUMBERS. A limit has a name, one home and a stated reason.
 5. SMALL PIECES. A function is no longer than about 60 lines and does one thing.
 6. EVERY LOOP ENDS. Each loop, retry and send-back has a fixed, stated upper bound.
 7. CHECK WHAT COMES BACK. Every reply from a model, the database or a sub-workflow
    is checked before use. A caught fault is recorded; it is never swallowed.
 8. SMALLEST SCOPE. A name is declared where it is used and hides no other name.
 9. ZERO WARNINGS, NO REGRESSION. Every build passes the checker with no warning
    and passes the tests of every earlier fix.
10. ONE CHANGE, READ BACK. A change touches only what its ASK names, carries its
    ASK number in a comment, and is read back from the live engine after the write.
```

Size: 1,332 characters as written above (one copy in the engine library, one in the child).

## 3. EACH RULE: SOURCE AND CHECK

| # | Source | The check in ASK 596 |
|---|---|---|
| 1 | ESLint no-unused-vars "Disallow unused variables"; no-unreachable "Disallow unreachable code after `return`, `throw`, `continue`, and `break` statements"; no-unused-labels. Ours: Wall 11462 (28 nodes reached by nothing). | Walk the connections from every trigger: every node is reached. Exempt by name: the Shared Library node, which is read by code and not by a connection, and canvas sticky notes (W1 F2). Run the two ESLint rules on every code node and the library. |
| 2 | ESLint no-redeclare "Disallow variable redeclaration"; no-dupe-keys "Disallow duplicate keys in object literals"; the DRY principle (named, not read). Ours: Wall 11462 item 4 (removing one model took 17 nodes). | A named list (judge order, alternates, reserve, family map, call map) stands in exactly one place; the test lists them and counts copies. |
| 3 | Ours: ASK 587 item A; ASK 595; Wall 11452 (24 cuts at 1,500; cuts at 400, 500, 600, 700 in 117 places; 3 send-back texts show a judge its own line cut to 600). | No `.slice(0,N)` on a line field outside the shared handler (ASK 597). A judge line of 1,600 characters goes through every store and every send-back text whole. |
| 4 | ESLint no-magic-numbers "Disallow magic numbers". | The ESLint rule, with the named limits listed in one table. |
| 5 | Power of Ten rule 4: "No function should be longer than what can be printed on a single sheet of paper ... Typically, this means no more than about 60 lines of code per function." ESLint max-lines-per-function "Enforce a maximum number of lines of code in a function". | The code is first laid out by a formatter (one statement per line), because the library holds single lines of up to 17,563 characters and a line count on them proves nothing (W1 F1, Wall 11471). Then the ESLint rule set to 60, with max-statements beside it. |
| 6 | Power of Ten rule 2: "Give all loops a fixed upper bound." | Each `while` and each retry or send-back path names its bound; the test lists loops with none. ESLint no-unreachable-loop. |
| 7 | Power of Ten rule 7: "Each calling function must check the return value of nonvoid functions". ESLint no-empty "Disallow empty block statements"; no-useless-catch. | No empty `catch` block; each `catch` writes a record. A node set to continue on error names where its fault is recorded. The ESLint rules. Baseline from W1's read (Wall 11471): 227 empty `catch` blocks; 148 nodes set to continue on error. |
| 8 | Power of Ten rule 6: "Declare all data objects at the smallest possible level of scope." ESLint no-shadow; no-implicit-globals; no-undef. | The ESLint rules. |
| 9 | Power of Ten rule 10: "All code must compile without warnings" and "should pass all analyses with zero warnings". Ours: ASK 590 passed its own 66 tests and broke ASK 587 (Wall 11452). | ASK 596 itself: the checker reports zero warnings, and every earlier ASK's test file is rerun. |
| 10 | Ours: the build rule (touched nodes only), the scope rule, the readback rule. | The per-node difference between base and target names only the nodes the ASK lists; the fetch-back equals the target. |

Not taken from the Power of Ten: rule 1 (no goto or recursion), rule 5 (two assertions per function; folded into our rule 7), rules 3, 8, 9 (C only).

## 4. WHAT THE EXISTING CODE DOES TODAY, SAID PLAINLY

1. The live engine does not meet this standard. Known from W1's reads: 28 dead nodes; cuts in over 140 places; lists copied across nodes. Measured by W1 (Wall 11471): 227 empty `catch` blocks and 148 nodes set to continue on error (rule 7); single library lines of up to 17,563 characters (rule 5). Not measured: function length after formatting, bare numbers, shadowed names.
2. So the standard binds in two steps. (a) FROM THE DAY IT IS APPROVED: every new or changed piece of code meets all ten rules. (b) THE OLD CODE: ASK 596 counts the faults of each rule once, as a baseline. No build may raise a count. Each count goes down by its own ASK (597 for rule 3, 598 for rule 1), never by a rewrite of the whole engine at once.
3. A rule with a baseline above zero is not relaxed. It is a debt with a number that the operator can see on each build card.

## 5. WHERE IT GOES

1. The top of the Shared Library, as a comment, engine and child (the two copies are kept equal by the Library Check pair). This is the one source of the text. W1's read (F3): only 22 of the 193 code nodes use the library, so the header alone would be missed by anyone working in the other 171.
1a. One sticky note on the canvas of each workflow (engine and child), holding the same ten lines, where anyone who opens the workflow sees it first. The ASK 596 test checks that the two notes and the manual part equal the library header word for word, so the copies cannot drift (rule 2 is kept by the test).
2. The engine manual: a new short part after part 00.1, holding the same ten lines and the table of section 3. The manual write is W3's, on the operator's card.
3. Every build card: one line, "STANDARD: 10 of 10 checks pass; baseline counts unchanged or lower", from the ASK 596 output.
4. The grader's list: W1's grade of any build states the standard's result.
5. NOT PROPOSED: a copy at the top of each of the 422 nodes. It would be the same text in 422 places, which breaks rule 2.

## 6. ORDER OF WORK

1. This page: W1's grade, then the operator's card for the TEXT.
2. ASK 596 builds the checks (its plan follows this one and names the tool, the test files of every earlier ASK, and the baseline counts).
3. The header is written into the library with the first build after 596 exists, on W4's write card, so that the rules and their checks arrive together. A header with no checks would be the failure this ASK exists to end.

## 7. LIMITS

1. A checker reads code, not intent: it cannot tell whether a piece "does one thing" (rule 5, second half) or whether a comment's ASK number is the right one (rule 10).
2. The n8n node graph is not JavaScript; rules 1 and 10 need our own test on the workflow file, not ESLint.
3. The ESLint "recommended" membership is not verified (section 1 item 2).
4. Not shown on the engine: no rule has been run against the live code yet.
