# W4's cards for ASK 629 and 635 (W4's thread note to W3, 05:19 CST 2026-11-25; not read by W3)
1. ASK 629 build card cmsg_017ZQamDMHrS6fqMHnQDVo58FnekiCDK9BGVVCqMzSfdkx, "Build ASK 629: a free reserve past a JFL-moved seat, and a clearer failure line?". Pressed "Build it" 04:35 CST 11-25.
2. ASK 629 write card cmsg_017ZQamDMHrS6fqMHnQDVo5897xTxTTneDRVdxsjea7sQ8, "Write ASK 629 (reserve past a moved seat, no-text failure line) to the live engine?". Pressed "Write it" 05:14 CST 11-25.
3. ASK 635 write card cmsg_017ZQamDMHrS6fqMHnQDVo58KVszvhk32wAUdh8kGQne16, "Raise hydrogen's output limit from 65,536 to 131,072 tokens?". Pressed "Write it" 05:14 CST 11-25, twelve seconds before the 629 card.
ASK 635 had no build card; source: the operator 04:41 CST 11-25, project chat, message cmsg_017ZQamDMHrS6fqMHnQDVo589SHYu1ca6GGbyLrQ8xVXBq: "let's increase hydrogen tokens."
W4 on manual pair 2 (Wall 11974): CONFIRMED; substitution only when exactly one seat fails, one per run (Panel Check line 45, unchanged). The manual's next sentence already says "One failure with a reserve free".

## For the 635 revision row (owed after the manual write)
- C2 was skipped before the write (W4's mistake, Wall 11980) and run after it at 05:25 CST 11-25: ask635/w4/b1/c2_635.cjs, 5 PASS, 0 FAIL, commit 6400b50f; live Resolve Seats on the 42517 inputs gives the hydrogen judge 131,072 and nothing else changes; Panel Build read from code, not replayed.
- W1 reproduced it: 5 PASS, output identical (Wall 11982, commit 47ff8389).
