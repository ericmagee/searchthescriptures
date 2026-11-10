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

## Rebased on s115 (live 17:15 CST = s114 + joint of four; W4 Wall 4437)
- parent_s115_BRF3.json: +780 code measured over s115, prompt 0; same 12 nodes; sha256 b7e03f70ce7dbafb. Scan identical (0 parse changes; 34726 note only).

## Ledger effect (ledger_diff.cjs, ledger_diff_34726.txt)
- Rev 3 leaves the Shared Library byte-identical, so the ledger is unchanged by construction.
- The fault's own reach in 34726, shown offline: chain of the whole stored run from Init with Guards, s114 against the parser fixed in all 34 copies (rev 1). 43 nodes differ; every difference is the press note ("Deuteronomy 1:18" gone; new_press lists, transcript_chars -18) carried downstream, plus two replay artifacts that also differ in an s114-against-s114 self-check (Panel Judges Prep nonce; Second Alternate? retry field). No ledger line differs. 34108: NOT REACHED (no full export).

## Rev 3b (answers W3 Wall 4439, A6)
- A reference is treated as bare only when it heads its own match with a capitalised word that is not a book ("So 1:18", "In 2:61", "Then 1:18"): r.head && !r.book && r.pos>r.at. The second member of an "and" list ("Numbers 1:2 and 1:18") keeps the s115 reading and is marked NEW. A bare range is not new only when every verse of it was named before (A9).
- Size: +1,296 code over s115 (rev 3 +780), prompt 0, the same 12 nodes. parent_s115_BRF3b.json, sha256 78b22cf6eddcb996.
- W3's labels (run_w3labels_3b.cjs; W3's run.cjs pointed at s115 and rev 3b): 12 AS LABELLED including A6; A9 and A14 RECORD (A9 now marks "Deuteronomy 1:18-25" as live does; A14 drops the false "Luke 2:61" as rev 3 did). 12 copies agree; REFP text unchanged in every node.
- W3's exposure.cjs on 34726: 913 close-round references, 1 treated as bare, 1 suppressed (the fault).
- My scan: 0 parse changes; press notes 6 of 7 equal, 34726 drops "Deuteronomy 1:18".
- LIMITS: (1) a new verse written after a capitalised non-book word ("Then 1:18"), whose chapter:verse was named before under another book, is not marked (A4; the same text shape as the fault); (2) a bare new press is still printed with the borrowed book; (3) the parser fault stays in other scoped uses; no ledger difference on 34726 (shown), 34108 NOT REACHED.

## Rev 3c (answers W3 4439 and W2 4441; supersedes rev 3 and rev 3b)
- SCOPE (W2 4441): the edit is in C4P.refs/fresh, which drives TWO close-round notes: the challenger press check (of, [DR4], "CLOSE-ROUND PRESS CHECK") and the defender new-verse check (ofD, [CR4]). Rev 3's description named the first only; that was my mistake, and my scan tested the press note only.
- Rule: a reference is read as bare only when it heads its own match with a capitalised word that is not a book ("So 1:18", "In 2:61", "Then 1:18"). Such a reference is not new when its chapter:verse was named, under any book, in an earlier round of the list the check reads. Every other reference, the second member of an "and" list ("Numbers 1:2 and 1:18") and a bare reference in brackets ("(1:24)") included, is read as on live. Ranges as rev 3 (any verse named covers the range). Rev 3b's range change is dropped (W2 plant P5).
- Size: +1,020 code over s115 (rev 3 +780), prompt 0, the same 12 nodes. parent_s115_BRF3c.json, sha256 f282bcc676c8a59a.
- W2's harness (run_brf.cjs, LIVE s115, CAND 3c; w2harness_3c_out.txt): 192 plant checks, 0 mismatches; 38 stored runs: press note equal 38, [CR4] note equal 38.
- W3's labels (run_w3labels_3c.cjs): A6 AS LABELLED (Numbers 1:18 marked); A4 NOT AS LABELLED (limit 1 below; W3's "record" case); A7 same as live ("see also Numbers (1:18)" still marked, with Luke as the borrowed book; rev 3 dropped it); A9 same as rev 3 (range dropped when 1:18 was named); A14 drops the false "Luke 2:61"; 12 copies agree; REFP unchanged.
- My scan: 0 parse changes; press notes 6 of 7 equal, 34726 drops "Deuteronomy 1:18".
- What rev 3c gives up against rev 3: W2's six false [CR4] flags on stored runs (33530 "(1:24)", 33575 "(1:13)", 33605 "7:14", 33617 "1:18", "1:32", "1:35") stay as on live; none is headed by a capitalised word.
- LIMITS, for BOTH checks: (1) a new verse written after a capitalised non-book word ("Then 1:18"), whose chapter:verse was named earlier under another book, is not marked (W3 A4); (2) a bare new verse is still printed with the borrowed book; (3) the parser fault stays in the other scoped uses; no ledger difference on 34726 (shown), 34108 NOT REACHED.
