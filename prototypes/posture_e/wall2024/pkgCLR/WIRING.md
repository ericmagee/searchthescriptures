# pkgCLR: KSC reads the count line through the shared count-line reader

Enforcer fix (E-KSC, Commitment 15). Built on pkgKSCL's output (s12 + pkgKSCL), so it goes in at the gap after pkgKSCL.

Gap closed: the KSC check read only the label line "CONCEDED LINKS: n". Judges often name the counted premises on the next line
(gemini 33218) or in forms the old tag reader missed. On 201 stored panel judgments with KEYSTONE STANDS, the old reader found 17
breaches and pkgCLR finds 23. All 6 added were checked by hand and are true (29199 grok, 30268 gemini, 31360 qwen, 32905 gemini,
33014 gemini, 33040 grok). None was lost.

Edits, in each of the 5 KSC copies (Send Back Build, Alt Send Back Build, Send Back Record, Alt Send Back Record, Extract Independent Verdict):
1. The CLR library (pkgCLR/clr.cjs) is placed before the KSC library.
2. conceded(t) takes the counted entries of CLR.read(t,'DEFENDER'): the last defender count line plus up to 11 unlabelled continuation lines.
3. counts() maps a premise to its link through the [DR2] list first, then through the premise's own "(LINK n" label. The cure reads a
   CHANGE TO count line through CLR.

Build: `node pkgCLR/build_CLR.cjs` (in: pkgKSCL/out/workflow_KSCL.json; out: pkgCLR/out/workflow_CLR.json; hashes in plan_CLR.json).
Tests: unit.cjs 14/14 (reader); test_CLR.cjs 18 OK (node library); replay_CLR.cjs 24 OK (real 33218 nodes, 12 verdicts, 201 judgments).
Revert: write pkgKSCL's node code back (pkgCLR/base/*.js are those exact bytes).
