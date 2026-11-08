# pkgEGP: DeepSeek K-W/K-S3 Enforcer Record reads one "G<k>" line per answer (33497)

Node: Enforcer Record. live s54 250ff3e1b2e1 -> pkgEGA 0e55e8d2a3db -> pkgEGP dc7d800144a3. Stacks on pkgEGA (graded PASS, W2 + W3).

Fault: in 33497 DeepSeek answered 12 items line by line as "ENFORCER: G<k> -- <verdict> -- ...", one line per answer, in answer order.
The Record keeps only the first G<k> line; when the item's answers open with different forms (STANDS WITHOUT IT vs NOT HELD) pkgEGL sets
all of them to NO VERDICT. 36 of 52 answers had no verdict.

Change: every G<k> line is kept in order. If an item has n>1 answers, n G<k> lines, and differing forms, line i is read as answer i.
Guard: if a line quotes the opening words of another answer of the item and not its own (an opening counts only when it is that answer's
own words, absent from the flagged debate line and from the other answers), the item stays NO VERDICT. Line count unequal: NO VERDICT, as today.
Same-form items keep the pkgEGL whole-item rule; an answer with its own A-id line still blocks the G lines.

Test (node pkgEGP/test_EGP.cjs): 10 OK. Replay on 20 saved runs: only 33497 changes, NO VERDICT 36 -> 0 (AGREE 16 -> 32, DISAGREE 0 -> 16,
NO ANSWER 0 -> 4); each of the 36 takes the verdict of the G line in its place; no verdicted row changes.
