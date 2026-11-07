# pkgL1Q (W3 Wall 2861/2864; run 33371)

Enforcer fix, side-neutral. Base: live s44 (24eb8692). 23 nodes. Build: `node pkgL1Q/build_L1Q.cjs` -> `pkgL1Q/patched/` + `patched.plan.json`.

(a) ECL PAIR (Send Back Build/Record, Alt Send Back Build/Record): a single-quoted quote after a verse reference also pairs
    (opening mark after a non-letter; an apostrophe followed by a lower-case letter neither opens nor closes it). l1 reads `q=p[5]||p[6]`.
    Counting still needs kkjvIsVerseQuote and kkjvStands.
(b) cureReasoned final test (19 cure/gate/alternate nodes): a single-quoted span of 3+ words (pkgRXR RESPONSE form) counts only when it
    stands in a round the carrier body names (cureFound). `__l1qSq` is inserted before `function cureReasoned(`.

## Test (`node pkgL1Q/test_L1Q.cjs`, output test_L1Q.txt): 25 unit OK, 246 node replays, 0 FAIL
- 33371 chatgpt: all 6 removal items flip UNCURED -> CURED: Send Back Record E-HOLD D2 vs C6, D1 vs C1, D3 vs C6, D4 vs C3, D6 vs C2
  ("[L1] COUNTED; states what the record leaves open"); Panel Cure Check K-G4 D5 vs C4 ("retracted").
- Negatives stay out: apostrophe-only lines, possessives after a reference, single-quoted string standing in no round, no round named,
  span under 3 words, no rounds served. Double-quoted lines pair exactly as before.
- Send Back Build items no longer sent (sbb_diff.txt): 33218 sol 6, 33222 chatgpt 8, 33249 chatgpt 6, 33371 chatgpt 4. Each one's
  flagged [L1] is a single-quoted verse that stands in the KJV row (checked by kkjvStands in the same run). 33299: one item's text changes
  (the pkgUNA "no counted [L1]" clause drops); the set of sent items is unchanged.
- 33276/33289/33311/33322 Panel Cure Check / Gate Record errors and every "Alternate Build: await" error occur identically on base and patched
  (harness limits, empty saved inputs).

## Out of scope, noted
- KKJV_Q (Commitment 12 KJV quote check, kkjvPairs) also reads double quotes only. That makes it miss single-quoted non-KJV quotes
  (leniency, not a false removal). Not changed; W3 to rule.
