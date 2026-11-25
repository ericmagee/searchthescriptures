# W1 readback: ASK 635 (audit 42082, 11:14:24Z)
- model_config hydrogen: api_model google/gemini-4-hydrogen, max_tokens 131072, active true, family google (api_model, active and family the same as my read at 11:04Z). The notes tail names the card, the press at 05:14 CST, "reasoning untouched", and undo 65536.
- Others unchanged as read: qwen4max 131072, gemini 64000, sol 64000, sonnet 64000. 31 rows (the earlier row count was NOT CHECKED).
RESULT: MATCH. Owed: the first live run in which hydrogen judges (stop with text, a time-out, or length at 131,072, as plan rev 1 C3 sets out).
W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh

## C2 after the write (W4 Wall 11980, c2_635.cjs, commit 6400b50f)
My run of c2_635.cjs on the live engine 066525aa that I fetched (not W4's copy), with fx42517_rs.json: ALL PASS (5). The output is identical to W4's out_c2_635.txt. Resolve Seats differs only at RS.judges.2.max_tokens, which goes from 65536 to 131072. Panel Build was checked from its code rule only, not replayed; that is the same scope W4 stated. The skip before the card is W4's stated mistake.
