# pkgESH: DeepSeek K-W/K-S3 Enforcer Build sends the section holding the sentence when no link block holds it (33575)

Node: Enforcer Build. live s55 ad7e363b555b -> f1af9c2387d1.

Fault: a round headed "## Answer to C1: ..." (or "## D2 — ...", "## ANSWERS TO C1 ...") has no block the link-heading pattern reads, so the
excerpt sent to DeepSeek was only "(no block of this link found)". In 33575 DeepSeek wrote DISAGREE on all 12 answers of those 4 K-W items
("footing the side never gives this link"), though Luke 2:4, Luke 1:34, Genesis 24:16 and Hebrews 2:14 stand in the same section.
Saved runs: 114 empty excerpts in 15 runs (33218 29, 33389 19, 33461 17, 33299 15, 33506 9, ...).

Change: when no headed block of the round holds the sentence and the sentence is found in that round, the excerpt opens with that round's
section holding it (nearest "#" heading or "---" rule before it to the next), labelled "it sits under no link heading"; a longer section is cut
to 2000 characters around the sentence (1400 before). Every other excerpt is unchanged.

Test (node pkgESH/test_ESH.cjs): 7 OK. 17 runs; all 114 empty excerpts filled, each holds its sentence; no other item changes; 33575 items 1-4
carry the cited verses. Prompt size: 33218 95k -> 149k chars, 33389 49k -> 80k, 33461 91k -> 121k, 33575 137k -> 143k.
Not testable offline: DeepSeek's new verdicts on those items (needs a live call).
