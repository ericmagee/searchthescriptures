# pkgFUM rev 2: one follow-up for the items a cure reply left without a countable line (W4, 11-09)

Source: W3 grade of run 34016 (Wall 3547, countermeasure 4). Operator approval 05:15 CST "approved" (Wall 3552); extended to a missing quote, operator "yes" 05:31 CST (relayed by the coordinator).

REV 2 (W1 FAIL, Wall 3581): from the follow-up only the lines of an asked item are read (fumKeep2024): its RESPONSE and STATEMENT lines labelled with the item, the five-line card under an asked K-RUL item's RESPONSE line, and a RETRACTED, RESTATED, PRESSED or SHORT line naming an asked item's own D<n> vs C<m> link. Every other line (other items, CORRECTED RESULT/COUNT/STANDING, prose) is dropped, so a follow-up cannot change an item it was not asked about. Base is now live s76 (library strip_CJR_KRC, fetchback_live_s76): Shared Library 3f7270edaa30 -> 14d8a04681a0; E4 nodes unchanged; 30/30 stubs rebuild; target 509 nodes, 11 code changes. test_FUM 20 OK (adds W1's case B: D2 #2 keeps CURED, summary and bodies equal the clean follow-up; card and label matching probes). With KRC live, luna is asked only 27621. Replay 192 Normalize runs, 185 byte-equal, 7 asks, 0 other differences.

Rev 1 text follows (base s75 numbers).

Before a cure reply is counted, the engine sends ONE follow-up to the same judge, in the same conversation (the cure request, the judge's own reply, then one short user turn), listing only:
1. NO LINE: items the reply left with no line at all (the reader's "no written response", with no malformed line of its own), e.g. luna 34016 K-W CHALLENGER DR3 LINK 3 #3 (row 27621);
2. NO QUOTE: K-W, K-CON and K-S3 items answered NOT HELD whose reason does not quote the flagged sentence (still UNCURED).
A reply that answers everything sends nothing. The follow-up is asked once: the second pass through Normalize joins the replies and asks nothing more. The follow-up reply is read first, then the first reply (the reader takes an item's first RESPONSE line, so a re-asked item reads its new line). A failed follow-up call leaves the first reply exactly as it was. openrouter only (every panel and alternate judge runs through openrouter today); other providers ask nothing.

Wiring, per cure path (Panel 1, 2, 3, Alternate, R2 Alternate, Cure), 18 new nodes:
`<Normalize>` -> `FUM Needed? <tag>` (IF `$json.fum`) -> true: `FUM Call <tag> openrouter` (copy of the path's openrouter call; body `$json.fum.body`) -> `FUM Merge <tag>` -> `<Normalize>` (second run); false: the Normalize node's old targets.
Library: only the 6 Normalize sources change (new functions fumAsk2024, fumJoin2024; the tail reads fum_done). The other 24 sources are byte-identical. Readers downstream are unchanged; they read the Normalize node's last run.

Base: live s75, library strip_WLG (Shared Library ed1ec6fb07c0).
- Build: `node pkgFUM/build_FUM.cjs` -> pkgLIB/strip_FUM (30 files, 6 changed), pkgFUM/plan_FUM.json (nodes and wiring).
- Pack: `LIB_N=30 node <abs>/pkgLIB/pack.cjs <abs>/pkgLIB/strip_FUM` from a scratch dir, moved to pkgLIB_FUM. Shared Library ed1ec6fb07c0 -> 5e0e9712c2f7.
- E4 rebase: `FB=/mnt/project-files/wall2024/fetchback_live_s75.json node pkgLIB/e4_rebase.cjs pkgLIB_FUM`: Alternate Build and Early Alternate Build unchanged; every stub rebuilds.
- Target: `node pkgFUM/target_FUM.cjs <out.json>`: 509 nodes (491 + 18), 11 jsCode changes (6 Normalize, Shared Library, and the stubs of Extract Independent Verdict, Panel Payloads, Alternate Payloads, R2 Alternate Payloads, whose library line numbers moved); 30/30 stubs rebuild to strip_FUM from the target's Shared Library.

Tests:
- `node pkgFUM/test_FUM.cjs` (test_FUM.txt), run 34016, 15 OK: terra and sol answered everything: no follow-up, byte-equal. luna: the follow-up asks exactly 27621 and 27622 (K-RUL keystone), nothing else; answered, 27621 goes UNCURED -> CURED in Panel Cure Check, every other luna item keeps its status. A failed follow-up reads the first reply as before. Haiku (alternate, 27957, live reader): asked once for its 17 items. Terra's reply with one quote taken out: asked only for that item (NO QUOTE); answered with the quote, it cures.
- `node pkgFUM/test_FUM_lib.cjs` (test_FUM_lib.txt): every saved run, 192 Normalize runs: 185 byte-equal with no follow-up, 7 would have asked (all NO QUOTE: 33261, 33345, 33430 x2, 33490, 33497, 33828), 0 other differences. (Run 34016 has no index file in inputs/, so it is covered by test_FUM.)
- Note for the first live run that fires a follow-up: n8n reads a node's last run by default, so the readers see the joined reply; if it ever read the first run, the result would equal today's (no follow-up), never worse.
