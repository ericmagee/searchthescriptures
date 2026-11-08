# pkgRP15: reader phase 2, item 15 (RP2-15, W4)

Judge-line reads in the two report/save nodes now ask the shared reader (`__RL.readLine`) first. Where the reader gives no answer, the old regex decides, so nothing the old read accepted is lost.

| node | read | reader first | fallback |
|---|---|---|---|
| Format Markdown | `beforeCure` own-line test | form RESULT, CLAUSE or KEYSTONE | `/^[ \t*_]*(RESULT\|CLAUSE\|KEYSTONE)[ \t*_]*:/` |
| Format Markdown | `seatReason` | first line read as RESULT (one of the three results) with a reason that does not start with punctuation | the old RESULT ... -- reason regex (pkgFMQ) |
| Build Save Body | `block()` CONCEDED LINKS line and count | form CONCEDED, `f.side` = the side, integer `f.n` (bare CONCEDED LINKS = DEFENDER) | the old label regex; the text after the label is the old slice when it matches, else what follows the colon and count |

Both nodes get the reader block, the same embedded text Send Back Build carries (as pkgRP10/12/13).

The seatReason punctuation guard exists because the reader reads `RESULT: DEFENDER WINS. The verses ...` (gemini, 33490) as RESULT with reason `. The verses ...`. The engine treats that line as having no reason form (the enforcer flagged RESULT REASON), so the report must not show one. That is a reader-spec question for W3: should a RESULT reason need a dash separator?

Not touched: closeLabels and press in Format Markdown read debater text, which inventory line 129 puts out of scope.

Base: the staged s66 (`/mnt/project-files/wall2024/s66c/target_s66.json`). Neither node changes between s65 and s66: Format Markdown e1c296a588da -> patched, Build Save Body 0cccca27dab7 -> patched (see plan_RP15.json).

Build: `node pkgRP15/build_RP15.cjs <target>`. Test: `node pkgRP15/test_RP15.cjs <target>`.

Test: Format Markdown has 28 runs and all are byte-equal. Build Save Body has 28 runs and all are byte-equal. TOTAL 4 OK, 0 FAIL. Of the saved runs, 1 (FM) and 5 (BSB) are skipped because the base node itself throws on their saved feeder.

Also in this commit: pkgRP13's test output file is renamed to test_RP13.txt. It had been test_RP12.txt because of a copy slip; no code changed.
