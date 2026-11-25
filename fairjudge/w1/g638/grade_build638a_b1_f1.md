# W1 GRADE: ASK 638 A build b1 with the F1 answer (commit 559734af; plan rev 1 7ff14cb7)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. Builder: W4.

GRADE: PASS. F1 of Wall 12059 is cleared. The engine target is unchanged (W4's tg equals my rebuild from ee4e389d).

Reproduced: t638g on my live copy and my build: 5 pass, 0 fail.
- Sol's 42528 gate (T0 and T1, fixture fx/g42528_sol.json): D38 items 0 old, 0 new; gate items 13 old, 13 new, keys and live flags equal; T1 is the same text under the new array.
- Both texts grade D1 vs C3 UNDERDETERMINED, so BASIS has no moved collision on premise 3. drv_uncured for sol is unchanged.
- Synthetic: the old code skips the side; the new code raises one LIVE BASIS item, D38|BASIS|CHALLENGER|3. So the path is real, and the plan now says so.
- Plan rev 1 header names both judge-facing changes: the enforcer prompt's STORED COUNTED PREMISES line (LIB 2970), and D38 BASIS (LIB 1736, LIVE, counts in drv_uncured when uncured).

The card must carry the rev 1 header's two points.
NOT CHECKED:
- the late gate texts (row 54585, LATE G14) were not replayed;
- 42373;
- the pair check script.
Rebase: 634 and 641 also change Shared Library. The second and later writes are rebuilt and regraded.
