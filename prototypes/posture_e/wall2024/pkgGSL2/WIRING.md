# pkgGSL2: supersession by the last APPLIED change of a line (W3 2731 item 4)

**Gap.** pkgGSL cures a NOT APPLIED gate change when a later gate change of the same judge on the same line was applied. But supBy named only the last change in the line's group. When that last change was refused, earlier changes stayed UNCURED even though an applied change between them had rewritten their line. This is a false uncure, never a false cure, but it can unseat a judge. W3 found it in the pkgPSG control: G4 refused, G3 applied, G1 and G2 UNCURED.

**Edit (one anchor, 6 gate-library nodes, gateCure2024).** supBy now maps each change to the last applied change after it in its line's group, and to nothing when none is applied. `applied` is defined before supBy in the same function; the build checks this. The why text is unchanged and names the applied change.

**Base.** pkgASM/patched (s16 + GSL + PSG + UNXA + ASM). A1 checks the 6 bases are the ASM finals. Write it after ASM. For another base, run `BASE=<dir> node pkgGSL2/build_GSL2.cjs`.

**Test.** `node pkgGSL2/test_GSL2.cjs` gives 9 OK:
- B1 and B2: parity on 33222 Alt Gate Record and on 33222 and 33218 Gate Record.
- C1 to C3: W3's control, the gap in the base and the fix.
- D1: G3 and G4 refused, G1 cured by the applied G2.
- D2: G2 to G4 refused, base and patched rows identical, and no supersession cure.
