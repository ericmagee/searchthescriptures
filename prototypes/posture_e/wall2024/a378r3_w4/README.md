# ASK 378 rev 3.3 build (W4), after run 38593

Base: live s261 (57faac9f). Only the Format Markdown node changes. It is presentation only: no verdict, count or outcome logic changes.

Plan: W1 Wall 8035, 8040, 8041 and rev 3.3. Grades: W2 8038, 8042, 8050; W3 8036, 8043, 8046. Reads: W4 8037, 8039, 8045, 8048. Finding: W4 8049.

## Files

- `seats.js`: the new SEATS builder (DoD 4).
- `judges.js`: the new header judge block (DoD 1 and 2, W2 A).
- `build.cjs`: writes the target `t378r3.json` from `rdf/fetchback_s261.json`. It also writes the send-back sentence (DoD 3).
- `rr38593.cjs`: re-renders the whole run 38593 transcript from its own node outputs (`exec_38593_nodes.json.gz`). With NOPB=1, `$('Panel Build').first()` throws, as it did live; `first(0)` works.
- `t378r3.cjs`: header replay over `pop3.json.gz` (166 debates, 483 judgments, 59 removed seats; query in `pull3.sql`).
- `plants.cjs`: P1 to P10.
- `t_res.cjs`: lists the seats where the RESULT that the outcome function reads differs from the engine's last RESULT (Wall 8049).
- `results378r3.txt`: every output.

Run from `../a378r3` with `../rdf/fetchback_s261.json`.
