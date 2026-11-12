# pkgKWH rev 3 and pkgBRS (W2; built on live s152; Worker_A3 Wall 5200 items 3b and 3a)

Parent (KWH rev 3 + BRS): wall2024/parent_s152_KWH3_BRS.json. Built from wall2024/fetchback_live_s152.json, pkgKWH first, then pkgBRS. Earlier parents 22bcb009 (rev 1) and cf732b75 (rev 2) are superseded.
Size (MEASURED): stored code +728 (Shared Library +848; 12 nodes -10 each). Rebuilt run-time code +3,072 (4 nodes +798 each, 12 nodes -10 each). Prompt template 0.

## pkgKWH: K-W skips a heading-shaped "What I grant and what I withdraw." only when a K-W sentence follows it
- Where: kwLines421 (Shared Library), the skip test, one line. It reaches Panel Payloads, Alternate Payloads, R2 Alternate Payloads and Extract Independent Verdict.
- Rule: a K-W match ("I grant", "I withdraw", "I concede", "I drop", "I do not claim", "I no longer claim") is skipped when all three hold:
  1. it is a heading-shaped clause: "What" begins the sentence or line, the clause may chain ", what I <verb>" or "and/or what I <verb>";
  2. the clause ends at once with . ! or ?, or with the end of the line (with or without a colon) (rev 2, W1 Wall 5211);
  3. a K-W verb ("I grant", "I withdraw", ...) follows it before the next "#" heading line, the next "What I <verb>" clause, or the end of the round (rev 3, W3 Wall 5215).
  Otherwise the item is raised exactly as on live.
- Fault fixed: 35379 [CR2] "**What I grant and what I withdraw.** I grant that ..." gave two false K-W rows in every seat ("I grant and what I withdraw." and "What I grant and what I withdraw."). Two seats were left uncured on it (sol, argon).
- Still raised as on live (tested): "What I withdraw is LINK 3 ...", "LINK 3, which I withdraw.", "That is what I grant.", "What I grant here is that ...", "What I grant: seed may mean descent.", the real "I grant that ..." after the heading, and every heading with no K-W sentence after it: "What I withdraw. LINK 3 as an exclusion witness.", "is / what I withdraw / from LINK 5" across lines, "What I withdraw:" then "- LINK 3.", and a line holding only "What I concede".
- GENUINE CASE THIS WILL MISS (as W1 asked): a heading clause followed by a real withdrawal with no K-W verb AND, later in the same section, some other K-W sentence. Example: "What I withdraw. LINK 3 as an exclusion witness. I grant that seed may mean descent." The heading is skipped, so the LINK 3 withdrawal raises no item; the later "I grant ..." still raises its own item.
- FURTHER LIMITS (W3 Wall 5220, MEASURED by W3):
  - The following verb is any K-W verb, even one the reader then sets aside. "What I withdraw / LINK 3 as an exclusion witness. I concede nothing else." gives 0 items (live 1): the heading is skipped and "I concede nothing" is not an item.
  - A following K-W verb inside a quotation also counts.
  - The following verb may stand any distance below, up to the next "#" heading or "What I <verb>" clause.
  Measured on every stored ODV1 round text in debate_enforcer_log: the only "What I <verb>" forms are 35379 (the heading fixed here), 35296 "## What I grant, so that I do not rest on it" and 33020 "## 0. What I concede, so the rest can stand" (both already skipped by the existing "#" heading rule). The miss does not occur in the stored runs.

## pkgBRS: a bare reference with no book of its own goes to the named-earlier list
- Where: C4P.refs, in 12 nodes (Build Synthesis, Build Independent Verdict, Build Save Body, Panel Build, Format Markdown, D4 Build, D4 Extract, C4 Build, C4 Extract, C4G Extract, D4B Extract, C4B Extract). One exact anchor per node.
- Change: bare:r.head&&!r.book&&r.pos>r.at becomes bare:!r.book.
- Fault fixed: 35379 D4 charged "1 Corinthians 1:18" as a new verse. The close wrote "1:18 places ..." at the start of a sentence; the book came from the scope of the earlier sentence, and the old test needed pos>at, which a sentence-initial bare reference never meets. Matthew 1:18 and Numbers 1:18 were named earlier. With pkgBRS it moves to the named-earlier list: "1:18 (Matthew 1:18, Numbers 1:18 named earlier)".
- Still new (tested): a reference with its book written out ("1 Corinthians 1:18"), and a bare reference whose chapter:verse was never named earlier.
- GENUINE CASES THIS WILL MISS (as W1 asked):
  1. A bare reference to a truly new verse whose chapter:verse number was named earlier in another book. Example: earlier "Matthew 1:23"; close "Paul writes in 1 Corinthians 1:17 ... 1:23 names Christ crucified." 1 Corinthians 1:23 is new but goes to the named-earlier list, not the new-verse list. The named-earlier list still shows it, with the earlier book.
  2. The same for a bare reference after a book in the same sentence. Example: Luke 1:20 named earlier; close "Matthew 1:18 and 1:20" (or "Matthew's account at 1:20"). Live charges Matthew 1:20 as new; with pkgBRS it goes to the named-earlier list. This is a change made by the package, not an old behaviour (correction from W3 Wall 5215; the rev 1 text said the old test already did this, which was wrong).
- Stored runs (5 with close-enforcer prompts: 34726, 34852, 35067, 35296, 35379): one list changes, 35379 defender (the fault above). No other change.

## Tests
- pkgKWH/test_KWH.cjs: 19 planted forms PASS (1 marked KNOWN MISS), 5 stored runs, 1 change (35379, the 2 false rows).
- pkgBRS/test_BRS.cjs: 4 planted forms PASS (1 marked KNOWN MISS), 5 stored runs, 1 change (35379 ofD).
- Both run the same on the joint parent.
