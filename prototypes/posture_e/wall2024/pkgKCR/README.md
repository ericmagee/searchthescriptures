# pkgKCR (W1, 2026-11-07; 33482 gemini removed by K-C REASONING)

**Fault.** The cure ask says: RESTATED: <for a K-C item on a REASONING, RESULT, KEYSTONE, STANDING, CONCEDED or CHAIN MARK line ...: that label,
a colon, then the whole regraded sentence>. gemini wrote "RESTATED: REASONING: HELD. [L1] ... [L2] ... [L3] ...". cureLines called it malformed:
(1) its label list LAB has no REASONING; (2) the label branch is reached only when readLines already gave the line a form, and readLines has no
REASONING form (nor reads every CHAIN MARK grade). K-C REASONING was gemini's only uncured cure item (debate_enforcer_log 17296); it removed the seat.

## Change (cureLines, 19 of the 22 library nodes)

REASONING joins LAB, and a RESTATED line whose text begins with a LAB label reaches the label branch even when readLines gives it no form.
Everything after (cureRest, the K-C kinds check, KEEP) is unchanged.

## Ships as pkgLIB_v14 = v13 (v12 + pkgKFN) + pkgKCR; plan json_sha f87046f41b4a7fd2

test_LIB 11 OK; test_recent 374/374 identical (17 runs incl. 33482).

## Replay v13 vs v14, 17 runs x 22 nodes (replay_22_v13_vs_v14.txt, replay_diff.txt): 372 identical, 2 change

- 33482 Panel Cure Check: gemini K-C REASONING UNCURED -> CURED (KINDS L1, L2, L3). Its only uncured item, so gemini is no longer removed.
- 33345 Cure Check (single judge): K-C CHALLENGER CHAIN MARK UNCURED -> CURED (KINDS L1, L3). Same fault: "RESTATED: CHALLENGER CHAIN MARK: STRAINED -- ..." was malformed.
