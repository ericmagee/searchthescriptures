# W1 GRADE: ASK 653 plan rev 0 (ask653/w4/plan653.md, md5 fefa1ca530b8e59f6f7d9d7a0e61fc75)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh.
GRADE: PASS WITH N1.

## Checked against live 7f4e5503
- ROOTPRE, markRoots and rootAt occur only in the Shared Library, so there is one copy.
- LIB line 146 is the ROOTPRE shown under "Before".
- LIB line 153 holds rootAt. Its second pass already resolves a root by position, using the same j computation the plan reuses, so the insertion after "if(!pass)return false;" fits.
- No LIB line is added, so the MAP line indexes hold.
- New ROOTPRE, tested by me:
  - "a primary word (compare ", "from a variation of " and "probably akin to " now end in a root marker.
  - "from " is unchanged.
- New and/or pattern, tested by me:
  - On "from σύν and " it takes σύν; on "from ἐπί and a derivative of " it takes ἐπί.
  - On "G1080 and " it takes G1080, but marks the next word only if G1080 is already a root. So two claimed numbers joined by "and" are both still checked.
- check() keeps a safeguard: when every word of a tag is a root, core falls back to all the words (LIB 187). A tag of roots only still has to be found in the verse, so no tag passes by having nothing in its core.

## N1 (tests, before build grade)
"compare" now marks any word that follows it, on either side. So a tag whose core word is in the verse, plus a wrong word written after "compare", becomes COUNTED where it was NOT COUNTED. That is lenient and side-neutral, and acceptable. Add two tests that pin it:
- a tag with only a "compare X" word, where X is absent, stays NOT COUNTED (the all-root fallback);
- the 42373 replay names every tag that changes, on both sides, with its reason.

## Build
The build order is acceptable: fold 653 into the 651+652 target, or rebase it on the fetch-back if that target is written first. At build grade I need:
- the full L2 Count Plan before and after on 42528 and 42373;
- the 15 misfires COUNTED, the other 15 unchanged, and no COUNTED tag changed;
- the 651/652 tests and the standing tests re-run.

STANDARD (ASK 599): two tagged edits in one copy. Met.
NOT CHECKED: W4's pre-test t653.cjs (b7d34384) itself.
