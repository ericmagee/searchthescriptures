# pkgBRF (W1, offline): close-round press check named a verse no round contains ("Deuteronomy 1:18", run 34726)
Fault (W1 Wall 4422 item C; W3 Wall 4431 confirms): [DR4] "Deuteronomy 20:7 sets the taking apart from the betrothal (G43). So 1:18 dates the finding" -> REFP (scoped) gives the bare 1:18 the book Deuteronomy. Cause: the scoped sentence test slices T.slice(lastAt,m.index); when a capitalised non-book word ("So") heads the match, the slice stops before its capital and the break is missed.

## Rev 3 (proposed): press check only, +780 code, prompt 0 (measured on s114)
- build3.cjs: in C4P of the 12 nodes that compute the close-round press note (Build Synthesis, Build Independent Verdict, Build Save Body, Panel Build, Format Markdown, D4 Build, D4 Extract, C4 Build, C4 Extract, C4G Extract, D4B Extract, C4B Extract), a reference written without its own book is not a NEW PRESS when its chapter:verse was named, under any book, in an earlier challenger round. REFP itself is unchanged.
- Scan (scan.cjs, scan_rev3_out.txt): 6,273 stored texts, 313,859 references: 0 parse changes. Press notes on the 7 stored debates with [DR4]: 6 equal; 34726 drops "Deuteronomy 1:18" and keeps John 6:42.
- Plants: bare after another book, c:v named before -> not new; bare, c:v never named -> new (printed with the borrowed book: LIMIT); new press with a book -> new; full book, same c:v, other book -> new.
- LIMITS: (1) a real new press written bare whose chapter:verse was named before under another book is not marked; (2) a bare new press is still printed with the borrowed book; (3) the parser fault itself stays for every other scoped use (the ledger in the Shared Library, the Build/Extract checks).

## Rejected forms (measured)
- Rev 1 (build.cjs REV=1): slice to HEAD.lastIndex in all 34 REFP copies, +238. Scan: 188 references in 143 texts lose their book, 12 distinct; 1 was wrong before (34726 Deuteronomy 1:18), most others were right ("In 7:14" Isaiah, "Then 2:62" Ezra, "At 1:16" Matthew, "In 2:33" Luke). scan_rev1_out.txt.
- Rev 2 (REV=2): a bare reference takes the book of the last earlier "<Book> c:v" with the same chapter and verse, all 34 copies, +3,710. Scan: 15,078 references in 690 texts change book, 182 distinct, mixed right and wrong. scan_rev2_out.txt.

## Which copies feed what (s114)
- 34 REFP copies: the Shared Library (line 512; its scoped calls include the ledger) and 33 nodes. The close-round press note (C4P) is computed in the 12 nodes above. Scoped parsing is used only by those 12 nodes and the Shared Library.
