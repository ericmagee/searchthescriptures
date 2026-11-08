# pkgUND2: the E-HOLD collision-line option offers only forms the engine applies (W1, pkgFCT finding, Wall 3177)

Send-back wording change, not a DeepSeek enforcer change. Nodes (base pkgGRT/patched = live s61): Send Back Build 91baefb37252 -> ad3910c482c5; Alt Send Back Build e3387f775787 -> a90e0c1b1410.

Fault (pkgFCT on s61, all saved runs): the pkgUND "UNDERDETERMINED GIVES ITS GROUNDS" option offered:
1. "or CHANGE TO: RETRACTED". On a collision line the engine always refuses it ("the CHANGE TO line has no line form the engine reads"): main 145/145, alt 19/19. A collision line is regraded, never retracted (ruling 411, pkgGRT).
2. "(on a witness the side answered: FORCED: <Dn vs Cm> -- MEANS ...)", which reads as the CHANGE TO. Sent that way, the engine always refuses it ("the change has no line label and would replace the whole Dn VS Cm line"): main 145/145, alt 19/19. The rule paragraph in the same item says the FORCED line is given when the gate asks for it.
Live: these refusal reasons appear in the saved Gate Build of 33222, 33249, 33261, 33371, 33389, 33490, 33627.

Change (both nodes, one anchor each; v2 adds the two pkgABS texts, W2 3178):
- " (on a witness the side answered: FORCED: <Dn vs Cm> -- ... FAILS: "...")" -> ", on a witness the side answered, with the FORCED line for the pair given only when the gate asks for it (K-G4)"
- ", or CHANGE TO: RETRACTED, or keep UNDERDETERMINED by CHANGE TO the same line" -> ", or keep UNDERDETERMINED by CHANGE TO the same line"
- pkgABS absence-check cure text: "Otherwise CHANGE TO: RETRACTED, or CHANGE TO the line regraded so it no longer charges <ref> as unanswered." -> "Otherwise CHANGE TO the line regraded ...". sbApply2024 has no handler for a bare RETRACTED on any line (P.RETRACTED needs a pair). This text renders in no saved run, so the replays do not exercise it.
- The same phrase in a code comment ("... or a CHANGE TO line that no longer charges that press as unanswered") is changed to match; comment only.

Tests:
- test_UND2.cjs: 2 OK. 26 runs per node; 22 main and 8 Alt runs have changed asks; all other bytes are equal. The only other effect: the ask cuts the enforcer reason to a fixed length, so the shorter option shows more of its tail before "[...]".
- pkgFCT on pkgUND2: main 275 offered, 0 refused, PASS; alt 53 offered, 0 refused, PASS (fct_main.txt, fct_alt.txt).
Build: node pkgUND2/build_UND2.cjs (from wall2024/).
