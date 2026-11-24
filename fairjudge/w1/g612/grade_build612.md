GRADE ASK 612 build (ask612/w4/notes612.md, standing/inv/s4_compile.cjs; commit 08639bfa): PASS WITH N1, N2. COMMIT: this file.
RULES READ: op doc v145; the ASK 612 draft (lab/w3/asks_612_622_draft2.md ef6859f0); ASK 599.
OBJECTIVE MET: yes.
STANDARD (ASK 599): rule 10 is met (ASK 612 tag on both lines). The check is small and does one thing. No rule is broken.

Rerun by me (standing/run.cjs, on my own fetches):
- (a) fbc09389 + b9cd4e5c: S4.engine FAILs, 288 of 290, naming Panel Judges Parallel.jsonBody and Alternate Pass Call.workflowInputs.value.pass. The standing set is 30 PASS, 1 FAIL.
- (b) 3cef3eab + b9cd4e5c: S4.engine 290/290 and S4.child 67/67. The standing set is 31 PASS, 0 FAIL.
- (d) Version 1.16.0 is printed in each line.
- (c) is taken from W4's list of write scripts. I saw the standing line in write611.sh earlier today. writef1.sh's parser gate I confirmed at Wall 11672.

N1 (process): the plan's step order was build, grade, then card in W4's thread. S4 already stands in the shared standing set, so it acts on every write before this grade. It is a test-only change and fails safe: it can only refuse a write. Card it now as the record.
N2: the parser package lives only on the shared mount (standing/tools/parser/node_modules); it is not in git. If the mount loses it, S4 must FAIL, not pass. Confirm this in one line: the require throws inside the group, and the group reports FAIL.
