# pkgGUB (W2, offline candidate; nothing written live)

On top of pkgGCCN rev 2 (W1). Closes case (b): a gate-cured line takes its send-back count off only when the
gate's new line also passes the send-back rule that counted it.

## Change
- Gate Record, Alt Gate Record, R2 Alt Gate Record: the GCCN2 count-off filter gains `__gub(r,g.seat,p.verdict_raw)`.
- `__gub`: if the counting audit line for this S is a pkgUND line ("(pkgUND)"), re-run the existing pkgUND rule
  (`UND.cure`, Send Back Record lines 613-697, already shared in the Shared Library) on the gate's new line; the count
  comes off only when that returns CURED. Any other counting rule: GCCN2 behaviour, unchanged.
- No prompt text. Build: `node pkgGUB/build_GUB.cjs <s110 fetch-back> pkgGUB/parent_s110_GUB.json`.

## Size (measured)
All Code text +1,712 against s110 (GCCN2 alone: +728; pkgGUB adds +984 over GCCN2). Prompt: none.

## Limit
Only lines counted by pkgUND are re-checked. Lines counted by pkgECF (E-COL v41), ABS, PAB, MNP, IMP, KSC and B7 keep
GCCN2 behaviour; re-running those rules would need their own code (enf428Cure and others) in the Gate Record.
Alt and R2 Alt Gate Record did not run in 34626 (NOT REACHED there; same text as Gate Record).

## Tests (W2 builder checks; graders W3 and W4)
- caseb_GUB_out.txt (luna, execution 34626, plant on Gate Record):
  - B1 pkgUND line, gate's new line UNDERDETERMINED with only [L3]: count stays 3 (GCCN2 took it to 2).
  - B2 pkgUND line, stored gate line ([L1] Matthew 1:19, 1:18, states what is left open): 3 to 2.
  - B4 E-UNG item, failing new line: stays 3 (GCCN2: 2). B5 E-UNG item, stored line: 3 to 2.
  - B3 broken new line: gate raises K-B/K-G4, stays 4 (as GCCN2).
- regress_GUB_out.txt: 34626 as stored equals s110; C2 to C7 as GCCN2. 8 OK, 0 FAIL.
- t_1062_GUB_out.txt: stored 1062 still 12 to 11 (S8 counted by pkgECF, so pkgUND is not called); other plants as GCCN2 rev 2.

## Rebased on GCCN rev 3 (GUBBASE=GCCN3, the default now)
`node pkgGUB/build_GUB.cjs <s110> pkgGUB/parent_s110_GUB_on_GCCN3.json`. SIZE (measured) +1,719 against s110 (+984 over GCCN3's +735). Same four nodes.
on_GCCN3_out.txt: 34626 equals s110; C2-C7 and C8v51 (v51 count off) as GCCN3; B1 3, B2 2, B4 3, B5 2, B3 4. t_1062_GUB_on_GCCN3_out.txt: 12 -> 11.

## Rev 2 (W2, 11-10): the line in effect, rebased on s111
- W3's FAIL narrow (Wall 4296): when a later gate change Gn of the same judge rewrote the line, rev 1 rechecked the first change's line. Rev 2 follows the "later gate change Gn" chain (at most 9 steps) to the line in effect and runs UND.cure on that line.
- Built surgically on live s111 (fe9e1ed0): `node pkgGUB/build_GUB_s.cjs /mnt/project-files/wall2024/fetchback_live_s111.json pkgGUB/parent_s111_GUB2.json`. Four nodes change: Gate Record, Alt Gate Record, R2 Alt Gate Record (+48 each, three $() names) and Shared Library (+1,189). SIZE +1,333 code against s111 (measured), prompt 0. Every other stub rebuilds to its live source.
- Gate/pack.cjs re-pack of unchanged s111 is not byte-equal to live (Shared Library +1,868, Alternate Build stub differs), so this build does not use it.
- W3 harness on s111: run with W3_SID=S6 (on s111 the D2 vs C1 item is G1 = S6; on s110 it was S10). Luna's base count on this replay is 11 on s111 against 2 on s110, so label 2 reads 11 and label 3 reads 12. All 15 labelled cases match; output w2_grades/gub/w3h_GUB2_s111_S6.txt.
