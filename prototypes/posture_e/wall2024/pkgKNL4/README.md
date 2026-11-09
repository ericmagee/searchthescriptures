# pkgKNL rev 4: five more "nothing forced" phrasings (W1 Wall 3790, misses 4 and 5)

Builder W2. Graders W1 and W3. Base: live s89 (library pkgLIB_VP1_s84; checked equal node by node, heads included).

## The gap
W1's planted cases on run 34108 (w1_unproven/knl_34108.txt): `FORCED: — none`, `FORCED: none (no link is graded broken)`, `FORCED: none of the collisions`
and `FORCED: There are no forced links.` raised K-F FORCED, K-CMT and K-CMTL; `FORCED LINES: none` raised K-CMT and K-CMTL. A judge cannot cure any of
these with a FORCED line, because nothing is graded.

## The change (one function, all 30 library files)
`knlNone2024` stays an allow-list (rev 3, W3 3576). It now also takes:
1. the head `FORCED LINES:` or `FORCED LINKS:`;
2. a leading dash after the colon (`-`, `–`, `—`);
3. a closing parenthesis that only says nothing is graded: it must hold no, none, not or nothing, and no link (D1, C2, LINK 4, PREMISE 3), no round ([CR4], DR3), no quotation, and no except / but / save / other than. `(Commitment N)` stays allowed as before;
4. `none of the collisions` (or links, lines, collision points), with an optional `are forced`;
5. `there are no forced links` / `no forced links` (or lines, collisions), with an optional `are forced`.
Anything else is checked as before. kfLines and kcmtGrade2024 are unchanged; they already skip a line knlNone2024 accepts.

## Proof
- test_KNL4_fn.txt: 31 OK. All 17 nothing-graded lines are accepted (9 of them new in rev 4). 14 lines that name a link, a round, a quote or an exception are still checked, as in rev 3.
- knl4_34108.txt: 9 OK. This is W1's own test on the new library (34108, luna's Panel Judge 1 reply re-read by Panel Payloads). It has the same catches as before, and the six forms W1 probed now raise no item.
- probe_KNL_on_KNL4.txt: 30 OK, the rev 3 probe on the new library. probe_KNL_w4_on_KNL4.txt: 33 OK, W4's adversarial probe (11 must-skip, 22 must-check).
- gate_KNL4.txt: GATE PASS. Base strip_VP1_s84 against cand strip_KNL4 on fetchback_live_s89.json: 767 node runs, all byte-equal or the same error, 0 target item changes, 17 near-miss checks passed.

## Build
    node pkgKNL4/build_KNL4.cjs strip
    FB=/mnt/project-files/wall2024/fetchback_live_s89.json node gate/pack.cjs pkgLIB/strip_KNL4 pkgLIB_KNL4
    FB=/mnt/project-files/wall2024/fetchback_live_s89.json node pkgKNL4/build_KNL4.cjs parent    # parent_s89_KNL4.json
The parent step refuses unless the live library equals pkgLIB_VP1_s84. If anything else changes the library first, restack.
Changed nodes: Shared Library, the 30 library stubs, Early Alternate Build (32); no connection changes. No log rows are added or changed.

## Manual part
KNL (rev 4, 11-09): the none-line allow-list also takes the FORCED LINES / FORCED LINKS head, a leading dash, a closing parenthesis that only says nothing is graded (no link, round, quote or exception in it), "none of the collisions/links/lines" and "there are no forced links". Any other wording on a FORCED line is checked as before.
