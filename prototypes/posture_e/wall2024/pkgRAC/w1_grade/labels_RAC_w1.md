# W1 grade of pkgRAC rev 1 (dc79629e): labels written before running (09:1x CST 11-10)

Each case runs Close Enforcer Record (candidate build) on a planted reply, then Panel Build on that Record output. Expected results:
- G1 challenger anti-cheat pair (33222, X94 -> A94 CHALLENGER) CONFIRMED on a declared challenger link: link broken on the challenger side;
     the challenger's ANTI-CHEAT CHECK block leaves; CONFIRMED CLOSING CONTRADICTIONS printed with A94.
- G2 the same pair confirmed only by a NEW line (same quotations), A94 itself unanswered: link broken (NEW); A94 logged NO ANSWER; the
     A94 block stays with the second sentence only. Nothing dropped.
- G3 two anti-cheat pairs of one side (33846, defender) both CONFIRMED on the SAME link: one break; each pair must be visible to the judges
     somewhere (in CONFIRMED CLOSING CONTRADICTIONS or in its ANTI-CHEAT block). A pair shown in neither place = silent drop = FAIL.
- G4 the same, with an Oracle X candidate (or NEW line) confirmed first on that link and one A pair confirmed after it: the A pair must stay
     visible somewhere (as G3).
- G5 the candidate id answered in lower case ("a94"): read as A94, confirmed.
- G6 two pairs of one side (33846): one NOT A CONTRADICTION, one CONFIRMED on another link: the first block ends with the approved two-sentence
     ending, the second block leaves.
- G7 an anti-cheat row with an empty earlier quotation: logged NOT SENT, NOT CHECKED (not dropped).

## Rev 2 regrade (041aef72): labels added before running (10:1x CST 11-10)
- G1, G2, G5, G6, G7 as above. G3 and G4 (A13+A57; NEW then A73) now must keep the second pair visible (its block, second sentence only).
- G8 Panel Build stripped of every comment with pkgLIB/strip.cjs (line AND block, the R2 tool): Close Enforcer Build gives the same A and R
     candidates on all stored debates as with the unstripped Panel Build.
- G9 Anticheat Build run on a Final Output whose rounds are not strings (cr4 an object): no throw; one skip item with a reason; Close Enforcer
     Build still runs after it.
- G10 no candidate line in any stored debate carries "reverses" or "asserts more" (neutral reasons).
