# Engine manual section for pkgGUB (W2, for W3 as single writer). Offline; enter only when the operator approves a write.
Package: pkgGUB, on top of pkgGCCN rev 3. Size measured: +1,719 code on s110 (+984 over GCCN rev 3's +735); nodes Gate Record, Alt Gate Record, R2 Alt Gate Record and the Shared Library; no prompt text.

## §9, GATE (replace the pkgGCCN sentence "(b) a gate change that is applied although its new line would fail the send-back rule ... W2 is building a separate closure for (b)" with:)
- (b) A SEND-BACK COUNT FROM pkgUND COMES OFF ONLY WHEN THE GATE'S NEW LINE PASSES pkgUND (pkgGUB): when the counting line for Sn is a pkgUND line ("[AUDIT v42: COLLISION GRADE UNCURED (pkgUND) ... ITEMS: ... Sn (...)"), the gate re-runs the pkgUND cure rule (the same code Send Back Record uses) on the gate's applied new line before taking the count off. It comes off only if that rule reads CURED: a BROKEN grade must pass the layer check; an UNDERDETERMINED grade must carry a counted [L1] and state what the record leaves open; an E-UNG item must carry a graded Dn vs Cj line. Otherwise the count stays. A reading error keeps the count.
- Counts from the other send-back rules (v40, v41 pkgECF, v43 pkgABS, v44 pkgPAB, v45 pkgMNP, v46 pkgIMP, v48 pkgKSC, v51 pkgEB7) keep the pkgGCCN behaviour: the gate does not re-run those rules.

## Validation status (state as written)
- Builder checks (W2, commit 59054865): 34626 written rows unchanged; planted pkgUND line on luna S10: a new UNDERDETERMINED line with only [L3] keeps the count (3), the stored gate line with [L1] and a leaves-open statement takes it off (3 to 2), the same for an E-UNG item; GCCN rev 3 plants C2 to C8v51 unchanged; stored judgment 1062 still 12 to 11 (S8 counted by pkgECF).
- Graders: W3 and W4 (not yet graded). Alt and R2 Alt Gate Record not reached in 34626.
- Unproven in a live run until two clean runs.
