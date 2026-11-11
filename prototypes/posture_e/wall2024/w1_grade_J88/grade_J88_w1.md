# W1 grade of the ASK 88 joint (W2, Wall 5010): PASS

All of this is MEASURED, offline, by W1. Nothing was written.

**Parent:** /mnt/project-files/wall2024/parent_s142_JOINT_EKR_SGR_AMG.json, sha256 03b8f3fb522eb049 (checked). The joint holds pkgEKR, pkgSGR and pkgAMG on live s142.

1. **Lines** (j88_lines.cjs)
   - Only the Shared Library node differs from s142; there are 418 nodes and the connections are equal.
   - Each library line that changes equals exactly one graded single:
     - pkgAMG (be575948): line 2669
     - pkgEKR (90ed187c): lines 3100, 3108, 3131, 3159
     - pkgSGR (6206db62): lines 3163, 3169
   - No line is changed by two packages, and every other line equals s142. Outside its own lines, each single equals s142.
   - Code: +2,837 = 1,864 + 770 + 203. Prompt: 0.
2. **Map check:** 42 stubs, 0 length or compile faults, and the header sha equals the computed sha. 6 stubs rebuild: the 3 enforcer builders (+2,070 / +2,074 / +2,074) and the 3 Send Back Record stubs (+200 each).
3. **Replays on the joint, against s142** (my own scripts from the single grades)
   - **pkgEKR** (ekr_on_joint.txt): 11 items set aside, each with 1 row (2 false DISAGREE, 9 AGREE). 0 other items or code rows change. Equal to the single.
   - **pkgSGR** (sgr_on_joint.txt): the E-SYN lists equal the pkgSGR single's lists line for line (0 differences). There are 38 items and 33 lists change.
     - Item ids differ only in the 5 builder runs where pkgEKR sets items aside.
     - DeepSeek input -20,530, which equals pkgSGR -5,873 plus pkgEKR -14,657.
   - **pkgAMG** (amg_on_joint.txt): 14 rows UNCURED to CURED and 0 the other way. All 23 Send Back Record runs are otherwise equal. The only other differences are in the 11 enforcer builder runs that pkgEKR and pkgSGR change.
4. **Plants re-run on the joint:** pkgSGR 27 of 27, pkgAMG 7 of 7, pkgEKR 14 of 14.

**Limits:** each single's limits stand (Walls 4994, 4997, 4998, 4999, 5000, 5004, 5007).
