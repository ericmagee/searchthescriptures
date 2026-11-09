# pkgOCB: the Oracle's start briefing on closing contradictions (item B of Wall 3714)

Builder W4. Graders W1 and W2. Base: live s83 (0762c262, 394 nodes). Wording: Wall 3715, file /mnt/project-files/w4/itemB_oracle_contradiction_briefing_wording.md; approved by the operator in the W4 thread at 15:08 CST 11-09 ("approved").

One wording change from 3715, reported to the operator: B2 says "After your OPPONENT'S GRANTS section (if you write one)". The added words "(if you write one)" cover a closing round with no GRANTS section.

## What changes (13 code nodes; no node added; connections unchanged)
- B1, Init with Guards: the CONTRADICTION WATCH paragraph is added to the Oracle seat prompt only (the oracle branch of build(); defender prompt unchanged). It lands after the panel text and before PROVE YOUR POSITIONS; a pure insertion.
- B2, C4 Build: the OPPONENT'S CONTRADICTIONS ask is added to the [DR4] request, only when the challenger prompt carries B1 (byte-equal to live otherwise).
- B3, the 12 nodes that define __ogrS (Build Synthesis, Build Independent Verdict, Build Save Body, Panel Build, Format Markdown, D4 Build, D4 Extract, C4 Build, C4 Extract, C4G Extract, D4B Extract, C4B Extract): quotations inside the CONTRADICTIONS section (X lines) are blanked the same way as the GRANTS section (G lines), so the defender's words quoted there are not read as the Oracle's own claims.
- B4, C4, C4G and C4B Extract: new output field `contradictions` (RECORD ONLY): {section, none, lines[{x, on, earlier_round, earlier, closing_round, closing, earlier_found, closing_found, found, why}], found, not_found}. A line is found only when the EARLIER quote (3+ words) is word for word in the named defender round CR1 to CR3 and the CLOSING quote (3+ words) is word for word in CR4. Item A's enforcer reads this field; B itself breaks nothing.

## Proof (tests/, run from wall2024/pkgOCB/tests)
- t2/t3: B1 changes only csys (the Oracle prompt), as a pure insertion; dsys unchanged. B2 present with B1; C4 Build byte-equal to live without B1.
- t4 (10 OK): on 34108, real C4 Extract output equal to live apart from `contradictions` (section false). Planted terra case [CR3] "I grant that this is the ordinary means" vs [CR4] "Genesis 4:1 therefore cannot supply the sequence for Matthew": found. Refused: invented earlier quote, earlier tagged CR4, wrong earlier round, two-word quote. NONE read. Two lines with markdown and curly quotes read.
- t5 (6 OK): new __ogrS identical in all 12 nodes; equal to live on 33 saved raws and on GRANTS-only text; X quotes blanked; G quotes still blanked; body quotes untouched.
- t6b: all 47 saved runs x 11 changed nodes: 317 node runs equal to live apart from the B1 text and the B4 field; 0 differ (200 skipped where live also cannot run offline).

## Build
python3 build_OCB.py /mnt/project-files/wall2024/fetchback_live_s83.json parent_s83_OCB.json (every anchor asserted once; B3 asserts exactly 12 nodes).

## Manual part (for W3)
CONTRADICTION WATCH (pkgOCB, item B of the operator's contradiction rule, 11-09). The Oracle's seat prompt tells it that a closing-round contradiction is perjury: it tracks what the defender states from the first round, and a closing-round [CR4] statement that cannot be true together with an earlier statement is a contradiction which, once the enforcer confirms it, breaks the chain link by default; a later withdrawal does not undo it; the same rule binds the Oracle. In [DR4] the Oracle writes an OPPONENT'S CONTRADICTIONS section (X<n> LINK/PREMISE <n> | EARLIER [round] "words" | CLOSING [CR4] "words" | why), or NONE. Quotations in that section are blanked wherever the Oracle's text is read as its own claims (__ogrS, 12 nodes). C4, C4G and C4B Extract record the section in `contradictions`, marking each line found only when both quotations are word for word in the rounds named (record only; item A's enforcer confirms).
