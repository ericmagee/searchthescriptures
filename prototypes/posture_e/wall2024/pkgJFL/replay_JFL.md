# pkgJFL replay, runs 33040 to 33160 (W2, 23:30Z 2026-11-06; rolled-back DO blocks on the live database, nothing kept)
Run 33175 had no rows in debate_enforcer_log at the time (max run in the log: 33160). Re-run after 33175 with the same queries.

Ledger rows (counted UNCURED judge items, runs >= 33040): 28. Struck as engine faults (14 strikes, W3 grade files): 20. Counted: 8.
Strikes (rows): 33060 sol K-S3 1; 33040 grok E-GATE G2 1; 33083 gemini K-CMT 1; 33083 sol K-V 1; 33107 chatgpt K-V 1; 33129 chatgpt K-V 1;
33129 chatgpt K-G4 1; 33129 chatgpt K-W 3; 33149 chatgpt K-W LINK 5 1; 33149 chatgpt E-UNG 2; 33149 sol E-UNG 1; 33160 gemini E-GATE 4;
33160 chatgpt K-V 1; 33160 sol K-W 1.

Counts after strikes (model, kind, runs, state):
- openai/gpt-6.1-sol K-W: 33060, 33129 (2, COUNTING)
- openai/gpt-6.1-sol E-APPLY: 33040 (1, COUNTING)
- openai/gpt-6.1-terra K-W: 33149 (1, COUNTING)
- openai/gpt-6.1-terra E-GATE: 33040 (1, COUNTING)
No model has 3 runs of one kind: no block and no move next run.
Before strikes, sol K-W (33060, 33129, 33160) and terra K-V (33107, 33129, 33160) were at 3: each third run is an engine fault, so the strikes matter.
(fixture_block_sol.txt is jfl_block('openai/gpt-6.1-sol') from that pre-strike state, kept as a format sample.)

Trigger and threshold test (temp log table, test model, rolled back): 5 runs -> EXAMPLES from the 3rd run; 2 items in one run count once;
RECORD-ONLY and seat role single are not counted; the 6th run -> ALTERNATE (runs_after_examples 3); that row turned CURED leaves the ledger
(back to 5, EXAMPLES); a struck row stays struck when CURED; jfl_strike without a reason and grade file is refused.
