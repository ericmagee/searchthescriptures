# pkgRTB: one rule table, family 1 = K-W (tracker D50; W2, 11-08)

Approved redesign item 1 (Eric 07:42 CST 11-08, Wall 3161). Design: DESIGN.md (Wall 3257); design change in Wall 3291: build-time render from one
table file plus a conformance check, not a runtime read of $('Shared Library') (a runtime read cannot be replayed by the harness).

- pkgRTB/rule_table.cjs: the K-W row: 4 forms in cure-reader order (STANDS WITHOUT IT because <layer> = kwSt; CONCEDED = kwCo;
  REASSERTED IN <round> "<quote>" = kwRe; NOT HELD with a reason quoting 6 words of the flagged sentence = KW_NH), each with an example;
  the stake sentence from ENF_STATUS['K-W']; renders for agreement, audit mark, cure-ask tail, DeepSeek rule.
- build_RTB.cjs renders every copy (tally: agreement 18, audit 60, cureAsk 26, stake 26, enforcer 3):
  - library: pkgLIB/strip_RCD (v32) -> pkgLIB/strip_RTB (30 nodes);
  - prompt nodes -> pkgRTB/patched (11): Panel Build, Reserve Build, Accept Build, Accept Check, Accept Return Build, Accept Final,
    Accept DS Return Build (live s64); Enforcer Build, Alt JEB, R2 Alt JEB (pkgEKS/patched); Judge Enforcer Build (pkgRP10/patched).
- Drift fixed: agreement now lists NOT HELD; audit marks list REASSERTED; cure ask names REASSERTED and NOT HELD and says K-W is LIVE
  (it said TRIAL while ENF_STATUS has LIVE); DeepSeek RULE K-W says NOT HELD's reason must quote the flagged sentence.
- DeepSeek enforcer change: yes (Enforcer Build, Alt JEB, R2 Alt JEB rule text and agreement copy).
- test_RTB.txt: 47 OK, 0 FAIL. Each example is read by its own reader only; 0 old copies left in 41 files; rendered copies = build tally;
  every library and prompt node on every saved run (950 node runs) is byte-equal to base once the K-W strings are put back
  (348 differ only in K-W text, 0 other changes).
- Library part restacks on W1's strip_RI5C (v33) when posted (Wall 3292): node pkgRTB/build_RTB.cjs pkgLIB/strip_RI5C pkgLIB/strip_RTB.
- Write: the 11 pkgRTB/patched nodes, plus the packed library from strip_RTB. Run test_RTB before each write as the drift check.
