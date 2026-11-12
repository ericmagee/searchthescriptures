# Paid replay plan for pkgWVR rev 9 (W2 draft for W4)

Package: rev 9 (W1, building after the ASK 124 FAIL). Sizes and the sha are filled in when rev 9 posts. Learned from ASK 119 and ASK 124 (W4, replay_ASK124_WVR8_w4.md).

## Calls
- Defender Close Enforcer Build only, rebuilt from stored rounds, deepseek-flash, temperature 0, two sends per request (as ASK 112 and ASK 119).
- Requests: 32924, 33083, 33846, 35379 (rev 9), and a SYNTHETIC control. 5 requests x 2 sends = 10 calls.
- Defender prompt sizes, rev 9: TBD when rev 9 posts (rev 8 MEASURED for reference: 32924 +1,560; 33083 +1,216; 33846 +5,313; 35379 +2,053 against live s160).
- Synthetic control: the rev 2 request for 33083 X2 (Luke 1:27) with rev 9's new note text appended to the X2 note word for word, rebuilt by w2_grades/wvr/ctl8.cjs from the rev 9 file. If rev 9 itself names 33083 X2, that request is the control and no synthetic body is needed. Rev 8's control body split (CONFIRMED on send 1, NOT on send 2), so this item decides the pass.
- No new no-package baseline: the two ASK 119 baseline sends for 33846 stand, since the stored rounds have not changed.
- RESEND RULE (new): a send that fails (connection reset, timeout, empty reply) is resent once at once, until each request has two completed replies. The ask covers up to 12 calls (10 plus 2 resends). A request with fewer than two completed replies after its resend is reported as short, not as a pass.

## Cost
- ASK 124 MEASURED: 0.125 USD for 10 sends, 10 completed, no resend (W4, from token counts at off-peak prices). Per completed call: 0.0125 USD. ASK 119 was 0.0144 per completed call.
- ESTIMATE for this replay: 12 calls (10 plus 2 resends) x 0.0144 (the higher of the two measured rates) = under 0.18 USD; 10 calls with no resend about 0.125 USD.

## What each case must show
1. 35379 X7, Galatians 4:4 (ASK 116): CONFIRMED on both sends (rev 8 fixed the ASK 119 split; rev 9 must keep it).
2. 32924 X1 and 33083 X1, Galatians 4:4 (same kind as ASK 116): CONFIRMED on both sends. 32924 has one completed sample so far.
3. 33846 X5 (1 John 5:1), X6 (1 Chronicles 28:6), X7 (Ezra 2:61, ASK 117): CONFIRMED on both sends, as in ASK 119.
4. Synthetic control 33083 X2, Luke 1:27 (rev 2 request plus the rev 8 sentence): NOT A CONTRADICTION on both sends. A prompt rule that "a reduced weight is still a rest" must not turn a scoped clause into a break.
4b. 35379 X1 and X2 (the kept verb-parallel use, W3 caution 1 at Wall 5392): NOT A CONTRADICTION on both sends. Rev 8 FAILED X1 on send 2 ("drops all rest on the woman-source idiom"). They ride in the same call at no added cost.
5. 33846 X1 to X4 and 35379 X3 to X6: no worse than the ASK 119 sends and the 33846 baseline (these already vary 1-1 without the package). Any change toward CONFIRMED gets a hand reading.
5b. 33846 X2 to X4 varied in ASK 124 (NOT, then CONFIRMED) as they vary without the package; a CONFIRMED there is hand-read, not a FAIL by itself.
6. Every NEW line is hand-read (ASK 124 left 6 NEW lines unread: 32924 send 2 has 2, 33083 send 2 has 4); keep only those the text supports.

## Pass
All of 1 to 4b on every completed send, and 5 and 6 clean. Anything else is reported as a split, with the replies quoted.
