# pkgMNQ (W2, 11-07): the MEANS cure check reads a MEANS that contains inner quotes (HIGH, false not-counted seat)

**Fault (33461):** sol answered its 4 E-MNP send-back items (Matthew 1:24, Luke 1:32, Ezra 2:61, Luke 1:35) by quoting the press ledger's MEANS word for word. All 4 stayed UNCURED, so sol was not counted (drv_uncured 4). Each of those MEANS contains an inner quoted word ("coming together", "therefore", "of Heli"). The pkgMNP cure read the MEANS with `/--\s*MEANS\s*:\s*(["“]?)([^"”]*?)\1\s*--/`, which cannot cross an inner quote. The MEANS therefore read as empty, and every item became "quotes no 6 words in a row". sol's other 6 E-MNP items had no inner quote and were CURED. W3 traced this in grade_33461, and W2 confirmed it independently.

**Fix (the cure only, in Send Back Build, Send Back Record and the Alt copies; base live s49):** the MEANS is the span from "MEANS:" to the next "-- ANSWER:", or to the next "--" if there is no ANSWER. Only the outer quote pair is removed, so inner quotes stay. The word comparison drops every quote mark anyway. The fix is side-neutral. The claims reader is unchanged: a MEANS with an inner quote is not a "no MEANS" claim, which is correct as it stands.

**Shas:** see `patched.plan.json`.

**Test:** `node --max-old-space-size=6000 pkgMNQ/test_MNQ.cjs` gives 9 OK.
- On 33461, sol's E-MNP UNCURED goes from 4 to 0, and each of the 4 reads "graded MEETS on the real MEANS".
- drv_uncured goes from gemini:1 chatgpt:0 sol:4 to gemini:1 chatgpt:0 sol:0.
- The other 54 Send Back rows are unchanged.
- Unit tests cover a MEANS with inner quotes, curly quotes and no quotes.
- Replay over 63 node runs from 33218 onward: the only changed output is the 33461 Send Back Record.

**L1Q2 cleared:** test_L1Q2 on patched_on_v8 now includes 33461. It gives 46 OK; across 371 node runs, the only changed output is the known 33249 one. L1Q2 changed nothing in 33461.
