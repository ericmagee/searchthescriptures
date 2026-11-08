# pkgBGT: the begat tag split (feedback_rulings_2026-11-07 item 8; W2)

Fault: in 33345 CR1 the defender wrote '[L2], and Matthew 1:2's "begat" pattern [L3]'. tagWords read the quoted English "begat" as a transliteration, and check() matched it against the original words, so the tag was NOT COUNTED.
Ruling: a quoted English word found in the KJV words of the bound verses is COUNTED.

Change, one node: L2 Count Plan, live s60 base 6822c3b02be2 -> 415a443889e6 (s61 does not touch it). Not a DeepSeek node.
- l2EnglishPass2024 runs after L2C.check. It touches only NOT COUNTED tags and only failing 'latin' words that meet all of these:
  - the word is plain ASCII letters;
  - it is quoted in the tag segment ("x" or curly quotes);
  - it is a whole word in the KJV text (from Cited Verses, margin notes removed) of a cited verse that was read.
- Each such word becomes ok, with route 'KJV English word'. The tag becomes COUNTED only when every core word is ok; otherwise its why lists the words still failing.
- The Shared Library L2C, the judge K-L2 path and Citation Scan are unchanged.

Test: node pkgBGT/test_BGT.cjs gives 28 OK, 0 FAIL on 28 saved runs. Only tag status changes, all NOT COUNTED -> COUNTED, and no other output field changes.
7 flips:
- "begat": 33299, 33345 (the regression case), 33461, 33490.
- "evident": 33249.
- "wife": 33249.
- "therefore": 33411.
