# ASK 576 plan, draft 1 (W1): serve the top-level IMP statements from the Shared Library's existing lines

DRAFT. Nothing is written. Plan grader: W4. Builder and writer: W4, on its own write card, after the operator approves the build.
Assigned by the coordinator (after ASK 575), from W1's survey ASK 572 (Wall 11064, IMP/BAR group; IMP 72% already in LIB).
Base for this evidence: engine d8292f62, child de9efc4e (fairjudge/w1/a573/base_*). THE BUILD IS RE-CUT AFTER THE ASK 559 WRITE (section 5).

## 1. OBJECTIVE
Eleven engine nodes each hold their own top-level copy of the IMP statement (the BAR harvest: AB, GIVE, blocks, harvest, rebutOk): 3 distinct texts. Most of their lines already stand in the Shared Library as whole lines (the Send Back Build/Record modules and their Alt and R2 copies, LIB 2520-2591 and 2849-2863). Each node loads its own text from the library, rebuilt byte for byte. No behaviour change.
Effect, MEASURED on the stored workflow files (node parameter JSON): engine -47,080, child +6,332 (the literal lines go into the child MAP too, for the drift check), NET -40,748.

## 2. ROLES
Planner W1. Plan grader W4. Builder W4 (fresh live readback, after 559). Build grader: a non-builder seat. Write card: W4's own.

## 3. SCOPE, with the SEARCH that set it
1. `IMP` in every engine and child node, parsed with acorn (fairjudge/w1/a576/probe.cjs): top level (or top level of a try block) in 11 engine nodes; nested inside `__O423` in C2B, D3B, C3B Extract; the child holds none outside its library.
2. Groups (each group one identical text, checked by the build):
   - "IMP B Build": C1B, D2B, C2B, D3B, C3B, D4B, C4B Build; 4,616 chars, md5 da5e0dea; 37 lines, 7 not in LIB.
   - "IMP B Extract": C1B, D2B, D4B Extract; 6,208, a3afcfb4; 42 lines, 6 not in LIB.
   - "IMP C4B Extract": C4B Extract; 5,949, 33a263cf; 42 lines, 7 not in LIB.
3. Lines not in LIB, carried as literals in the MAP entry: the AB regex line, GIVE, AG/ANS, two lines inside blocks() (the `if(cur)` and `if(!cur&&...)` lines), the harvest line with `if(!inA(pos))continue;const m=unq(s).match(AB)`, and the return line.
4. Free names of each text: none besides built-ins (probe, acorn). The loader passes nothing.
5. OUT of scope: the three nested IMP copies in C2B, D3B, C3B Extract. They sit inside `__O423`, which was ASK 574's scope (574 draft 1b: W3 recommends HOLD). They stay inline.

## 4. THE CHANGE
1. Shared Library, engine and child alike: 3 new MAP entries ("IMP B Build", "IMP B Extract", "IMP C4B Extract"), each {n, p} over existing LIB lines plus literal lines. NO LIB line is added or changed, so the LIB sha is unchanged; the MAP sha moves in both (pair check).
2. In each of the 11 nodes, the IMP statement is replaced by one loader line of the pkgREFP shape: it throws "ASK 576: the Shared Library holds no <key> entry" or "ASK 576: rebuilt <key> is N, expected M", then runs the text with `new Function(S+'\nreturn IMP;')()`.
3. Design point (coordinator ruling on 575): shared lines stay shared. After 576 the IMP texts share LIB lines with the Send Back modules (and their Alt and R2 copies). An edit to one of those lines changes these nodes too; the pack tool rebuilds every MAP entry at each library write.

## 5. ORDER (must hold)
1. AFTER the ASK 559 write. 559 Change 2 (approved; W4's write card) rewrites the AB line inside IMP in all 14 nodes. 576 is re-cut on the post-559 fetch-back: build576 cuts IMP from the nodes at build time and throws if a group's nodes differ, so the new AB line is carried (as a literal; LIB's own IMP copy keeps the older AB, as 559 states).
2. 571+570, 547+548+552, 573 and 575 also change the library MAP. Whichever is written later is re-cut on the earlier one's fetch-back; build576 patches the fresh fetch, so it works on any of them.

## 6. CRITERIA (test576.cjs, all pass/fail; 46 checks ALL PASS on the base, out_test576.txt)
C1. Engine: only the 11 nodes and the Shared Library change; child: only the Shared Library; connections unchanged.
C2. LIB unchanged in engine and child; every existing MAP entry unchanged; 3 new entries, equal in engine and child.
C3. The nested IMP of C2B, D3B, C3B Extract untouched.
C4. Per node: the text outside the IMP statement unchanged; the served text equals the base IMP statement byte for byte; n equals its length.
C5. Behaviour on run 41822's eight rounds, old statement vs loader, every node: AB, GIVE, the key list, blocks(round) for each round and for all rounds joined, rebutOk(line, round, R) for every line, harvest(R) and harvest(all): 600 outputs identical per node (592 non-empty; no throws).
C6. Negative controls: missing entry throws; one library line changed throws on the length check; a broken AB changes the outputs (the test sees AB).
C7. All 11 nodes parse as Code node bodies. Pair check (W1 libpair.cjs): engine Library Sha into the child Library Check gives same: true (lib f24a5192c60cbc55, map d7c147afd25497b0 on this base).
C8. W1 chk.cjs: 52 MAP modules rebuild, 0 bad; LIB lines changed: none.
"Found nothing" is not a pass for C4 and C5.

## 7. WRONG-IF
Wrong if the post-559 IMP texts within a group are not identical (then a group splits and the saving drops), or if the saving after the child side is too small to justify 11 more loader lines. Measured here: net -40,748. The build prints the net figure again on the post-559 base; the card carries that figure, not this one.

## 8. RUN EVIDENCE
The next run: the B Builds and B Extracts execute; no "ASK 576:" text in debate_errors; the BAR audit lines read as the 41822 replay of the same build predicts.

## 9. INPUTS
fairjudge/w1/a576/: probe.cjs, imp_texts.json, build576.cjs (c39c5fc1), test576.cjs (4d169fd9), out_test576.txt (85bd24fd), this plan. Targets on the mount only: /mnt/project-files/fairjudge/w1/a576/target_engine_576.json (96818e17), target_child_576.json (39688371). Rounds: ask557/w4/build/rounds41822.json.

## 10. STEPS
1. W4 grades this plan. 2. Approval card (W1's thread, card-owed rule) with the net figure. 3. After the 559 write, W4 runs build576 and test576 on a fresh fetch, adds the write script (pair check and test before the PUT; child-PUT failure reverts the engine, as write571.sh 94301107). 4. Non-builder grades the build. 5. W4 writes on its card; W1 reads back.

## 11. REVERT
PUT back the pre-write engine and child bodies; fetch back; pair check.
