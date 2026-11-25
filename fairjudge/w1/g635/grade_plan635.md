# W1 GRADE: ASK 635 plan rev 0 (ask635/w4/plan635.md md5 803c9032, commit a7c022ab)

GRADE: PASS WITH N1 to N3
RULES READ: build rule (touched items only; model settings need the operator's word), ruling 541 / "never touch reasoning unless I instruct it", live-not-trial rule, two-live-runs rule, op doc s29.
OBJECTIVE MET: yes. One value changes (model_config hydrogen max_tokens 65,536 to 131,072); no reasoning, temperature, model id, node or other seat is touched. The wrong-if (s5) is stated honestly and C3 makes either outcome a finding.
STANDARD (ASK 599): the write changes no code. The C2 replay script is new code and falls under the 10 rules at build grade.

Checked this turn:
- model_config: hydrogen google/gemini-4-hydrogen max_tokens 65536 active family google; qwen4max 131072. Matches.
- ppj_replies id 254 hydrogen 04:18:48Z (22:18:48 CST 11-24): finish "length", completion 65536, reasoning 65533. Matches.
- Live engine dc258730 Resolve Seats: judges max(max_tokens,4000); alternates max(...); Panel Build: judges max(max_tokens,8000); generic openrouter body {model,max_tokens,messages}. No Math.min cap. Matches.
- Panel Judges Done? holds 980000. Matches.

N1. SEARCH line "every OpenRouter HTTP node ... timeout at least 900,000 ms" is not exact: Panel Judges Parallel (httpRequest POST to webhook wall2024-panel-judge-call) carries timeout 60000. It is the dispatch to WALL-2024, and run 42517 stored hydrogen at 343 s, so it does not cap the judge call; correct the line.
N2. At 131,072 tokens the projected 690 s (from one call) sits near the 900 s call timeout and 980 s wait. A time-out does not produce the ASK 629 "finish_reason length" line, so C3 and s6 should also name the time-out outcome (failed seat by timeout) as a finding that goes back to the operator.
N3. The operator's words "let's increase hydrogen tokens" (04:41 CST 11-25) were NOT CHECKED by W1 this turn; the card should quote them with their location.

W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh
