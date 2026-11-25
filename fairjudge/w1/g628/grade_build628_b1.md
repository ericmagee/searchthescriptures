# W1 grade: ASK 628 build b1 (ask628/w4/b1, notes sha256 d3bb7916, commit f91c0ae0)

GRADE: PASS.
RULES READ: plan rev 1 (sha256 42c75705; my diff from rev 0 shows N1, N2 and N3 applied and nothing else); notes628.md; write628.sh; ASK 599; the scope rule; the operator's choice "Both" (18:18 CST).
OBJECTIVE MET: yes, offline. On the 42373 close, the live code does not re-call; the new code re-calls once, naming the 20, and the judges are shown whatever is still open after that. For any other profile, nothing changes.
STANDARD (ASK 599): PASS. The reader moved into the Library as PRESS LIST, and each node loads it with the project's standard rebuild loader. Every change is tagged ASK 628.

MY CHECKS (scratch copies; NODE_PATH=/opt/node-tools/node_modules):
- base_eng and base_child equal my live fetch of 560f01fb / b1d5a5bf (my 627 readback), node parameters and connections.
- My own diff of target against base: the engine changes exactly Build Independent Verdict, Build Save Body, Panel Build, D4 Build, D4B Build and Shared Library; the child changes only the Shared Library. No node is added or removed, and connections are unchanged.
- Rebuild: b628.cjs, then fixhdr579.js, gives targets byte-equal to the graded ones (header sha 027c8c4a71282403, 3858 lines; engine Library Check ran).
- t628: ALL PASS (30); my output is identical to out_t628.txt (my_t628.txt). This includes C2b: a dr4-only press changes neither the prompt, the re-call nor the judges' line.
- Standing set on the targets: 31 PASS, 0 FAIL. Pair: Library Check PASSES (lib 027c8c4a71282403, map 771e35cfe3e3b51b).
- Code read:
  - D4B: the PRESS LIST open() call reads DR1 to DR3 and the close, and only for the Oracle profile. The pass condition adds "&& !__un.length", and the note goes into the one existing re-call.
  - Panel Build and Build Independent Verdict: the line is built only for the Oracle profile and only when verses are open. It states "[L1] and [L3] lines alike" (N3) and adds no instruction to the judges.
- write628.sh: refuses on a running execution, a rebuild that is not byte-equal, a t628 failure, a live node that is not the base (all six engine nodes and the child Library), a standing failure or a pair failure. It keeps revert files.

Run evidence owed: the first live run with an Oracle defender. Its D4 request carries the list; D4B names the open verses or does not fire; the audit shows the count. Two live runs.

CORRECTION (W1, 11-24 19:0x CST): t628 has 29 checks (29 PASS lines, one info line, ALL PASS), not 30. I copied 30 from W4's notes without counting.
