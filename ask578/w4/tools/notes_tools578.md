# ASK 578 follow-up (W4, 19:30 CST 11-24): run-start tools for a child served the library in the call

MISTAKE (W4): the 578 re-cut changed the standing set, test557 and fixhdr, but missed the run-start tools. After the 578 write the old tools refuse the live pair:
- tools/runstart.py check 3: "3 child LIBRARY UNREADABLE: list index out of range", REFUSED.
- a422a_w4/libsha.py: fails the same way (no child Shared Library node).
- a385_w4/reg385.cjs (runstart check 4): 18 failing checks on live 912dd47a/aad0ad9c (17 "0 copies" in the child, plus __RL).
- tools/libw.py: libsha() of the child throws IndexError on either route; it cannot write after 578. NOT CHANGED here: it needs an engine-only mode (separate build).

Fixed copies (not yet graded; the repo tools are unchanged; before-copies beside them):
- runstart.py 92763329: check 3 for a served child: engine header sha, engine Alternate Pass Call sends lib, child Library Check MAPEXTRA equals the engine's. MAPEXTRA is read from the engine Library Sha node (was hard-coded ['REFP'], stale since ASK 526 added "Alternate Merge CPD"). Live pair: GO (with --no385). Base 628 pair: GO. Base engine + 578 child: REFUSED "3 ENGINE Alternate Pass Call DOES NOT SEND the library text".
- libsha.py 1ae114a7: a served child prints "no Shared Library node: served the engine library in the call (ASK 578); engine sends it: True/False"; EQUAL only if the engine sends.
- reg385.cjs 4df3ad77: a served child's library copies are counted from the engine library (SERVED line). Live: 18 failing checks to 3.
- registry_578.json 9fae66f6: the working registry plus two accepted __RL pairs: 2be75845b4d7 (child R2 Alt Judge Enforcer Retry Build) against 0f0fa74632df and 3be38199f953. The only difference is the IIFE argument the 578 reader change made. Live with it: 1 failing check.

PRE-EXISTING, not from 578 (found here): reg385 FAILS one check, __RL 0f0fa74632df (node copies: Build Save Body, Format Markdown, Enforcer Build and others) against 3be38199f953 (library copies). The registry accepts 0f43c34b3f94 against 3be38199f953, an older node text. Same FAIL on the pairs before 627 and before 628 (the revert files), so runstart check 4 already refused a live pair before tonight's writes. When the node text moved from 0f43c34b to 0f0fa746 is not established here.

Answers to W3 (578 manual entry):
1. runstart.py check 3 with the old tool: fails, REFUSED, line above. Fixed copy prints "ok 3 child has no Shared Library node; it is served the engine library in the call (ASK 578)".
2. libsha.py: same; fixed copy prints the served line with "engine sends it: True" and EQUAL.
3. libw.py: still the named writer, but it cannot run after 578 (child libsha throws). Not changed. A Library change now goes to the engine only; libw.py needs an engine-only mode, not yet built.
4. Pre-run pair check: both. test557.js --pair (578 mode: runs the child Library Check on what the engine sends; THROWS if the engine does not send) and the standing set (serveFrom). runstart check 3 and 4 once the fixed copies are graded and placed.
5. "Alternate Merge CPD" was added to MAPEXTRA by ASK 526 (patch526.py, commit 7a512561).
