# Paid replay plan for pkgWVR rev 9 (W2 draft for W4)

Package: rev 9 (W1, Wall 5395), /mnt/project-files/wall2024/parent_s160_WVR9.json, sha 6d98d73e9395a2ff. Learned from ASK 119 and ASK 124 (W4, replay_ASK124_WVR8_w4.md).

## Calls
- Defender Close Enforcer Build only, rebuilt from stored rounds, deepseek-flash, temperature 0, two sends per request (as ASK 112 and ASK 119).
- Requests: 32924, 33083, 33846, 35379 (rev 9), and a SYNTHETIC control. 5 requests x 2 sends = 10 calls.
- Defender prompt sizes, rev 9 (MEASURED, characters, change against live s160): 32924 60,534 (+1,834); 33083 68,564 (+1,490); 33846 71,684 (+6,129); 35379 72,022 (+2,327). Each is +274 per named pair over rev 8 (33846 has three).
- Synthetic control CTL9: the rev 2 request for 33083 X2 (Luke 1:27), with rev 9's note as the code renders it for 33083 X1, set to this pair (X2, Luke 1:27, LINK 3), appended to the X2 note. Rev 9 does not name 33083 X2 itself. Built by w2_grades/wvr/ctl9.cjs; body /mnt/project-files/w2/ctl9_body.json, 69,473 characters (+578 against the rev 2 request), sha c62ec1096b67f87c. Rev 8's control body split (CONFIRMED on send 1, NOT on send 2), so this item decides the pass.
- No new no-package baseline: the two ASK 119 baseline sends for 33846 stand, since the stored rounds have not changed.
- RESEND RULE (new): a send that fails (connection reset, timeout, empty reply) is resent once at once, until each request has two completed replies. The ask covers up to 12 calls (10 plus 2 resends). A request with fewer than two completed replies after its resend is reported as short, not as a pass.

## Cost
- ASK 124 MEASURED: 0.125 USD for 10 sends, 10 completed, no resend (W4, from token counts at off-peak prices). Per completed call: 0.0125 USD. ASK 119 was 0.0144 per completed call.
- ESTIMATE for this replay: 12 calls (10 plus 2 resends) x 0.0144 (the higher of the two measured rates) = under 0.18 USD; 10 calls with no resend about 0.125 USD.

## What each case must show
1. 35379 X7, Galatians 4:4 (ASK 116): CONFIRMED on both sends (rev 8 fixed the ASK 119 split; rev 9 must keep it).
2. 32924 X1 and 33083 X1, Galatians 4:4 (same kind as ASK 116): CONFIRMED on both sends. 32924 has one completed sample so far.
3. 33846 X5 (1 John 5:1), X6 (1 Chronicles 28:6), X7 (Ezra 2:61, ASK 117): CONFIRMED on both sends, as in ASK 119.
4. Synthetic control CTL9, 33083 X2, Luke 1:27 (rev 2 request plus the rev 9 note text): NOT A CONTRADICTION on both sends. The new note text must not turn a scoped clause into a break.
4b. 35379 X1 and X2 (the kept verb-parallel use, W3 caution 1 at Wall 5392): NOT A CONTRADICTION on both sends. Rev 8 FAILED X1 on send 2 ("drops all rest on the woman-source idiom"). They ride in the same call at no added cost.
5. 33846 X1 to X4 and 35379 X3 to X6: no worse than the ASK 119 sends and the 33846 baseline (these already vary 1-1 without the package). Any change toward CONFIRMED gets a hand reading.
5b. 33846 X2 to X4 varied in ASK 124 (NOT, then CONFIRMED) as they vary without the package; a CONFIRMED there is hand-read, not a FAIL by itself.
1b. 35379 X7 against the carve-out (W3 watch, Wall 5396): the run's own words "I withdraw Galatians 4:4 as an exclusion witness. It stays only as the verb-parallel" may be read as a reading given up; X7 must stay CONFIRMED on both sends. If it splits, drop "or reading" from the carve-out.
6. Every NEW line is hand-read (W3 read the 6 ASK 124 NEW lines, Wall 5396: 3 supported, 3 not). A NEW line where the note reaches a kept use or a scoped withdrawal (the 32924 Genesis 3:15 kind) counts against the note; keep only those the text supports.

## Pass
All of 1, 1b and 2 to 4b on every completed send, and 5 and 6 clean. Anything else is reported as a split, with the replies quoted.
