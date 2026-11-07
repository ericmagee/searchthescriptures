# pkgUNXS: the K-UNX reader reads bare numbered entries

**Gap.** unxSegs, the reader K-UNX and K-UNX-A use for a count section, reads only "Premise N" entries. pkgCLR reads 198 UNEXHIBITED premise entries in the 142 stored verdicts, and 19 of them (10%) are bare numbers that unxSegs does not read. Examples are "-- 6 UNEXHIBITED", "; 2 UNEXHIBITED" and "counted: 1 UNEXHIBITED", almost all from grok (29609, 31360, 32980, 32998, 33021). Neither rule can raise on those entries.

A second effect: the last counted entry ran on into the spared list, so a "narrowed" or "VOID" in that list exempted it (as in "Spared: 2, 3, 4, each narrowed ...").

**Edit (one function, 22 nodes).** unxSegs also opens an entry at a single digit followed by UNEXHIBITED, CONCEDED or WITHDRAWN, after "--", ";", ":", "." or the line start. It ends an entry at "Spared". A verse number is not read, because the digit must be followed by the tag word. With this edit, 0 of the 198 entries go unread.

**Bases.** The 6 gate-library nodes are built on pkgGSL2/patched and the other 16 on pkgASM/patched (s16 + GSL + PSG + UNXA + ASM + GSL2). Write it after GSL2.

**Replay (replay_UNXS.txt).** K-UNX items go from 59 to 69, with 0 lost and 10 added:
- 32980 grok D6: K-UNX-A ASSUMES on [L1] Acts 2:30, the case from my pkgUNXA reconciliation.
- 32980 grok C2.
- 32998 grok D2, D4, D5 and D6.
- 33021 grok C1 and C2.
- 32717 grok C6 and 33020 grok C6, which "narrowed" in their spared list no longer exempts.

All 10 are counts that rest on fit or meaning against a block with 2 or 3 layer kinds, the class K-UNX exists to raise.

**Test.** `node pkgUNXS/test_UNXS.cjs` gives 11 OK. It covers the build identity (only unxSegs changes), 5 reader units, the replay, and parity of the real Panel Payloads and Alternate Payloads nodes on the saved 33222 inputs.
