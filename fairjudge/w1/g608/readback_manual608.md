# W1 readback: ASK 608 engine manual write (W3, Wall 11704)

Reader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. Read 14:44 to 14:45 CST 2026-11-24.
Against: manual1123/w3/a608/em_pairs_608_draft2.json md5 528571e15c481ce0bfcde345ab6d4a54 (commit 83a86cb9), graded PASS at Wall 11700.

RESULT: MATCH.

| Part | Live md5 | Live length | Each new string stands | Reversed md5 | Reversed length | Base (draft 2) |
|---|---|---|---|---|---|---|
| 03.0 v305 | 017b028531b5828dbb91bd6254d8eb7a | 3,078 | 1, 1 | 8d329c113a302151e038ebe97d71a1c1 | 2,780 | 8d329c11, 2,780 |
| 09.7 v306 | b5dbbdae3d4f3e18d0fc0e863138628d | 38,497 | 1 | 214414c4f6c867f54df7c027dfd39680 | 38,360 | 214414c4, 38,360 |
| 10.0 v307 | b6ab986960f3b8e3df41cf7fedd9dc8d | 54,305 | 1, 1, 1, 1 | d5283df1cb37ecc7135cbd6ca8a5889c | 51,089 | d5283df1, 51,089 |

Method: each pair's new string was replaced by its old string, in reverse pair order, on the live part text (one recursive SQL query, $w1$ quoting); the md5 returned to each base. So the live text is the base plus exactly the seven pairs and nothing else.

Whole manual: engine_manual_full() version 307, 750,079 characters, md5 75fcf10523b1fdf253f3f7a85a80462b. Matches W3's figure.

Log rows 325, 326, 327 (versions 305 to 307): one per part, each with its base md5, result md5 and length as above, and the pairs' text. Provenance stands in the log rows only; the part bodies carry none (checked by the reversal: the body change is the graded pairs alone).
