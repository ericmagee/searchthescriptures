# pkgCJR: the cure reader reads a JSON cure reply that is not valid JSON (W2, 11-09)

Source: W3 grade of run 34016 (Wall 3547, /mnt/project-files/w3/grade_34016.md, countermeasure 1).
Case: Haiku, seated as alternate for luna, answered 15 of its 17 cure items with RESPONSE lines, but inside the "reasoning" string of a JSON verdict (enforcer log row 27957). That string carries unescaped quotation marks (for example `ANSWER: "Hebrews 7:14 names the tribe"`), so the reply is not valid JSON (the database refuses it as JSON at that token). The cure reader's `cureUnwrap` gave up and returned the raw text, whose line breaks are the two characters `\n`; `cureLines` saw one line, read no RESPONSE, and logged "no written response" for all 17 items. Haiku was not counted.

Change, in the 26 library files that carry `cureUnwrap`: when JSON.parse fails and the reply opens with `{`, holds `\n` escapes and a "reasoning" (or "reason", "answer") string, the new function `cjrLoose2024` reads that string from its opening quotation mark to the closing `"}`, with `\n` and `\"` unescaped. This is what gateRead2024 already does for the gate reply. A reply that parses, and a plain-text reply, are read exactly as before.

Base: live s75, library strip_WLG (Shared Library ed1ec6fb07c0). Independent of pkgKNL; the second of the two to be written restacks.
- Build: `node pkgCJR/build_CJR.cjs` -> pkgLIB/strip_CJR (26 files change), plan_CJR.json.
- Pack: `LIB_N=30 node <abs>/pkgLIB/pack.cjs <abs>/pkgLIB/strip_CJR` from a scratch dir, moved to pkgLIB_CJR. Shared Library ed1ec6fb07c0 -> 979b18b4d8e8.
- E4 rebase: `FB=/mnt/project-files/wall2024/fetchback_live_s75.json node pkgLIB/e4_rebase.cjs pkgLIB_CJR`. Alternate Build a4058f4d0524 -> 6d2546f7bc12, Early Alternate Build 9d20eaf9deb4 -> 64aa453cfcf0; every stub rebuilds.

Tests:
- `node pkgCJR/probe_CJR.cjs`: 7 OK (probe_CJR.txt). A reply in the shape of row 27957 reads 0 -> 5 RESPONSE lines; valid JSON, plain text and invalid JSON without `\n` are unchanged; all 122 saved cure call replies read the same.
- `node pkgCJR/test_CJR_34016.cjs`: 5 OK (test_CJR_34016.txt). Run 34016's own inputs through Alternate Merge Seat: live s75 reproduces 17 Haiku items, none cured, all "no written response". With pkgCJR every RESPONSE is read; 7 items cure; 7 K-W items stay uncured on content (NOT HELD with a reason that does not quote the flagged sentence, the rule terra and sol meet); K-F FORCED has no response (it is the "FORCED: none graded." item that pkgKNL removes upstream). So, read correctly, Haiku still fails 7 LIVE K-W items: a judge form failure for W3 to rule.
- `node pkgCJR/test_CJR_lib.cjs`: replay of every saved run, strip_WLG vs strip_CJR: 593 node runs over 46 runs, 590 byte-equal, 0 cure flips. The 3 changes are Panel Cure Build 1 on 33345, 33371 and 33411: each judge's verdict was invalid JSON with `\n` inside its reasoning, so the cure request listed no BROKEN links; with pkgCJR it lists the links the judge graded CHALLENGER LINK BROKEN (33345: D1 vs C1, D2 vs C3, D3 vs C5, D4 vs C4, D6 vs C6; 33371: D1 vs C1; 33411: D6 vs C1), each read from the judge's own lines.
