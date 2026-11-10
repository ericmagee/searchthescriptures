# Debater cache sketch (W2, 11-10, offline, findings only; not posted for grading)

Base: live s114 strip (pkgLIB/strip_W2S114). Data: /mnt/project-files/wall2024/inputs/, 36 runs with Claude usage rows.
Pricing assumed: 1-hour cache write 2x base input, cache read 0.1x, plain input 1x (ESTIMATE from published rates; not checked against the bill).

## 1. Can rounds 3 and 4 hit the cache? No more than they do now.

- C3 and C4 already read the system block: 70,097 tokens each call, every run (MEASURED).
- Their one user message is new text each round (the opponent's newest reply plus the round's instructions). No earlier request ends with it, so no cache entry can match it.
- A hit on that text would need it to be sent earlier, which changes what the debater sees. No form moves or replaces text to make it hit.

## 2. Correction of my Wall 4429

- I framed the round 3 and 4 tokens as a missed reuse costing about 1.9x. That is wrong: nothing reusable is missed.
- The waste is the opposite: each C2, C3 and C4 call writes its new message to the 1-hour cache at 2x, and most of those writes are never read.
- Correction of my own later figure: C3 and C4 writes are NOT all unread. C3G read C3's write in 4 runs (121,598 tokens) and C4G read C4's in 5 runs (164,322 tokens) (MEASURED: G read minus the 70,097 system read).

| Call | Written (36 runs) | Read later |
|---|---|---|
| C2 | 1,159,769 | 0 (no call reuses C2's body) |
| C3 | 1,118,613 | 121,598 by C3G (4 runs) |
| C4 | 1,201,286 | 164,322 by C4G (5 runs) |

## 3. Smallest change (sketch: w2_grades/cache/sketch_cache.cjs)

- C2: mark its first message, not its last (`k===m.length-1` becomes `k===0` in `__mk`). C2's first message, so marked, equals C1's cached message byte for byte in 36 of 36 runs, and the system blocks are equal (MEASURED). So C2 keeps its read of C1's entry and writes nothing new.
- C3 and C4: drop the `__mk` line and send `msgs` unmarked (both the anthropic and the openrouter anthropic branch). The system marker stays, so the 70,097 system read stays.
- Code: C2 -9, C3 -159, C4 -159; total -327 characters (MEASURED). Prompt: 0. The three sketched nodes pass a syntax check.
- Debater-visible text: none. cache_control is request metadata; the model receives the same system and messages.
- Nothing is added; text is only removed or replaced.

## 4. Effect (ESTIMATE, 36 runs)

- C2: 1,159,769 tokens move from 2x to 1x: saves 1,159,769 base-input units.
- C3 and C4: 2,319,899 tokens move from 2x to 1x; the G calls lose their 0.1x read on 285,920 tokens and pay 1x: net saving 2,319,899 - 0.9 x 285,920 = 2,062,571 units.
- Total about 3.22 million base-input units in 36 runs, about 89,500 per run.
- Risk: C3G or C4G firing more often than 4 to 5 runs in 36 lowers the saving; it stays positive even if a G call fires in every run.

## 5. D side (added 11-10 after the coordinator's ask; MEASURED unless marked)

- D2, D3 and D4 read only the small system block (median 3,721, 2,936, 2,936 tokens). Their message writes are read only by their B calls: D2B 15 calls, D3B 7, D4B 31 with usage rows.
- Timing (inputs/ node start and run times; gap = B call start minus the D call's end): every timed pair is 0 to 2 seconds. D2B 13 pairs, D3B 7, D4B 25, C3G 2, C4G 2, all at most 2 seconds; 17 B calls and 5 G calls carry no time in the stored file (NOT REACHED for those).
- So a 5-minute TTL on the D message marker keeps every timed read. Sketch w2_grades/cache/sketch_cache_D.cjs: in D2, D3, D4 the message marker becomes `cache_control:{type:'ephemeral'}` (5 minutes; the system marker keeps 1 hour, which the longer-first order allows). Code +14 per node, +42 total (MEASURED); prompt 0; nothing the debaters see changes. Syntax check passes.
- Saving (ESTIMATE): 3,226,277 written tokens move from 2x to 1.25x: about 2,419,708 base-input units in 36 runs, about 67,200 per run. Reads unchanged.
- Whole sketch, C and D together: code -285 characters, prompt 0, about 5.64 million units in 36 runs (about 156,700 per run, ESTIMATE).
- For C3 and C4 the 5-minute form would save less (0.75x on all writes, about 1.74 million units) than dropping the marker (about 2.06 million), so the C side keeps the removal.

## 6. Left out

- Not tested on a live call; C2's kept read is shown by byte equality, not by a usage row.
