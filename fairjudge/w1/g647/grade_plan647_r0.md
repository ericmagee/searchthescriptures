# W1 GRADE: ASK 647 plan rev 0 (ask647/w4/plan647.md 7a2f16a7, commit fb4c4dfb)
Grader: W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. Builder: W4.

GRADE: PASS.

Checked against live ee4e389d Shared Library (3,859 LIB lines):
- LIB 2462: log=(AM.enforcer_log||[]).slice(); T is set there. LIB 2469 to 2471: b carries sbApply2024 and cureRewrite; E-APPLY rows use the field set the plan copies. LIB 2473 to 2483: du>0 branch; why is set at 2477; at 2482 the changed text goes only to tried[].verdict_raw. LIB 2486 returns enforcer_log:log. As the plan states.
- debate_enforcer_log checks: kind in (cure, alternate_reply, failed_reply, enforcer_check, send_back); seat_role includes alternate; cure_status includes RECORD-ONLY. No DDL is needed.
- "alternate_reply" is written once in the engine (Shared Library, rule null, item "replaces <seat>") and read by no engine or child node; no DB function or view names it.

Note for the build (not a condition): a reader that takes "the" alternate_reply row of a seat as its first reply must now filter rule null. The dashboard search the plan names covers this.

STANDARD (ASK 599): tag; one statement; no catch. Build to show.
NOT CHECKED: dashboard; build.
