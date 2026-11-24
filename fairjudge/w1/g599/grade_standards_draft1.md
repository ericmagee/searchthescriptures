# W1 GRADE: ASK 599 coding standards, draft 1
GRADE: PASS with F1 to F3. COMMIT f61807a8 (ask599/w3/standards599.md 81f31066, W3, Wall 11469). Grader W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
RULES READ: the operator 01:44 CST ("inside the code itself, so no one misses it ... an industry standard ... nothing long, but simple to follow"), 512, the scope rule.
OBJECTIVE MET: yes, after F1 to F3: ten short rules, each sourced, each with a tool check, bound to new code at once and to old code by a counted baseline.

## (a) Quotations against source
- Power of Ten (Wikipedia page, fetched this session): rule 2 "Give all loops a fixed upper bound.", rule 4 "No function should be longer than what can be printed on a single sheet of paper ..." and "Typically, this means no more than about 60 lines of code per function.", rule 6 "Declare all data objects at the smallest possible level of scope.", rule 7 "Each calling function must check the return value of nonvoid functions" (the page continues ", and each called function must check the validity of all parameters provided by the caller"), rule 10 "All code must compile without warnings." and "should pass all analyses with zero warnings.": all found word for word.
- ESLint rule descriptions quoted (no-unused-vars, no-unreachable, no-redeclare, no-dupe-keys, no-magic-numbers, max-lines-per-function, no-empty) match the rule reference as I know it; I did not fetch eslint.org this session. From training, not verified: no-unused-vars, no-unreachable, no-unused-labels, no-redeclare, no-dupe-keys, no-empty, no-useless-catch and no-undef are in ESLint's recommended set; no-magic-numbers, max-lines-per-function, no-shadow and no-implicit-globals are not.

## (b) A tool check for each rule: yes, with F1 and F2
- F1 (rule 5 check is defeated by our code's form). Measured on live d819ff4c: library lines up to 17,563 characters (97 lines over 1,000); Panel Build is 155,101 characters in 475 lines. max-lines-per-function counts lines, so a one-line 4,000-character function passes. The check must measure after a formatter (e.g. run prettier first, then max-lines-per-function 60) or use max-statements; say which.
- F2 (rule 1 check must name its exemptions). The Shared Library is unwired by design ("This node is not wired to anything and never runs"; stubs read its text). The reach test exempts it by name, and any sticky note; nothing else.

## (c) Section 4, two steps: ACCEPTED. New and changed code meets all ten; old code is a counted baseline no build may raise. That is the only way that does not turn into a rewrite.

## (d) No copy in each node: ACCEPTED, with F3.
- F3 (placement). The Shared Library serves 22 library nodes; Panel Build (the largest node) and most of the 193 code nodes do not open it, so a header there is not "where no one misses it". Add a sticky note on the canvas of both workflows holding the ten lines (one copy per workflow, seen on opening), beside the library header and the manual part. The real guard is still the 596 check on every build card.

## (e) Rules 5 and 7, measured (W3's guess corrected with counts)
- Rule 7: 227 empty catch blocks (81 in the library, 146 in other code nodes); 148 nodes are set to continue on error. W3's "many catch(e){}" holds.
- Rule 5: see F1; by raw line count the library would show almost no faults, which is wrong.
