# pkgRCD: RULING card follows the judge's own collision regrade (W2, 11-08)

Approved: Eric "yes" 11-08 17:40 CST to the Matthew 1:18 countermeasure (coordinator ASK 1; W2 Wall 3266/3267).

The repeat (17 of 22 runs, 33311-33750, mostly gemini and grok): a judge grades a collision LINK BROKEN; the DeepSeek enforcer sends the
collision line back (E-COL); the judge CHANGEs the collision line (usually to UNDERDETERMINED) but leaves its RULING card for the same pair on
the old grade; the gate then raises E-GATE D38 ("your RULING card grades ... but your collision line ... now grades it ...") and a second
send-back round follows. In every logged case (9 of 9, 33705/33731/33750) the judge then changed the card to the collision grade.

Change, in sbApply2024 (the send-back apply, library; 10 nodes: Gate Build, Gate Record, Alt/R2 Alt Gate Build and Record, Alternate Merge 1,
Alternate Merge Seat, R2 Alternate Merge, R2 Alternate Merge Seat): a RULING card `RULING -- D<i> vs C<j> -- <grade>` that
- carried the collision line's OLD grade (one of DEFENDER LINK BROKEN, CHALLENGER LINK BROKEN, UNDERDETERMINED),
- whose collision line this send-back regrades to another of those three grades,
- and that no change touches,
takes the NEW grade, marked `(derived by the engine from the collision grade of D<i> vs C<j> after the change of S<k>; pkgRCD, as W3 2362)`.
Same precedent as the derived KEYSTONE line (E-APPLY, W3 2362). The judge's CHANGE TO decides the grade; the card follows it. A card that already
disagreed before the send-back is left alone (D38 still raises it). It appears in APPLIED as "RULING (derived)".

Not covered: K-CMT/K-CMTL (a first-pass contested grade line without its Commitment N), which also recurs on Matthew 1:18.

Base: LIB v31_RI5B (pkgLIB/strip_RI5B; carries v29 RI4 and v30 RI5A). Restacked 11-08 (the first build on v29 as "v30_RCD", 1a3deef,
collided with W1's v30/v31 and is withdrawn). Out: pkgLIB/strip_RCD, packed as pkgLIB_v32_RCD (Shared Library bdff20a871cd; all 30 stubs
change line indices). E4 rebase: pkgLIB_v32_RCD/e4_rebase (Alternate Build de29ff1dc09a, Early Alternate Build 1aba6a303a25): v32 stub head
(lines 1-8) plus live s64 lines 9+ (equal to the v31 e4_rebase tails); both rebuild to 306698 bytes, equal to strip_RCD Alternate Build.

Test (test_RCD.txt):
1. w3_combined_replay strip_RI5B vs strip_RCD: 1140 node runs, 1117 identical, 23 differ (Gate Build 11 runs, Alt Gate Build 2, Alternate Merge Seat 10).
2. Gate item keys: 31 D38|COL items removed in 13 runs, 0 items added, no other item removed (33750: gemini D1 vs C1; grok D1 vs C1, D2 vs C5, D5 vs C1).
3. Alternate Merge Seat: equal in all 10 runs once the derived card text, its SUPERSEDED audit line and the applied entry are normalised (verdicts unchanged).

Rebuild: node pkgRCD/build_RCD.cjs && (cd /tmp/x && LIB_N=30 node <wall2024>/pkgLIB/pack.cjs <wall2024>/pkgLIB/strip_RCD)
Write: Shared Library -> bdff20a871cd plus the 30 stubs from pkgLIB_v32_RCD/patched, with the two e4_rebase files in place of the plain
Alternate Build and Early Alternate Build stubs. v32 includes v29, v30 and v31; write after or with them.
