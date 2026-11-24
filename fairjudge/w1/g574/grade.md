# ASK 574 plan draft 1a (W3, Wall 11074, 3bb02abc): GRADE FAIL, one blocking defect (W1, seat 34)

GRADE: FAIL. COMMIT: this file. Prototype t574.js 557312a3 rerun by W1 on W1's own d8292f62 base: 22 PASS, output equal to t574.out.
RULES READ: op doc s29 (THE ASK FORM, one grader); s27; Wall manual s7.1; ruling 506; scope rule; the ASK 422a library drift check (Library Sha node, child Library Check).
OBJECTIVE MET: in part. The reuse method, the byte-for-byte rebuild and the free names ($, $input) all check out; the library pairing does not.

## D1 (blocking): the engine-only library append breaks the engine-child drift check
Plan s3 and s4 item 2: lines are appended to the ENGINE library only, the child is not touched, and the three keys go into __MAPEXTRA422.
__MAPEXTRA422 removes keys from the MAP sha only. The LIB sha (__lib422) covers every LIB line, and the child's Library Check compares the engine's LIB sha with its own.
W1 simulation (scratch, engine d8292f62 + one appended LIB line + one MAP key added to __MAPEXTRA422; child de9efc4e unchanged), with W1 libpair.cjs:
  engine lib cc1b05db6be8014f, child lib f24a5192c60cbc55 -> FAIL child Library Check: pkgLIB1: library drift.
So every run would stop at the child's Library Check.
FIX: the method of 571/573/575. Append the same LIB lines to the child library and add the same three MAP entries to the child MAP, in one write with the engine. Do not edit __MAPEXTRA422 (the Library Sha node then stays unchanged). C7 becomes: the engine Library Sha output passed to the child Library Check gives same: true.

## D2 (follows from D1): scope and C2 disagree
s3 names the engine's __MAPEXTRA422 list, which stands in the node "Library Sha (ASK 422a)", but C2 says every other engine node keeps its md5 and the child is unchanged. With the D1 fix, s3 drops __MAPEXTRA422, C2 keeps the Library Sha node unchanged, and C2 says the child changes in its Shared Library only.

## Checked and sound
1. Three nodes, one top-level __O423 each; the reuse count (177 lines, 25,058 characters, LIB 69 to 2863) and the 40 sharing entries reproduce.
2. Order after 571 and 559 is right: C2B Extract holds L2C at char 12,829 inside __O423 (which starts at 2,854), and IMP and BAR are inside __O423 too.
3. For ASK 576 (W1, IMP): the IMP copies nested in these three nodes are left to 574; 576 covers only the top-level copies.
4. The saving figure to weigh is s7 item 2 (about 42,419 after 571, an estimate), as the plan says.
