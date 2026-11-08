# pkgFCT: form conformance test (W1, 11-08). Approved redesign item 1, step 1.

For every option form a send-back ask offers, the test writes that form for the item's own flagged line, answers every item with it, and runs the engine's own chain: Send Back Build -> synthetic reply -> Send Back Record -> Gate Build (sbApply2024). It fails when the engine refuses an offered form for its form ("no line form the engine reads", "has no line label", "drops the collision", a CONCEDED LINKS or CHAIN MARK move).

Run (from wall2024/): `node pkgFCT/fct.cjs pkgGRT/patched/Send_Back_Build.js pkgEHF/patched/Send_Back_Record.js pkgLIB/strip_GDA19/patched/Gate_Build.js main` (alt: the Alt_ files and `alt`).

## Result on live s61 code, all saved runs (result_main_s61.txt, result_alt_s61.txt)

| Offered form | main offered / refused | alt offered / refused |
|---|---|---|
| RETRACTED: <pair> (pkgGRT) | 66 / 0 | 19 / 0 |
| pair regraded UNDERDETERMINED | 209 / 0 | 34 / 0 |
| bare `CHANGE TO: RETRACTED` (pkgUND option) | 145 / 145 | 19 / 19 |
| `FORCED: <Dn vs Cm> -- MEANS ...` as the CHANGE TO (pkgUND option, parenthetical) | 145 / 145 | 19 / 19 |

All refusals are E-HOLD items on collision lines (the pkgUND "UNDERDETERMINED GIVES ITS GROUNDS" option), in 22 runs.

1. Bare RETRACTED: the option says "or CHANGE TO: RETRACTED". On a collision line the engine refuses it ("the CHANGE TO line has no line form the engine reads"). Per ruling 411 / pkgGRT a collision line is regraded, never retracted. The option offers a form that can never apply.
2. FORCED form: the option's parenthetical "(on a witness the side answered: FORCED: <Dn vs Cm> -- MEANS ...)" reads as a CHANGE TO form. Sent as the CHANGE TO, the engine refuses it ("the change has no line label and would replace the whole Dn VS Cm line"). The rule paragraph below it says the FORCED line is given "when the gate asks for it", so the parenthetical contradicts it.
Live evidence that judges take these forms: saved Gate Build outputs show these refusal reasons in 33222, 33249, 33261, 33371, 33389, 33490, 33627.

Note: the test checks form only (does the engine apply the offered form), not content.
