# Paid replay plan for pkgCRX (W2 draft for W4)

Package: /mnt/project-files/wall2024/parent_s160_WVR8_CRX.json (on pkgWVR rev 8). Only Judge Contradiction Build changes; the Close Enforcer path is byte-equal, so it needs no replay for this package.

## Calls
- The 5 stored judge-path requests (debate_enforcer_log ids 28739, 29382, 29899, 30371, 32504), rebuilt with the new code. The old code reproduces each stored prompt byte for byte (pkgCRX/replay_stored_out.txt).
- deepseek-flash, temperature 0, two sends each: 10 calls. Resend rule: a failed send is resent once; the ask covers up to 12 calls.
- Prompt sizes (MEASURED, user message): 34726 141,795; 34852 132,750; 35067 135,019; 35296 127,906; 35554 136,639. Added per run +587 to +1,650, total +5,649.
- Cost ESTIMATE: under 0.25 USD for 12 calls. ASK 119 measured about 0.0144 USD per completed call on prompts of about 60,000 to 72,000 characters; these are about twice that size, so up to about 0.02 per call.

## What each case must show (stored verdict in brackets)
1. 34726 J1 [CONFIRMED], 35067 J1-J3 [CONFIRMED], 35296 J1 [CONFIRMED], 35554 J1-J4 [CONFIRMED]: CONFIRMED on both sends.
2. 34726 J2 [NOT A CONTRADICTION]: "I withdraw it from the chain" against "It is a supporting verse only". Its closing block says "I no longer rest D4 on Jeremiah 31:22 ... It is a supporting verse only." NOT A CONTRADICTION on both sends (the block supports the stored reading). This is the control.
3. Changed by the block, W2 hand reading (W3 to give the second reading before the send):
   - 34852 J1 [stored NOT]: dropped "any claim that the verses by themselves trace Mary's own pedigree"; the block's close places Mary in David's house from a verse: "the child's descent from David stands through Mary, whom Luke 1:27 calls \"a virgin espoused to a man whose name was Joseph, of the house of David\"". W2 reading: CONTRADICTION (expected CONFIRMED). Weak case: Luke 1:27's clause may attach to Joseph.
   - 35296 J2 [stored NOT]: dropped the word "must"; the block's close "Joseph's response shows he knew he was not the father" keeps the claim without the modal. W2 reading: NOT A CONTRADICTION (expected NOT).
4. NEW lines: compare with the stored replies (34726 and 34852 each had one NEW, CONFIRMED); every NEW line hand-read.

## Pass
1 and 2 on every completed send, 3 as the hand reading sets it, 4 clean.
