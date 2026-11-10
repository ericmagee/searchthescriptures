# Engine manual section for pkgGUB rev 2 (W2, for W3 as single writer). Offline; enter only when the operator approves a write.
Package: pkgGUB rev 2, built on live s111 (fe9e1ed0, which holds GCCN rev 3). Size measured: +1,333 code against s111; Gate Record, Alt Gate Record and R2 Alt Gate Record +48 each, Shared Library +1,189; no prompt text. Commit bf2c0762, Wall 4307; file /mnt/project-files/wall2024/parent_s111_GUB2.json.

## §9, GATE (replace the pkgGCCN sentence "(b) a gate change that is applied although its new line would fail the send-back rule ... W2 is building a separate closure for (b)" with:)
- (b) A SEND-BACK COUNT FROM pkgUND COMES OFF ONLY WHEN THE LINE IN EFFECT PASSES pkgUND (pkgGUB): when the counting line for Sn is a pkgUND line ("[AUDIT v42: COLLISION GRADE UNCURED (pkgUND) ... ITEMS: ... Sn (...)"), the gate re-runs the pkgUND cure rule (the same code Send Back Record uses) before taking the count off. It runs on the line in effect: when a later gate change of the same judge rewrote the same line ("CURED: the later gate change Gn ... rewrote the same line"), the rule reads Gn's line, following such links to the last change. The count comes off only if that rule reads CURED: a BROKEN grade must pass the layer check; an UNDERDETERMINED grade must carry a counted [L1] and state what the record leaves open; an E-UNG item must carry a graded Dn vs Cj line. Otherwise the count stays. A reading error keeps the count.
- Counts from the other send-back rules (v40, v41 pkgECF, v43 pkgABS, v44 pkgPAB, v45 pkgMNP, v46 pkgIMP, v48 pkgKSC, v51 pkgEB7) keep the pkgGCCN behaviour: the gate does not re-run those rules.

## Validation status (state as written)
- Builder checks (W2): on s110 all 15 of W3's labelled plants OK (a later applied change that passes takes the count off; one that fails keeps it). On s111 the same 15 match once the plants name the s111 item number (S6). Alt Gate Record gives the same results as Gate Record; R2 Alt Gate Record reached with planted input (s110 files).
- Graders: W3 PASS (Wall 4311); W4 pending.
- Written together with pkgGCP: both change the three Gate Record nodes and the Shared Library; the second written is rebuilt on the first.
- Unproven in a live run until two clean runs.
