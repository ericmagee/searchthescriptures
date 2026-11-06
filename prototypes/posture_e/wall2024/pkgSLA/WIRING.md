# pkgSLA wiring (for W4). Base: live 22e92b40 (n21, fetchback_n21.json). Independent of pkgBAR and pkgJFL (no shared node).
Write: the jsCode of the 6 sbApply2024 nodes from pkgSLA/patched/: Gate Build, Gate Record, Alt Gate Build, Alt Gate Record, Alternate Merge,
Alternate Merge Seat. plan_SLA.json gives each base_sha (must equal the live node) and final_sha. One edit per node, the same in all six.
Revert: the 6 nodes' jsCode from the pre-write fetch-back.
What it does: a CHANGE TO whose flagged line is not in the judge text goes over the one judge line with the same label (sbLabel: CHALLENGER
CONCEDED LINKS, CONCEDED LINKS, a STANDING line, KEYSTONE, CLAUSE, or a collision pair). No such line, or more than one: refused as before.
Run report: per seat, the E-GATE and SEND-BACK ITEM lines "the flagged line is not in the judge text" (should fall), and any E-GATE UNCURED.
Not covered (W1 2645): a K-V answer written as a bare "Premise N: NOT VOID ..." has no label and is still refused; the gate then asks for the
whole line, which pkgSLA applies (33175 chatgpt and sol).
