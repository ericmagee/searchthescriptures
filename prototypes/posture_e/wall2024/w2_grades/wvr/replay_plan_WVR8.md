# Paid replay plan for pkgWVR rev 8 (W2 draft for W4)

Package: rev 8 (W1, building). Sizes and the sha are filled in when rev 8 posts; the rest is fixed now. Learned from ASK 119 (W4, replay_ASK119_WVR7_w4.md).

## Calls
- Defender Close Enforcer Build only, rebuilt from stored rounds, deepseek-flash, temperature 0, two sends per request (as ASK 112 and ASK 119).
- Requests: 32924, 33083, 33846, 35379 (rev 8), and the control 33083 from rev 2 (X2 Luke 1:27). 5 requests x 2 sends = 10 calls.
- No new no-package baseline: the two ASK 119 baseline sends for 33846 stand, since the stored rounds have not changed.
- RESEND RULE (new): a send that fails (connection reset, timeout, empty reply) is resent once at once, until each request has two completed replies. The ask covers up to 12 calls (10 plus 2 resends). A request with fewer than two completed replies after its resend is reported as short, not as a pass.

## Cost
- ASK 119 MEASURED: 0.158 USD for 12 sends (11 completed); prompt 222,081 tokens (103,805 cache hits), completion 233,842 tokens. Per completed call: about 0.0144 USD. The completion side, not the prompt, sets the cost.
- ESTIMATE for this replay: 12 calls x 0.0144 = under 0.18 USD. Rev 8's prompt change adds a few hundred characters per call, which is small against the completion size.

## What each case must show
1. 35379 X7, Galatians 4:4 (ASK 116): CONFIRMED on both sends. This is the case that split in ASK 119 ("a non-weight-bearing layer"); rev 8 must fix it.
2. 32924 X1 and 33083 X1, Galatians 4:4 (same kind as ASK 116): CONFIRMED on both sends. 32924 has one completed sample so far.
3. 33846 X5 (1 John 5:1), X6 (1 Chronicles 28:6), X7 (Ezra 2:61, ASK 117): CONFIRMED on both sends, as in ASK 119.
4. Control 33083 X2, Luke 1:27 (rev 2 request): NOT A CONTRADICTION on both sends. A prompt rule that "a reduced weight is still a rest" must not turn a scoped clause into a break.
5. 33846 X1 to X4 and 35379 X1 to X6: no worse than the ASK 119 sends and the 33846 baseline (these already vary 1-1 without the package). Any change toward CONFIRMED gets a hand reading.
6. Every NEW line is hand-read; keep only those the text supports.

## Pass
All of 1 to 4 on every completed send, and 5 and 6 clean. Anything else is reported as a split, with the replies quoted.
