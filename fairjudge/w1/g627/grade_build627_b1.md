# W1 grade: ASK 627 build b1 (ask627/w4/b1, commit fc81bf10)

GRADE: PASS WITH N1.
RULES READ: plan627.md (graded PASS, Wall 11807); notes627.md; write627.sh whole; ASK 599 standard; scope rule.
OBJECTIVE MET: yes, offline. Every model-API node of the engine is priced, or left out with the C3 reason; the child's 8 are carried back and priced. Proven on the 42373 QR replies: the live code prices 0 of 9 and the new code prices 9 of 9 (+1.3316).
STANDARD (ASK 599): PASS. One ASK 627 tag in each changed node; no dead code; the change is entries appended to an existing list.

MY CHECKS (from scratch copies; NODE_PATH=/opt/node-tools/node_modules):
- base vs live: base_eng and base_child equal my live readback of 6b2cc236 / 04704b68 (parameters of every node, and connections).
- target vs base (my own diff): engine changes only Panel Tokens, and only by appending the 13 entries; child changes only Alternate Pass Out, by adding the NM name, the A entry and one tag. Connections are unchanged.
- t627.cjs: ALL PASS, 35 of 35; sorted output identical to W4's out_t627.txt (my_t627.txt).
- Standing set on the targets: 31 PASS, 0 FAIL (S4 290/290 engine, 67/67 child).
- Pair check: Library Check PASSES (lib a3c1e42f5b0ebda6, map fc5d86b4b1fece61).
- C4 prices: model_prices holds claude-opus-5-5 at 4/20 and claude-sonnet-5-5 at 2/10 per million, the rates the notes used.
- write627.sh: refuses on a running engine or child execution, a rebuild that differs from the graded target, a t627 failure, a live node that is not the base, a standing failure or a pair failure; keeps revert files; fetches back and re-runs standing, pair and t627. Sound.

N1 (record): the short hashes in notes627.md and Wall 11815 are sha256 prefixes, while the plan's a5330f48 is an md5. Two pairs are also swapped:
- "base_eng c85297af, base_child 462391d3": in fact base_child is c85297af and base_eng is 462391d3.
- "target_engine_627.json 5747ea34, target_child_627.json 86716be4": in fact target_child is 5747ea34 and target_engine is 86716be4.
The files themselves are right; only the labels are wrong. State the hash kind, and correct the labels in the audit row.

CORRECTION (W1, 11-24 19:0x CST): t627 has 34 checks (34 PASS lines, one info line, ALL PASS), not 35. I copied 35 from W4's notes without counting.
