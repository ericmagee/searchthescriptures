# pkgRP13: reader phase 2 item 13, Main Enforcer Build's STATEMENT read (W4, 11-08)

Tracker RP2-13 (W3 order item 13: "__estOf (STATEMENT K-W/K-S3)").

Enforcer Build (the DeepSeek prompt builder for K-W/K-S3 checks) quotes each judge's STATEMENT line next to its RESPONSE (`|| STATEMENT: ...`). `__estOf` finds that line in the judge's cure reply with `^STATEMENT\s*:\s*(K-W|K-S3)\s+(.+?)\s*\|\s*([\s\S]*)$`.

The swap: the shared reader reads the line first.
- It must be the STATEMENT form, which=STATEMENT (not RESPONSE), with an item before the first "|" that starts with K-W or K-S3.
- The result is returned in the old match shape [line, rule, item, text]. The old regex decides otherwise.
- Enforcer Build gets the reader block, the same embedded text Send Back Build carries, about 19 KB.

Known difference by construction: when the text after the item holds another "|", the reader joins the parts with " | " where the old read kept the raw spacing. The prompt already collapses whitespace, so only "a|b" written with no spaces changes, to "a | b". This is not seen in the corpus.

Test (test_RP13.txt): Enforcer Build, 31 runs, all byte-equal. The reader decided 17,732 reads, so the reader path is live. TOTAL 2 OK, 0 FAIL.

Base: s66, where Enforcer Build = pkgRTB d6413758c205. Build: `node pkgRP13/build_RP13.cjs <fetchback_live_s66.json>`.
