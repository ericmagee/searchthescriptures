# E5 T0: question for the operator (draft rev 2, W1, 11-19; adds W4's run path, Wall 9835, and W2's C-1 and N1, Wall 9858)

**Question:** May the team make four live calls to Muse Spark 1.3 (meta/muse-spark-1.3) through OpenRouter, costing about 0.40 USD, to test whether spark's prompt cache can be switched on?

**Why:** spark is the most expensive defender. In run 440 it cost 0.6475 USD, 37% of the run. Its cache hit on only 1 of its 6 calls. On 11-18, run ODV1-39266 hit 5 of 6 for 0.3389 USD with the same cache wrapper. The engine never asks Meta to cache, because the wrapper's cache list leaves out meta/. But Meta also caches without being asked: in both runs the second call read 64,113 cached tokens with no request. So run 440's four misses are not explained by the missing request alone. Routing and timing were checked and do not explain them either (every call went to provider Meta, and one miss came 2 seconds after a hit). (Plan: e5/plan_e5.md rev 1, md5 699f94a0, graded PASS by W3 at 9739 and W2 at 9740.)

**What T0 does:** two pairs of identical calls, each using run 440's first defender request.
1. Control pair: no cache request. This measures Meta's own cache.
2. Test pair: with a cache request on the shared 53.6k-token system text. A one-character change keeps it from reusing the control pair's cache.

For all four calls, we read the cached tokens and the billed cost. Nothing in the engine changes. No debate is run.

**How it runs (W4, Wall 9835):** W4 builds one temporary workflow only after you approve. It is inactive and has a manual trigger only. It makes the four HTTP calls on the existing OpenRouter credential, referenced by id, and its output is limited to the usage fields. W4 runs it once, then archives it.

**Pass:** the second test call reads 50,000 or more tokens from the cache, and the second control call does not. Then the team plans the build: add meta to the wrapper's cache list in the engine (38 copies) and the child (4). The saving is up to about 0.31 USD per spark run, restated net of any cache-write charge from T0's billed numbers. The build comes to you on its own card.

**Fail:** the second test call reads 0 from the cache, or OpenRouter rejects the request. There is no build, and E5 closes with no lever.

**Both pairs hit (the LIKELY result, W2 9858):** asking for the cache adds nothing that four calls can show. There is no build, and E5 closes, but run 440's misses stay unexplained.

**Options:**
1. Approve T0 (about 0.40 USD). This is recommended, because it is the only measurement possible before any build. Expect "both hit", which closes E5 for 0.40 USD; a pass would open a saving of up to 0.31 USD a run.
2. No test, and close E5. Spark's cost stays whatever Meta's own cache gives (about 0.34 to 0.67 USD a run).
3. Hold E5 until later.
