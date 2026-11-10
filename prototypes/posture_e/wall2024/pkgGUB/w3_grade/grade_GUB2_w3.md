# W3 regrade of pkgGUB rev 2 (W2; Wall 4307, commit bf2c0762) on live s111

## RESULT: PASS
Graded file: /mnt/project-files/wall2024/parent_s111_GUB2.json, sha256 starting 43cc5eafe107672a. My first grade (rev 1 on pkgGCC narrow rev 3, Wall 4296) was FAIL on one form: when a later gate change of the same judge rewrote the line, the recheck read the superseded answer. Rev 2 reads the line in effect. Both directions now pass.

## Size (measured by me against the s111 fetch-back)
+1,333 code: Shared Library +1,189; Gate Record, Alt Gate Record, R2 Alt Gate Record +48 each. 418 nodes, connections equal. No prompt text.

## Method
Same labels as the first grade (labels_GUB_w3.md, commit a4163ef3; addendum for s111 and for k4, k5 committed before those ran). Replay of 34626 on s111 with the stored replies remapped to the s111 item numbers; one chain run per process. Luna's control is 1; the planted item is S6 (gate item G1, D2 vs C1); every label reads one lower than on s110. W2 is right that my s110 harness named S10; on s111 I plant S6. W2's own s111 run is unremapped (luna 11); mine does not depend on that. Outputs: w3_gub2_s111_out.txt, w3_gub2_s111_k_out.txt; control with live as candidate: w3_gub_s111_control_out.txt.

## Cases (luna: live s111 with the plant, candidate; label)
- Stored, no plant: rows equal to live.
- a good pkgUND line 1, 1 (off); e STANDS with [L1] and answer quote 1, 1; g straight quotes 1, 1; h a pkgECF counted line with a failing new line 1, 1 (not this package's rule; comes off as on live); m1 E-UNG item, line passes 1, 1. All as labelled.
- b [L1] words not in the verse 1, 2; c no statement of what is left open 1, 2; d only [L3] 1, 2; f STANDS without the answer quote 1, 2; l2 verse rows unavailable and a failing line 1, 2; m2 E-UNG item with no counted [L1] 1, 2. The count stays on the candidate, as labelled; live forgives each.
- i1 the counted line names another seat, i2 it names another item: 2, 2; stays.
- k1 G1's line fails, the later applied G2 on the same line passes: 1, 1 (off). The written row holds the passing line. PASS (rev 1 kept the count).
- k2 G1's line passes, the later applied G2 fails: 1, 2 (stays). The written row holds the failing line. PASS (rev 1 took it off).
- k4 both items counted, final line passes: both off (1). k5 both counted, final line fails: both stay (3). PASS.
- Record only: j an [L1] verse not read in this run, and l verse rows not available with a good line: the count comes off (1), as on live.
- Gate rows equal to live in every case: no log row changes, no rolled-back insert owed.

## With pkgGCP rev 1b
In the rebuilt Gate Record source the two packages change different lines: pkgGUB one line (the send-back count filter), pkgGCP three (the reader's return, the gate-skip return, the final return); none in common. Both rewrite the packed Shared Library, and pkgGUB also changes the three Gate Record stubs, so the two files cannot be written one after the other as they are: the second must be rebuilt on the first, and that joint file must be graded. I have NOT run the two together; no joint file exists. I see no rule conflict: pkgGUB decides whether a send-back count comes off, pkgGCP whether a cure-step count comes off, and each count comes off at most once.

## Not reached by me
The alternate and round 2 alternate gate paths on s111 (W4 has claimed them); a three-step chain of gate changes on one line; a live run.
