# pkgKWH and pkgBRS (W2; built on live s152; Worker_A3 Wall 5200 items 3b and 3a)

Parent: wall2024/parent_s152_KWH_BRS.json (sha256 22bcb009f8613ab9). Built from wall2024/fetchback_live_s152.json, pkgKWH first, then pkgBRS.
Size (MEASURED): stored code +394 (Shared Library +514; 12 nodes -10 each). Rebuilt run-time code +1,804 (4 nodes +481 each, 12 nodes -10 each). Prompt template 0.

## pkgKWH: K-W skips a heading-shaped "What I grant and what I withdraw."
- Where: kwLines421 (Shared Library), the skip test, one line. It reaches Panel Payloads, Alternate Payloads, R2 Alternate Payloads and Extract Independent Verdict.
- Rule: a K-W match ("I grant", "I withdraw", "I concede", "I drop", "I do not claim", "I no longer claim") is skipped when it is only a heading-shaped clause:
  "What" begins the sentence or line, the clause may chain ", what I <verb>" or "and/or what I <verb>", and it ends at once with . ! or ?, or with the end of the line (with or without a colon). Rev 2 (W1 Wall 5211): the line end closes the clause, so "**What I grant and what I withdraw**" with no end punctuation is skipped too.
- Fault fixed: 35379 [CR2] "**What I grant and what I withdraw.** I grant that ..." gave two false K-W rows in every seat ("I grant and what I withdraw." and "What I grant and what I withdraw."). Two seats were left uncured on it (sol, argon).
- Still caught (tested): "What I withdraw is LINK 3 ...", "LINK 3, which I withdraw.", "That is what I grant.", "What I grant here is that ...", "What I grant: seed may mean descent." (text after the colon on the same line), and the real "I grant that ..." after the heading.
- GENUINE CASES THIS WILL MISS (as W1 asked):
  1. A heading line "What I withdraw:" (colon ends the line) followed by items that carry no K-W verb, for example "- LINK 3." The parent raised a K-W row on the heading; pkgKWH raises none, and the items below are not K-W matches. A real withdrawal written only as a list under such a heading is not caught.
  2. A line holding only "What I withdraw" (no punctuation) meant as a statement, not a heading. It is skipped.
  3. A bare one-sentence answer "What I withdraw." or "What I grant and what I withdraw." used as a full statement rather than a heading. It is skipped.
  Measured on every stored ODV1 round text in debate_enforcer_log: the only "What I <verb>" forms are 35379 (the heading fixed here), 35296 "## What I grant, so that I do not rest on it" and 33020 "## 0. What I concede, so the rest can stand" (both already skipped by the existing "#" heading rule). Neither miss occurs in the stored runs.

## pkgBRS: a bare reference with no book of its own goes to the named-earlier list
- Where: C4P.refs, in 12 nodes (Build Synthesis, Build Independent Verdict, Build Save Body, Panel Build, Format Markdown, D4 Build, D4 Extract, C4 Build, C4 Extract, C4G Extract, D4B Extract, C4B Extract). One exact anchor per node.
- Change: bare:r.head&&!r.book&&r.pos>r.at becomes bare:!r.book.
- Fault fixed: 35379 D4 charged "1 Corinthians 1:18" as a new verse. The close wrote "1:18 places ..." at the start of a sentence; the book came from the scope of the earlier sentence, and the old test needed pos>at, which a sentence-initial bare reference never meets. Matthew 1:18 and Numbers 1:18 were named earlier. With pkgBRS it moves to the named-earlier list: "1:18 (Matthew 1:18, Numbers 1:18 named earlier)".
- Still new (tested): a reference with its book written out ("1 Corinthians 1:18"), and a bare reference whose chapter:verse was never named earlier.
- GENUINE CASES THIS WILL MISS (as W1 asked):
  1. A bare reference to a truly new verse whose chapter:verse number was named earlier in another book. Example: earlier "Matthew 1:23"; close "Paul writes in 1 Corinthians 1:17 ... 1:23 names Christ crucified." 1 Corinthians 1:23 is new but goes to the named-earlier list, not the new-verse list. The named-earlier list still shows it, with the earlier book.
  2. The same for a bare reference after the book in the same sentence ("1 Corinthians 1:17 and 1:23"), which the old test already treated this way when r.head held.
- Stored runs (5 with close-enforcer prompts: 34726, 34852, 35067, 35296, 35379): one list changes, 35379 defender (the fault above). No other change.

## Tests
- pkgKWH/test_KWH.cjs: 11 planted forms PASS (2 marked KNOWN MISS), 5 stored runs, 1 change (35379, the 2 false rows).
- pkgBRS/test_BRS.cjs: 4 planted forms PASS (1 marked KNOWN MISS), 5 stored runs, 1 change (35379 ofD).
- Both run the same on the joint parent.
