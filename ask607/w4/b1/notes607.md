# ASK 607 BUILD rev 0 (W4): a gate change the engine cannot read is recorded, not counted

Plan: ask607/w4/plan607.md 34db6c5d (W1 PASS with N1, Wall 11733). Ruling: "Record-only, as ASK 549", pressed 15:33 CST 11-24.
Base: live engine 94b682a0 and child b9cd4e5c, fetched 15:50:53 to 15:50:57 CST 11-24 (base_*.json; file times). Corrected 16:33 CST: rev 0 said "about 16:10", which was wrong. LIB 802077b0878612c9.

## The change (build607.cjs)
One Library line (LIB 1434, the same in engine and child), in sbApply2024's form refusal:
- before: `items.push({sid:x.sid,kind:'NOT APPLIED',why:'the CHANGE TO line has no line form the engine reads'+__rtH,to,lines:[o]});`
- after: the same push with `rfs:'pkgFRM'/* ASK 607: a gate change in no line form is recorded, not counted, as ASK 549 */` added after `lines:[o]`.
No other text changes. The gate prompt sentence is untouched.
- MAP n recomputed for the 13 entries that hold the line (Gate Build, Gate Record, Late Gate Build, the Alt and R2 forms, and the Alternate Merge entries).
- New library sha 2f5aa1e63d51edb1. Shared Library node: engine 00a5653f to e65629eb, child 19d1ecb3 to 72757492.
- Targets: target_engine_607.json 46a1862b, target_child_607.json b367f537. Only the Shared Library changes, and connections are equal.
- Readers of `.rfs` (search of engine and child Library and every other node): only the ASK 549 reader in gateCure2024's NOT APPLIED branch. The writers are pkgSGA (2 sites), pkgPS (1 site) and now pkgFRM (1 site).

## Criteria

### C1 (c1_607.cjs, out_c1_607.txt)
The real gateCure2024 of Gate Record is run with every helper cut from the Library as built; only `$` is stubbed. Inputs are read from the DB into data607.json: the stored judge text, the stored gate reply and each stored flagged line.
- Luna, judgment 1122, rows 29285 to 29295 (G3 to G13). Each row is UNCURED and counted before. After, each is UNCURED and record-only, with the reason "pkgFRM refused the gate change; the judge's line before the change stands (recorded, no seat removed): the CHANGE TO line has no line form the engine reads ...". Counted: 11 before, 0 after.
- The judge text used is the stored final text, because the gate-time text is not stored. The refused lines are unchanged in it, so the form refusal is reached as it was at the gate.
- Chatgpt, judgment 988, rows 7218 to 7224 (W1 N1). Today's engine does not form-refuse these gate changes:
  - G3, G4, G5 and G7 apply.
  - G1 and G2 are placement refusals ("the flagged line is not in the judge text").
  - The 11-06 form refusals came from the engine-made fragment defect (each flagged line was a bare grade word), which the plan keeps out of this ruling.
  - Old and new give the same row for all seven. They stay as they are.

### C2 controls (c2_607.cjs, out_c2_607.txt)
Each control gives the same row old and new:
- (a) A KEEP on a NOT APPLIED item stays CURED.
- (b) A silent item stays UNCURED and counted.
- (c) The applied gate changes G1 and G2 (rows 29283 and 29284) stay CURED. Every other gate row is byte-equal.
- (d) A pkgSGA refusal and a pkgPS refusal stay record-only under their own names. Here gateItems2024 is stubbed, as in test549.
- (e) Row 31511 is never record-only. On the stored final text, today's engine applies that change, so the 11-11 placement refusal is not reproduced. The plan keeps 31511 out of the class.

### C3 send-back stage (c3_607.cjs, out_c3_607.txt)
Input: judgment 1272 with gemini's S1 to S17.
- Lines whole: the applied list (14), the items, the text and the result are equal old and new.
- Lines cut at 1,500: everything is equal except `rfs:'pkgFRM'` on S13, the one form-refused item.
- At this stage the mark is carried and not read.

### C4 stored-row count (out_c4_607.txt, with its SQL)
- 25 stored, counted gate form refusals, all on NOT APPLIED items: ids 7218 to 53202, seats chatgpt, gemini, grok, luna and sol, 6 debates.
- Form refusals on items of other kinds: 0. Nothing goes to the operator as a question.

### C5
- Library Check pair PASSES (engine and child lib 2f5aa1e63d51edb1; out_pair_607.txt).
- Standing set 31 PASS 0 FAIL, including ASK 612 compile-all: 290 of 290 engine and 67 of 67 child (out_standing_607.txt).

### C6 (ASK 599)
No dead code. The mark is read by the ASK 549 reader. One ASK 607 tag sits on the changed line, in each workflow.

## Write (write/write607.sh f167e3a9), on the press of the write card
1. Run gate.
2. Rebuild, then C1 to C3 must all pass.
3. Fetch each workflow live. Its Shared Library must equal the base; the rest is taken as it is live, so the script holds whether or not ASK 623 is written first.
4. Save revert copies.
5. Run the standing set on the two workflows to be written.
6. PUT the engine, then the child.
7. Fetch back, then run the standing set and the pair Library Check.
8. Then: audit_log, Wall, W1 readback. W3 writes the manual entry and the AAR row.

Run evidence: an E-GATE row whose cure_reason begins "GATE CHANGE TO" and whose cure_reason also carries "pkgFRM refused the gate change ... (RECORD-ONLY)". Gate form refusals are rare, so the first runs are likely UNEXERCISED.
CORRECTED 00:14Z 11-25 (W3 Wall 11817): line 63 said "result"; debate_enforcer_log has no result column, the text is in cure_reason.
