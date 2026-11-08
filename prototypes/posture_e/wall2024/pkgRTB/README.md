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

## Family 2: RETRACTED (cure phase), step 2 (design DESIGN_RETRACTED.md, Wall 3297)

- rule_table.cjs RX row: form `RETRACTED: D<n> vs C<m> -- <the reason: the round in brackets, then its words quoted or the verse it cites>`, the
  one CORRECTED RESULT for the whole reply, and an example read by the shared reader __RL as RETRACTED with a reason. RXSB (send-back) unchanged.
- Why: the cure reader marks RETRACTED UNCURED without a reason that names a round and quotes words or cites a verse (rxNoWhy, ruling 105)
  and without exactly one CORRECTED RESULT (rxNoRes). Of 11 ask copies, only 1 stated both. The log shows 11 items UNCURED "RETRACTED with
  no reason" and 6 "without exactly one CORRECTED RESULT".
- build_RTB_subs.cjs: 15 clause substitutions (form, K-F, K-L2, K-G9, K-G7, K-C, K-G1 count, K-FF, K-FC, the uwb ask, and others), each now
  the table render. No reader or cure logic changes.
- Same build, same test. Replay puts each rendered string back to its old text and requires byte-equal output.

### Step 2 revision (W1 HOLD 3331, W4 FAIL 3338)
- Wording: the reason now reads "the round in brackets, then its words quoted or the verse it cites". The old "..., or the verse" read as if a
  verse alone would do; cureReasoned always needs the round, plus a 3+ word quote or a verse.
- test_RTB 1d: the example reason cures under the library's own cureReasoned; a verse-only reason stays UNCURED; round + verse cures.
- Strips: pkgLIB/strip_RTB is again the graded step 1 (f60e4a8). Steps 1+2 build into pkgLIB/strip_RTB2.

### Restack for s66 + KWQ (v33b)
- pkgLIB/strip_RTB2K = W1's build_KWQ run on strip_RTB2: `node pkgKWQ/build_KWQ.cjs pkgLIB/strip_RTB2 pkgLIB/strip_RTB2K` (26 nodes).
- Exactness check: with the RX renders put back to their old text (and the K-FF/K-FC fold), all 30 strip_RTB2K files equal strip_KWQ_R1
  byte for byte. So strip_RTB2K is strip_KWQ_R1 plus exactly the step 2 text.
- Pack pkgLIB_RTB2K (LIB_N=30): Shared Library 986f3efb1447. E4 rebase on target_s66_kwq lines 9+: Alternate Build 108873896a19,
  Early Alternate Build 2ff9dd790123, both rebuild to 309508 = __N and equal the strip's full Alternate Build.
