# pkgRHN: the round-heading normalizer rewrites only a heading line
Base: live s156 (fetchback_live_s156.json). Parent: wall2024/pkgRHN/parent_s156_RHN.json.
Nodes: the 17 round Extract nodes that carry the normalizer (D1-D4, C1-C4, C3G, C4G, C1B, D2B, C2B, D3B, C3B, D4B, C4B Extract): +180 jsCode each, +3,060 total. Prompt 0. MEASURED.
Rule: among the first three non-empty lines of a round, a line naming a wrong "Round N" is rewritten only when it is a heading.
It is not a heading when the word before "Round" is a possessive, article or preposition ("my round 1", "in round 2").
A line without heading markup (#, **, __) is also not a heading when it is over 160 characters, has over 40 characters before "Round", or holds a sentence break inside it.
Why: run 35554, the defender's close sentence "I keep D1 through D6 as declared in my round 1, none narrowed and none conceded." was rewritten to "... in my round 4 (close) ..."; the stored round and every confirmed contradiction line quoted the altered words.
Stored: 8 normalizations in review notes; 7 are "#" headings (all still normalized, byte-equal to live); 1 is the 35554 body sentence (now left alone).
Tests: 26 of 26 (7 stored headings, 6 plants, syntax of all 17 nodes, only 17 nodes differ, connections equal).
Limit: a bold body sentence that names a wrong round with no preposition before "Round" (e.g. "**Round 2 grants stand.**") is still treated as a heading.
Seen, not changed: the live normalizer drops the text between the round number and a following "close"/"closing" word ("# Round 3: Closing the Challenge" becomes "# Round 2 the Challenge"). Old and new are equal there.
