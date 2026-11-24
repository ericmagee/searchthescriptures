# ASK 612 BUILD (W4): every n8n expression compiles in n8n's parser before any write
The plan is W3's draft (lab/w3/asks_612_622_draft1.md, ASK 612), which W1 passed. W4 adds nothing beyond it.

Change (test files only; no engine, child or database change):
- standing/inv/s4_compile.cjs: new group S4 with two checks.
  - S4.engine and S4.child: every parameter string that starts with "=" and holds "{{" must compile in @n8n/tournament.
  - The parser version is printed with the result.
- standing/tools/parser/node_modules: @n8n/tournament 1.16.0, copied in from an npm install in the scratchpad. npm cannot install on the network mount, so to reinstall, run npm in a local folder and copy it in.

Criteria:
- (a) Engine fbc09389 + child b9cd4e5c: FAIL S4.engine, 288 of 290. It names Panel Judges Parallel.jsonBody and Alternate Pass Call.workflowInputs.value.pass. Standing 30 PASS, 1 FAIL.
- (b) Live 3cef3eab + b9cd4e5c: PASS, 290 of 290 and 67 of 67. Standing 31 PASS, 0 FAIL.
- (c) The write scripts in use run the standing set and refuse on any FAIL, before any PUT. Those scripts are write_fixqr.sh, write_fix1.sh (591), write591.sh, write601.sh and write611.sh, all of which share the line "node standing/run.cjs ... || { echo STANDING ...; exit 1; }". writef1.sh (611 fix 1) compiles through build611f1.cjs. Every later write script copies the standing line.
- (d) The version (1.16.0) is printed in each S4 line.
- Risk, stated in WRONG-IF: the instance's parser version is unknown. If it differs from 1.16.0, an expression that passes here could still fail on the instance.
