# pkgGDS: gate and send-back readers accept a dash separator (W1, 11-08)

Approved: Eric "approved" ASK 1 (19:47Z 11-08). Cause: 33798 terra removal, W3 ruling 3362 (TRUE, class gate_reply_dash_separator): terra wrote
"GATE: G1 -- CHANGE TO: CHALLENGER CONCEDED LINKS: 0 -- ... Premises 3 and 4 are spared. -- [CR3] ..." where the form needs "||".

Change: gdsDash2024(l) rewrites such a line to the form before it is read. The first dash (--, em, en, or a spaced hyphen) after the item id becomes
"||"; the LAST dash followed by a round tag (CR1-4/DR1-4, bracketed or not) or a quote mark becomes the "||" before the reason; the rest is the
CHANGE TO line. A line that already has "||" is never touched. Each answer read this way gets a FORM NOTE: on the gate reason (printed in the audit)
and on the logged send-back line (not on the send-back reason, which the cure checks read).
- Library (10 nodes with gateRead2024): base pkgLIB/strip_RTB3 (s67) -> pkgLIB/strip_GDS.
- Send Back Record, Alt Send Back Record, R2 Alt Send Back Record: base s67c/target_s67.json -> pkgGDS/patched.

Tests (pkgGDS/test_GDS.cjs):
- Library: 150 node runs over 43 runs; 1 output changes, 33798 Gate Record: terra (chatgpt) E-GATE G1 and G2 UNCURED -> CURED. Nothing else. 32 OK 0 FAIL.
- Send Back Record x3: 63 node runs over 43 runs, 0 changes. 5 OK 0 FAIL.
Build: node pkgGDS/build_GDS.cjs [base strip] [dest strip] [base workflow].
