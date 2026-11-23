# ASK 562: "against" heads that LAY does not read as blocks (W1, PLAN draft 1)

DRAFT ONLY. Nothing is written. Grading by W3, anchor check by W4, then the operator's approval of exact text, queued behind ASKs 557 to 561 (coordinator 17:12 CST 11-23).
Basis: the remainder stated in ASK 559/560 plan draft 1b (W3 10994 N2); rulings 397 to 400 (PROVEN STRUCTURE: a press carries its layers); ruling 421.
Read: LAY rebuilt from the Shared Library LIB/MAP of fetch-back 5bc57e2a (11,691 characters), its block reader CP and MD; IMP's AG rule (D2B Build); debate_results of the last 30 days for "against" heads.
Scope: LAY's block reader only. BAR's "against" rule (only "no ..." sentences are harvested there) is not changed: an against block is a charge or press against the other side, and its witnesses, not its charge sentence, carry the layers.

## What the record shows
1. LAY builds blocks only from lines that match CP. CP takes LINK, C<n> AGAINST, [CD]<n> SUPPORTED/kept, "Answer ... press", PREMISE <n>, D<n>, PRESS(ES) and numbered markdown points. A head "## Against D1: ...", "**Against D1 (Matthew 1:16).**", "## Against the answer to D1" or "D3 against C5:" is not a CP head. A markdown head ends the block before it (MD) and opens none, so the text under such a head is read by no structure test.
2. Offline, live LAY: an "against" block of absence sentences with references gives 0 items under each of those four heads. A well-footed against block (two verses on [L1] and [L3]) also gives 0, because it is never read.
3. Frequency: in the last 30 days, 50 rounds in 184 runs carry such a head (mostly DR1; also CR2, CR4, DR2; the latest are runs 37719, 37812 and 37891). Samples (runs 36212, 37203, 37719, 37891) show these are the side's presses against the other side's links, written with [L1] to [L4]. Run 41822 has none.

## Change (Shared Library LAY, engine and child)
Anchor: in LAY's `const CP=` literal, the alternative `PRESS(?:ES)?\b)` (one occurrence in LAY).
Exact change: `PRESS(?:ES)?\b)` becomes `PRESS(?:ES)?\b|against\s+(?:the\s+answer\s+to\s+)?[CD]\d+\b|D\d+\s+against\s+C\d+\b)`.
The existing prefix `^[\s#>*_-]*` already admits "##" and "**", and CP carries the i flag. "C<n> AGAINST" is already a head and is unchanged.
Effect: the text under such a head becomes a block that LAY reads, as a PRESS block is today. An against block with fewer than two referenced verses on [L1]/[L3] lines, or with no [L1] verse, gets today's STRUCTURE item in the one send-back.
Both Shared Libraries (engine and child; the child's Library Check compares lib and map sha), with both "library sha" headers reset in the same write. If ASK 557 Change D or ASK 559 Change 1 are released in the same write, the sha is reset once for all.
Independence: offline, the change flags the absence-only against blocks with or without ASK 559 Change 1, because an "Against D1:" head is not itself an absence sentence, so absent() is false for the block.

## Revert
Restore both Shared Libraries from the pre-write export; compare md5; Library Check passes in both.

## Test
1. Offline on the cut code, already run: absence-only blocks under "## Against D1:", "**Against D1:**", "D3 against C5:", "## Against the answer to D1:" give 0 items before and 1 after; a well-footed block under "**Against D1:**" and under "## Against D1:" gives 0 before and 0 after; control "LINK 2:" well-footed gives 0 and 0; run 41822, all eight rounds, identical before and after (4,0,0,0,4,0,0,0).
2. Required before release (not yet run; 790,816 characters, too large for my harness's route): replay LAY before and after on the 50 historical rounds found by `debate_results` created in the last 30 days whose round text matches `(^|\n)[\s#>*_-]*\**\s*([CD]\d+\s+)?against\s+[CD]\d`. Report new STRUCTURE items per round. Each new item is either a true missing layer (the change works) or a false send-back (the change is too wide); the team reads them before the operator is asked.
3. Library Check passes in engine and child.

## Risk stated
This widens the send-back. Against blocks that are footed but quote one verse only will now be sent back, as a PRESS block with one verse is today. Test 2 measures how often.
