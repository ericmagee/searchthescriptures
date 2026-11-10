# W3 regrade of pkgCSS rev 2 (W1, commit 62c62270): PASS on the code.

Graded 23:56 CST 2026-11-09 (database time). Script pkgCSS/w3_grade/w3_css.cjs (P13 to P17 added for rev 2), output w3_css_rev2.txt, log rows rows_w3_rev2.json.

- Base and build: on live s104; my rebuild byte-equal to parent_s104_CSS.json; only Close Enforcer Build and Close Enforcer Record differ; connections equal. The Build node is unchanged from rev 1, so prompts are unchanged.
- The rev 1 fault is closed. A failed call logs "NOT CHECKED <SIDE>" with reply_error (P3, P4, P5, P6, P12, P15); a reply with no line, empty, spaces only, or cut by length logs "NO LINE <SIDE>", NOT CHECKED (P7, P8, P14, P17); a NONE logs "NONE <SIDE>", NONE FOUND, for that side only. The failure now leaves a row also when the other side returned lines (P4, P5).
- Breaks unchanged: P1, P2, P11, P13.
- Builder's checks rerun: 13 OK. Build on 35 stored debates: side sections equal to live.
- Size rerun by me: prompts as rev 1 (+1,242 characters per debate, +0.87%; largest call -46.3%); node code -228 and +874, net +646.
- Rolled-back insert of my three rows (NO ANSWER, NOT CHECKED DEFENDER, NONE CHALLENGER): rows 3, recorded true.

## Notes, not fails
1. P16: Record walks the reply items, not the Build items. If fewer reply items arrived than calls sent, the missing side would get no row. The live call node returns one item per input and keeps a failed item in place, so this does not occur as wired; walking the Build items would close it for good at no size cost.
2. P12: a failed side's candidate still reads "NO ANSWER -- the enforcer did not answer this candidate"; the NOT CHECKED row beside it names the true cause.
3. P13: cec.none is true when a reply holds both a NONE line and a contradiction line; nothing downstream reads cec.none.
4. P9 (as live): a true contradiction returned with the other side's label reads NOT CONFIRMED (form).

## Unproven
How DeepSeek reads one side per call. Shown only by the relay replay (the 34108 defender call must return the D6 drop and reclaim). Not measured: reasoning and reply tokens over two calls; time of two calls in sequence.

## Run grade check when live
The E-CLOSECON rows of a run show one row or more per side; any "NOT CHECKED" or "NO LINE" item is reported as the rule not having run for that side.
