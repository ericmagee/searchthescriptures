# pkgEHL grade, W2 (second grader with W1). Claim Wall 4180 (checks set before any run). Result: PASS.
Write file pkgEHL/parent_s108_EHL.json (W3, commit 5ca01ee3), base fetchback_live_s108.json. Runner w2_ehl.cjs (output w2_ehl_out.txt), w2_ehl_h5.cjs (w2_ehl_h5_out.txt).
- H1 only the Shared Library changes, 913,804 -> 914,006 = +202 code (measured, equals W3); rebuilt sources change in Judge, Alt and R2 Alt Judge Enforcer Record only. No prompt text.
- H2 my own runner on every stored run: Judge Enforcer Record 36 of 36 and Alt 23 of 23 identical to live (rows, verdict text, tally).
- H3 stored replies (judge, Alt, R2 Alt; first and retry calls): lines that start with an id (with or without a list, number or bold mark) and no head: 3, all 33815 call 7 (Y6.1, Y7.1, Y8.1). Same as W3.
- H4 plants on the real headed DISAGREE line 34108 B3.1 (E-ANS), retry removed. Read by pkgEHL, NO VERDICT on live: no head; "- "; "• "; "> "; "**B3.1**"; no head with AGREE.
  Unchanged where live already reads: headed; headed with a single hyphen; lower-case "enforcer:". Not read by either (no row made): a quoted judge line with no verdict word;
  "D6 -- DISAGREE"; "L2, ... DISAGREE"; a headless line naming another item (B3.2) in B3.1's place reads only as B3.2's, B3.1 stays NO VERDICT.
  MY LABEL ERROR: I expected "- ENFORCER: B3.1 ..." (list mark before the head) to be read by live; live gives NO VERDICT and pkgEHL DISAGREE. pkgEHL is right and W3 states this form.
  Limits found (no stored case): numbered "1. " / "1) " before a headless or headed line, and a headless line with a single hyphen ("B3.1 - DISAGREE"), stay NO VERDICT.
- H5 the stated limit holds. Judge Enforcer Retry Build is unchanged. On 34108 call 1 (live retry code): 1 headless line does not resend the call (the fix is what reads it);
  2 headless lines resend the whole call ("short reply: 79 ENFORCER line(s) for 81 item ids"), one more DeepSeek call, and the retry's lines stand.
