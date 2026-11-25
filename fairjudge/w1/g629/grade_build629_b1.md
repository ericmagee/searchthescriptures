# W1 grade: ASK 629 build b1 (W4, Wall 11951, commit 2889a1c8, notes629.md d4b12e10)

W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh. 04:5x CST 2026-11-25.

GRADE: PASS WITH N1, N2, N3.
RULES READ: my plan grade (R1, N1, N2); build rule; scope rule; ASK 599; "never touch reasoning".
OBJECTIVE MET: yes for a build (A: a free reserve past a JFL-moved seat; B: a "returned no text" line). Live proof owed: two clean live runs.
STANDARD (ASK 599): two changed lines, both tagged /* ASK 629 */; no dead code; no catch added. PASS.

## Checks run by me
1. Live engine is still 2df7f6fa (n8n history, newest version 2df7f6fa-d552, 02:38Z 11-25). base_eng.json versionId 2df7f6fa, 423 nodes, md5 dd0d770c.
2. Rebuilt the target from base with b629.cjs: md5 55d96341, equal to tg/target_engine_629.json.
3. Ran t629.cjs on base and my rebuild with W4's fixtures: 39 PASS, 0 FAIL (out_t629_w1.txt). Only the random run_token of the two refusing runs differs from W4's output.
4. Read the changed text: Init Seats one line; Panel Check envelope() one block placed after the choices-string and Gemini branches and before the old generic throw (N1 of the plan met).
5. R1: the alternate guard is LIB 3289-3293 (G3, line 3291, "already sits on this panel"). The panel payload builder in the Shared Library sets judge_api_model from the seat that judged (a.api_model), so a substituted slot carries the reserve's model and G3 refuses it as an alternate. W4's test shows both cases (refused when used; offered when unused).
6. No reasoning, max_tokens, model setting, connection or library line is changed.

## Notes
N1. A choices reply whose content is an array of text parts was refused before (generic throw) and is refused now, with the new "returned no text" line. Live reads no such form, so behaviour is unchanged; the wording would be inexact for that form. No change asked.
N2. The R1 test builds the post-substitution panel payloads by hand; I checked the builder line that makes them (point 5), not a run. The two live runs should confirm "reserve <seat>" in the JUDGE ORDER line and, if a substitution happens, no alternate with the reserve's model.
N3. Test A reads "time-removed" as the literal ['qwen']; it equals the live JUDGE_TIME_REMOVED today.
Manual entry for part 10.0 goes to W3 on its own card, as the notes say.
