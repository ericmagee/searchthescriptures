# pkgRLF: the closing enforcer reads "[round N]" as the side's own round (W2, 11-10)

Finding (W4, Wall 4107): in 2 of 13 set C defender replies (33442 send 2, 33705 send 2) DeepSeek wrote "[round 4]" / "[round 2]" in place of
[CR4] / [CR2]. Close Enforcer Record accepts only [CR n]/[DR n], so every line in those replies was recorded NOT CONFIRMED (form) and no link broke.

Change (Close Enforcer Record only; code only, no prompt text): each round label of a CLOSE-CONTRADICTION line may be [CR4] / CR4 / [CR 4] / [cr4]
or "round 4" / "[round 4]" / "[Round 4]" / "[round4]". A "round N" label is read as the line's own side's round N (CR N on a DEFENDER line,
DR N on a CHALLENGER line). Every other check is unchanged: the earlier round must be that side's round 1 to 3, the closing round its round 4,
both quotations must stand word for word in the rounds so read, and the link must be declared.

Base: live s106. Write file: pkgRLF/parent_s106_RLF.json (418 nodes; only Close Enforcer Record differs).
Build: node pkgRLF/build_RLF.cjs /mnt/project-files/wall2024/fetchback_live_s106.json pkgRLF/parent_s106_RLF.json
Size (MEASURED): Close Enforcer Record 11,649 -> 11,835 characters (+186 code); prompt 0; model calls 0.

Label scan (every CLOSE-CONTRADICTION answer line stored under staged_w4/ and w3/: 311 files, 28 distinct answer lines): EARLIER [CRn] 25,
EARLIER [round n] 3; CLOSING [CRn] 21, CLOSING [round n] 7. No other label form occurs. No E-CLOSECON row exists in debate_enforcer_log (no live run since pkgCEC).

Test: node pkgRLF/test_RLF.cjs (output test_RLF_out.txt). Close Enforcer Build (s106) is run on each run's saved data; live and pkgRLF Record are run on:
- Set A (34108, both sides): same as live (D LINK 3, D LINK 6 broken).
- Set C, 9 replies: 7 same as live; the 2 "[round N]" replies change: 33442 send 2 now breaks DEFENDER LINK 2 and LINK 6 (4 lines CONFIRMED),
  33705 send 2 now breaks DEFENDER LINK 4 (3 lines). Whether those CONFIRMED lines are true contradictions is the enforcer's call, the same as
  for the [CRn] replies; W4 asked W3 (4107) to read the CONFIRMED lines for false positives.
- Plants on the 34108 defender reply, each must read as the [CRn] original: [round N], round N, [Round N], [ROUND N], [CR N], [cr N], [round4],
  mixed [CR3] + [round 4]: all OK. Challenger: a pair built from 34108's own DR3/DR4 sentences reads alike as [DRn] and as [round n]: OK.
- Negative plants, must break nothing: closing [round 5]; earlier given as [round 4]; [DR 4] on a defender line; defender quotations moved to a
  CHALLENGER line with [round n] labels: all OK.
Limit: labels such as "[R4]", "[defender round 4]" or "[closing]" still read as not in form (none occurs in the stored replies).

## Repack on live s107 (s106 + pkgR1)
Write file: pkgRLF/parent_s107_RLF.json, built by build_RLF.cjs on fetchback_live_s107.json. pkgR1 did not touch Close Enforcer Record (the 13 nodes
it changed are the Shared Library and the 12 moved nodes). The new Close Enforcer Record is byte-equal to the graded s106 build; only that node differs
from live s107; connections equal. Size unchanged: +186 code characters.
