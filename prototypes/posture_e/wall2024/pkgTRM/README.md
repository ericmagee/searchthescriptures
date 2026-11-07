# pkgTRM (W4 efficiency item 2, Eric approved 11:06 CST 11-07): stop copying row arrays no later node reads. Not a DeepSeek fix.

33389: Send Back Record's output was 1091K (enf428_rows 449K, enf421_rows 94K); Gate Record's 1134K (the same plus sb_rows 151K). These arrays ride
along only through "...PASS" copies; every reader takes them by name from the node that made them (Alternate Merge Seat, Alternate Merge, Send Back Build).

Dropped from the passed-on copy (each node's own rows stay):
- Send Back Build / Alt, skip output: enf428_rows, enf421_rows
- Send Back Record / Alt: enf428_rows, enf421_rows
- Gate Record / Alt: enf428_rows, enf421_rows, sb_rows
Base pkgL1Q/patched: SBB b1989a4f714e -> 9abaa7c3db77; Alt SBB f8591b406f60 -> 6ed18e22a8a8; SBR 72a639c32be3 -> 67bd9a89eb88;
Alt SBR cfdab4e103f6 -> 2fb1e7a20d5c; GR 24f4c3437475 -> f735fb29bfc3; Alt GR 3c24514d9537 -> 53583d160066.

Test: node pkgTRM/test_TRM.cjs -> 108 OK, 0 FAIL over every saved run 33218+: each output = base minus the dropped keys; Gate Build, Alternate
Merge Seat and Alternate Merge are byte-equal when fed the trimmed outputs. 33389: Send Back Record 543K smaller, Gate Record 694K smaller
(and Alternate Needed? passes Gate Record's output on, another 694K): about 1.9 MB less execution data per run.
Not trimmed: Alternate Merge Seat / Alternate Merge / Dry? carry enforcer_log (962K), which Write Enforcer Log needs; Format Markdown and Plain
Rule Lines carry the report itself (md 1.2 MB).
Stack: W1's decode-once (Send Back Record) and my pkgEB7 (Send Back Build/Record) touch the same nodes; anchors are one line each, restack in order.
