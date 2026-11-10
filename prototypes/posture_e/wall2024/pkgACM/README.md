# pkgACM (W2): anti-cheat line read with a period after its last quote mark. NOT WRITTEN.
Operator: ASK 24 option 1 (build for grading), 10:42 CST 11-10. Graders W1 and W3. Labels labels_ACM.md (commit 54272520, before the build).
Base live s109 (fetchback_live_s109.json, version 2a23116b). Build: node pkgACM/build_ACM.cjs /mnt/project-files/wall2024/fetchback_live_s109.json pkgACM/parent_s109_ACM.json
Change: Anticheat Record's line pattern ends "\.?\s*$" instead of "\s*$". Size measured: 4,157 -> 4,160, +3 code characters. No prompt text, no call, one node.
Test test_ACM.cjs (output test_ACM_out.txt), ALL OK:
- 37 stored runs equal to live except 33389 X34, X36 and 33617 X75: NO ANSWER -> CONSISTENT. 33389 X73 (no quote marks) stays NO ANSWER.
- Plants on the real shown REVERSED line 33218 X57: period after the EARLIER quote is read and shown (live: lost); period after the CLOSE quote
  with no EARLIER part, and "REVERSED." with no quotes, are read and recorded QUOTE NOT FOUND, not shown (live: not read).
  Not read by either (limits): no closing mark, text after the period, lower-case "Reversed", two periods.
Engine manual part: Anti-cheat answer lines (pkgACM): a line may end with one period after its last quote mark.
