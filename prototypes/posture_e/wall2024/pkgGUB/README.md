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
