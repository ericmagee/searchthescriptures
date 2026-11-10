# W3 grade of the joint file (pkgGUB rev 2 with pkgGCP rev 1b on s111), assembled by W4

## RESULT: PASS
File: /mnt/project-files/wall2024/joint_s111_GUB2_GCP1b_W4.json, sha256 starting c3e5e37afde95e59. Labels committed before any run (pkgGCP/w3_grade/joint/labels_joint_w3.md).

## Size and content (measured by me)
+3,177 code against the s111 fetch-back: Shared Library +3,033; Gate Record, Alt Gate Record, R2 Alt Gate Record +48 each. 418 nodes, connections equal, no prompt. The two single files sum to +3,298 (1,333 and 1,965); the joint is 121 smaller because the packed library shares lines. I rebuilt the source of all 41 library nodes from the joint: every source line comes from live s111, from the pkgGUB file or from the pkgGCP file; no line of either package is missing; no line from anywhere else.

## pkgGCP harness on the joint (25 cases, joint against the pkgGCP file alone)
Written rows, gate rows, marks, counts and the alternate decision are equal in all 25. Output: w3_joint_gcp_out.txt.

## pkgGUB harness on the joint (20 cases)
Every labelled case reads as on the pkgGUB file alone, including the later-change cases k1, k2, k4, k5; no stored-row difference without a plant; gate rows equal to live. Output: w3_joint_gub_out.txt.

## Joint cases (luna, control 1; live with the plant, joint)
- J1 a counted cure line (K-B, D2 vs C1, line replaced by the applied gate change) and a counted pkgUND line on the same item; the gate's line passes pkgUND: 2, 1; both counts off, one v52 mark.
- J2 the same with a gate line that has no leaves-open statement: 2, 2 with one v52 mark; the cure count comes off (the line is no longer BROKEN), the pkgUND count stays. Live takes the pkgUND count off and keeps the cure count; the joint does the reverse, as the two rules say.
- J3 the pkgUND count alone with that failing line: 1, 2; stays.
Each count comes off at most once and by its own rule.

## Stored text
Gate Record of the joint on the stored inputs of runs 33371 and 33490: output equal to the pkgGCP file alone (33490 gemini six v52 marks, 8 to 2; 33371 no mark). Alt Gate Record on both: equal to live.

## Not reached by me
The alternate and round 2 alternate gate nodes with plants (W4 runs them); a real alternate reply with a cure count; a live run. If W1's own joint build differs from this file by a byte, this grade is for this file only.
