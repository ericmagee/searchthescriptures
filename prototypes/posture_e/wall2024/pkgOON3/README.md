# pkgOON3 (W3, offline; nothing written): the two open limits of pkgOON rev 2
Authority: the operator in the W3 thread, 17:44 CST 2026-11-10: "you are authorized to make the necessary changes for those two items" (limits 2 and 3 of /mnt/project-files/w3/limits_joint_of_four_w3.md).
Base: live s115 (fetchback_live_s115.json). File: /mnt/project-files/wall2024/parent_s115_OON3.json. Build: node pkgOON3/build_OON3.cjs <fetch-back> <out>.

## Change (Shared Library only, three lines)
1. Line 1634, the send-back applier (10 nodes): the strike words are also read after the label "OUT-OF-ROUND CONCESSIONS:". So "OUT-OF-ROUND CONCESSIONS: NONE" given as the answer to one row strikes that row, as NONE does. +36 code.
2. Line 3615, the reason "the line names X but the round is the other side's" (3 nodes): the judge is now told "; write the corrected row, or CHANGE TO: STRUCK". +47.
3. Line 3617, the reason "COUNTED ends a line from [round]" (3 nodes): the quoted rule words are replaced by "; CHANGE TO: the row without COUNTED". -47.

## Size (measured)
Code: +36 (Shared Library 922,823 to 922,859). Fixed prompt text: 0. Send-back item text, only when the case occurs: the other-side reason 47 characters longer, the COUNTED reason 47 shorter.

## Tests (test_OON3.cjs, test_OON3_b.cjs; stored 34726)
- Only the Shared Library differs; 13 library-read nodes rebuild to a different source; 42 stubs rebuild and compile.
- No plant: Gate Build, Send Back Build and Judge Enforcer Build give the same output on live and candidate.
- Applier: "OUT-OF-ROUND CONCESSIONS: NONE", with a space before the colon, in brackets, and with STRUCK after the label, are NOT APPLIED on live and strike the row on the candidate; the result equals the plain NONE result. The bare label, "NONETHELESS" after the label and a row after the label stay NOT APPLIED. Other seats equal.
- Reasons: with one row planted on the other side and one planted COUNTED, exactly those two rows differ, each by the edit; reversing the edits gives live byte for byte.
- The forms told are read: a corrected row applies; STRUCK applies; on a COUNTED row the row without COUNTED applies.

## Limits
- A row ending COUNTED answered with a strike word (now also after the label) is still refused with its own reason. The COUNTED reason tells the form that is read.
- "CONCEDED LINKS: NONE" given as the answer to an out-of-round row is applied on live as on the candidate (seen in the test; unchanged; not examined).
- The record-only re-reading of a replaced line (pkgVP1) still reads only STRUCK as a strike; it counts nothing.
- Whether the CONCEDED LINKS count stays right after a row loses COUNTED: not examined here; the live applier already tells judges this form.
- NOT REACHED: that a judge told a form writes it. Only a live reply shows it.
- Correction of my own limits list: on live the link-round reason already tells the strike form (line 3614). Two reasons lacked a told form, not three.
