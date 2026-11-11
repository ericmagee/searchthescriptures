## pkgSGR: the E-SYN list of a side's own grants (W1)

**What it changes.** The DeepSeek enforcer's E-SYN item checks a synthesis sentence that says a side granted, conceded, dropped, withdrew or narrowed something. The item shows DeepSeek "THAT SIDE'S OWN SENTENCES THAT GIVE GROUND", built by giveUp (Shared Library line 3163) from that side's four rounds. pkgSGR changes which paragraphs giveUp lists.

1. It now lists grant forms the old test missed:
   - "It is granted that"
   - "This is granted"
   - "<verse> is granted"
   - "which I granted"
   - "I have conceded"
   - "I keep my earlier grants"
   - "I keep what I granted"
   - "I keep dropped"
   - "stays dropped"
   - a sentence that opens with the label "Grant.", "Granted:" or "Concession:"
2. It no longer lists the other side's grants:
   - Quoted text is not read.
   - A sentence whose subject is the other side is not read. Examples: "the defender grants it to", "The defender narrowed", "conceded by the challenger".
   - So a challenger's list of the defender's grants ("G3 [CR4] "I grant that ..."") no longer fills the challenger's own list.
   - System notes quoted into a round no longer fill it either (closing contradictions, anti-cheat).

The call site (line 3169) passes the side. Nothing else changes: the same items, the same ids, the 3500-character cap, and the sort by word overlap with the sentence.

**Why.** In run 35173 both E-SYN DISAGREEs were false. The grants the synthesis named were missing from the list, and the challenger's list held the defender's grants. Both stored DISAGREEs of 33497 have the same cause: "**Grant.**" and "Granted:" were not read.

**Size, measured.**
- Code: +771 characters in the Shared Library. Each of the 3 enforcer Build stubs rebuilds +713.
- Prompt fixed text: 0.
- DeepSeek input, judged from the replay of 8 stored runs: +21,998 characters in total.
  - 35173: +36,688, and 1 more call (8 to 9).
  - The other 7 runs: -8,018 to +359.

**Limits.**
- A gerund grant ("Granting that ...") is not read, now or before.
- A grant inside quotation marks in the side's own text is not read. A side that quotes its own earlier grant is still listed when it states the grant outside the quotes.
- The 3500-character cap can push lower-ranked entries out (21 entries over 38 items in the replay). This happened before too.
- Record-only trial: no seat effect.
- Whether DeepSeek's verdict changes needs a paid replay. It is not measured.
