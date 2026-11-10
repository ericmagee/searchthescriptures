# pkgRAC rev 2 replay (12 sends, W4, Wall 4135): W3 reading, 09:21 CST 2026-11-10 (database time)

Replies: /mnt/project-files/wall2024/staged_w4/rac_replay_s107/. Code check: pkgRAC/replay/read_replies.cjs runs the candidate Close Enforcer Record on each reply (output read_replies_out.txt). Labels: pkgRAC/replay/README.md, written before the send. The third 33482 reply (not sent by W4's script) is read but not counted.

## The handed pairs (6 pairs, 2 sends each)
| Pair | Label | Send 1 | Send 2 | Reading |
|---|---|---|---|---|
| 34108 R11 | NOT, firm | NOT | NOT | right |
| 33222 A94 | NOT, firm | NOT | NOT | right; the enforcer's reason is the one I gave (the challenger quotes the defender's grant) |
| 33461 A9 | NOT, less confident | NOT | NOT | as I read it |
| 33442 A83 | TRUE, less confident | CONFIRMED | CONFIRMED | as I read it |
| 33482 A39 | CONFIRMED expected | CONFIRMED | CONFIRMED | right |
| 33705 A49 | CONFIRMED expected | CONFIRMED | CONFIRMED | right |
Count on the handed pairs: 12 answers, 12 as labeled; 6 confirmed answers all true, 6 not-a-contradiction answers all right; 0 false, 0 doubtful. Every pair was answered under its own id, with the same answer in both sends.
Form: 3 of the 12 replies label a round "[round 4]" (33222 send 2, 33705 both sends). On pkgRAC alone those lines are recorded NOT CONFIRMED (form) and the pair NO ANSWER, so 33705 A49 breaks nothing. With pkgRLF they count. pkgRAC needs pkgRLF with it.

## Other CONFIRMED lines (NEW), read by hand: 9 lines in the 12 counted replies, 9 true
- 33222 send 1, link 2: round 3 "I drop the limb that rests this on Jeremiah 18:8." against the closing listing Jeremiah 18:8 as a footing row of C2. TRUE. Found in 1 of 2 sends; set C found nothing in this debate in either send.
- 33442: link 2 in both sends, links 5 and 6 in send 2. TRUE (read before, set C).
- 33482: link 1 in both sends, link 6 in send 2. TRUE (read before, set C).

## FINDING outside my labels: with a pair handed, the enforcer finds fewer contradictions of its own
Links broken by the same closing call on the same rounds, without a handed pair (sets A and C) and with one (this replay):
| Debate | Without a handed pair | With a handed pair |
|---|---|---|
| 34108 defender | links 3 and 6 (1 send, set A; link 6 is the round 3 drop reclaimed in closing, the case the closing enforcer exists for) | none in either send; the reply holds the R11 line only |
| 33705 defender | links 4 and 6; link 4 only (form refused in send 2) | A49 line only in both sends (link 4) |
| 33442 defender | links 2, 3, 5, 6; links 2, 6 | links 2, 4; links 2, 4, 5, 6 |
| 33482 defender | links 1, 6 (1 send) | links 1, 3; links 1, 3, 6 |
| 33461 defender | none; link 4 | none; none (A9 line only) |
| 33222 challenger | none; none | link 2; none |
In 3 of 6 debates (34108, 33705, 33461) every reply with a handed pair holds the handed pair's line and nothing else. On 34108 the true link 6 contradiction, confirmed in the set A send, is missing in both sends. The call differs between sends in any case, and the count without a pair on 34108 is one send, so this is an observation, not a proven cause. A missed true contradiction is never safe: I do not recommend a write on this evidence.
Check that would settle it (needs the operator's approval; 4 calls): the 34108 defender body of live s107 (no handed pair) twice, and the pkgRAC body twice more. If the live body confirms link 6 and the pkgRAC body does not, the handed pair suppresses the enforcer's own search and pkgRAC needs a rev 3 that hands the pairs without that effect.

## W2's reading of the 29 stored pairs (pkgRAC/w2_read/reading_w2.md)
I read the 9 pairs W2 calls FALSE against the rounds. I agree on 8. On 33846 A57 I read DOUBTFUL, not false: round 3 "1 Chronicles 28:6 ... does not carry over, so I drop it"; the closing answer the pair points to ends "This stands on [L1] 1 Chronicles 28:6 and Matthew 1:20", using the verse to state the same difference as round 3. My count: 8 false, 6 doubtful, 15 true. I did not read the 5 DOUBTFUL or the 15 TRUE pairs against the rounds; I take them from W2's file.
The four "opponent's sentence" pairs (33299 A37, 33345 A49, 33644 A7 and, as W2 lists it, 33530 A106): the first three are the opponent's premise quoted under PRESSED WITH or under a premises heading, as in 33222. 33530 A106 is the challenger's own sentence describing the defender; code that looks for a quoted premise would not catch it. So the class visible to code is 4 of 34 stored pairs (with 33222), not 5.

## Weight of the replay for the pairs the enforcer has not seen
The enforcer ruled 3 pairs I read as not contradictions (R11, A94, A9) correctly in both sends, 6 answers of 6. That is a small sample: with 0 errors in 6 answers an error rate of several tens of percent cannot be excluded. Against it stands the set C base rate of the same enforcer on lines it found itself: 3 of 23 confirmed lines false or doubtful. So the replay shows the enforcer can reject a false handed pair; it does not show that it will reject the other 8 false and 6 doubtful pairs.
