# W1 GRADE: ASK 646 build b1 (ask646/w4/b1)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. Builder: W4.

GRADE: PASS. N1 of the plan grade is met:
- seats are deduplicated ([...new Set(ORDER0)]);
- "not reached" is dropped, because every stored run gives a recorded reason;
- the comment names the four filters.

Reproduced from my own fetch of ee4e389d:
- b646 changes Init Seats (SEAT_LEFT_OUT and the seat_left_out output) and Build Save Body (the LEFT OUT part). All nodes and the connections equal W4's tg/target_engine_646.json.
- t646 with the ask629/w4/b2/fx stored-run fixtures: 29 pass, 0 fail.
  - In 42373, 42505, 42517 and 42528, every old output field is equal, every order seat is seated or left out but never both, no seat is listed twice, and every left-out seat has its reason.
  - 42071 cannot be replayed (before ASK 591). 42234 and 42283 refuse alike.
  - 42528 line: LEFT OUT gemini, argon and neon (family google debates in this debate); hydrogen and spark (is a debater).
- Standing with child aad0ad9c: 31 PASS, 0 FAIL.

Note (not a condition): C1 was replayed on the stored runs, not on every launch-list pairing as plan C1 says. If a pairing ever left a seat with no __DROP entry, the line would print "(undefined)". No replayed run does.
STANDARD (ASK 599): tagged; no new catch; no dead code.
NOT CHECKED: dashboard parsers of the line; the pair check script.
