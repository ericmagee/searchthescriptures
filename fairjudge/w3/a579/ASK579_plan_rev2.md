# ASK 579: the nine B-Extract and G-Extract layer blocks are served from the Shared Library (W3, PLAN REV 2, in the ASK FORM)

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 15:5x CST 2026-11-24. Rev 2 replaces draft 1 (ASK579_plan.md, b1cba096, kept). It changes: the form (the eight headings of the operational document's ASK FORM, in order; the old sections 4, 5, 8 and 12 now stand inside SCOPE and STEPS); the base (today's live engine 94b682a0 and child b9cd4e5c, on which I re-ran the prototype); how C6 is shown (Wall 11684); the gates added since 11-23 (ASK 612 compile-all, TWO LIVE RUNS, the ASK 599 standard). The change itself is the change of draft 1. PLAN ONLY: nothing is built on today's base, written or carded.

RULES READ: ASK FORM, TWO LIVE RUNS and section 7 of the operational document v145; the build rule; ruling 512; the scope rule; ASK 599; "NEVER TOUCH REASONING" (no call is changed). The operator, 14:04 CST 11-24: "Let's take care of the library consolidation with the rest of these updates we're going to do for the lab improvements." That joins this ASK to the lab batch; it approves no write.

## 1. OBJECTIVE
Nine engine nodes each hold one large block that reads a debater's re-call reply: the `__O423` statement in C2B, D3B and C3B Extract, and the call inside `try{__X2=(()=>{...})()[0].json;}` in C4G, C3G, C1B, D2B, D4B and C4B Extract. The nine texts share most of their lines. Store each line once in the Shared Library and let each node rebuild its own text, byte for byte.
Expected effect: 44,229 characters less stored while the child keeps its library copy, 114,298 once ASK 578 removes that copy (measured today, section 5); one place to edit a line the nine nodes share. No behaviour changes: no prompt text, no reasoning setting, no check and no output.

## 2. ROLES
Planner: W3. Builder and writer: W4 (alone reads and writes n8n; W4's own card). Grader: W1. Manual entry and AAR row: W3, drafted with the build. Nothing is written by this plan.

## 3. SCOPE, with the SEARCH that set it
SCOPE in one line: one statement in each of nine engine nodes; the Shared Library of the engine AND of the child (the same lines appended to both, the same nine MAP entries in both, the sha header of both). No other child node. __MAPEXTRA422, Library Sha and both Library Check nodes are not touched.

SEARCH, repeated today by prototype t579.js on W4's fetch-backs of the live pair (ask608/w4/write/fetchback_eng_608.json 89618718, version 94b682a0; fetchback_child_608.json acbd7433, version b9cd4e5c). Output a579/t579_on94b682a0.out, 99 checks, ALL PASS:
1. Engine nodes with a top-level `const __O423=` statement: 3, the three named. Engine nodes with a top-level `try{__X2=(()=>{` block: 6, the six named. The child holds neither shape outside its library.
2. Sizes of the nine served texts today: O423 C2B 24,300; D3B 25,557; C3B 28,416; X2 C4G 24,428; C3G 16,396; C1B 12,610; D2B 12,859; D4B 22,457; C4B 24,428. Total 191,451 characters, 9 different texts, 307 different lines. The nine nodes hold 226,060 characters.
3. Each of the six try blocks has the shape `try{__X2=<call>[0].json;}catch(x){return __keep(...);}`; the served text is `<call>`.
4. Free names of each served text (parser): `$` and `$input` only. No this, await, yield or arguments.
5. Engine LIB equals child LIB before the change (3,582 lines; lib 802077b0878612c9, map 86cbe4d352598877).
6. NOT TAKEN, as in draft 1: the four statements __LB423, __CC423, __LC423 and __A423 (2,851 characters, one text in three nodes). Too little saved for a loader in three nodes.
NOT SEARCHED: workflows other than the engine and the child; whether an ASK after 608 has changed these nodes (W4 repeats search 1 on a fresh fetch). NOT CHECKED BY ME TODAY: draft 1's order notes on ASK 559 and 561 (whether each is live); the prototype passing on the live pair shows the nine shapes stand as the plan needs them, and W4 states the queue in the build notes.

THE CHANGE (full loader text in t579.js, functions core, stub, stubX, pre):
1. Shared Library, engine and child, the same text in both: a line that already stands in the library is served from where it stands (37 lines, 4,623 characters); the lines the library lacks are appended after the last existing line (270 lines, 65,121 characters). No existing line is moved or changed.
2. Nine MAP entries in both MAPs, "O423 <node>" (3) and "X2 <node>" (6), each `{n: <length>, p: [...]}`. The child has no node that asks for them; they stand there so that the two libraries stay identical. The sha header is reset in both.
3. In C2B, D3B and C3B Extract the `__O423` statement is replaced by a loader of the pkgREFP shape: it throws "pkgX579: ..." if the entry is missing or the rebuilt length differs from n, and passes `$` and `$input`.
4. In the six try nodes a loader statement is placed directly BEFORE the try, and the call inside the try becomes `__F579($,$input)`. WHY BEFORE THE TRY: the catch of these nodes turns any error into "the re-call reply was not read" and keeps the first reply. A loader inside the try would hide a library fault as a kept first reply. Before it, a library fault throws and stops the node; an error in reading the reply is caught exactly as today.
5. Each loader is preceded by one `if(false){$('<node>');...}` line naming every node the served text reads through `$()` (6 to 11 names per node, listed in the output), as the library stubs do.
6. Nine stored texts are served as nine texts. No text is merged with another.

COSTS AND RISKS (stated, not argued):
1. A new failure mode in nine round-keeping nodes: if the library and a MAP entry disagree, the node throws and the run stops at that round. Guards: Library Check at run start, the sha header, the length check, the pair check.
2. One more parse of the library text (about 1.2 MB; 2.4 to 2.5 ms in my container on 11-23) per execution of each of the nine nodes. Not measured on the instance.
3. Reading the code: the nine nodes show a loader instead of their logic.
4. Reuse couples these texts to 54 other library entries through 37 shared lines (47 on 11-23). An edit of equal length to a shared line passes the length check silently. Guard: C8 and the pack tool rebuilding every n at each library write.
5. With the child copy still in place, each appended character is stored twice.
6. Any later ASK that edits a line inside these blocks edits the library line and the n of every entry it serves, not the node.

## 4. CRITERIA and DONE (each can pass or fail)
C1. For each of the nine nodes, the text rebuilt from the packed library (engine and child) equals the node's pre-write text byte for byte, and its length equals n.
C2. In each node every character before the changed statement and after the served text is unchanged; every other engine node keeps its md5; in the child only the Shared Library changes.
C3. Existing library lines unchanged, in place, in both; LIB equal in engine and child; every existing MAP entry rebuilds the same text.
C4. Free names of each served text: `$` and `$input` only (parser).
C5. Negative controls, per node: one served line changed, the loader throws on the length check; the MAP key removed, the loader throws on the missing entry. For the pair: lines appended to the engine only fail the pair check.
C6. Output test: each of the nine nodes is run offline on a run's inputs, once with the pre-write code and once with the loader and the packed library; outputs equal as JSON. For the six try nodes the population must include a case in which the re-call ran and one in which it did not. HOW: W4 checks first whether those inputs can be rebuilt offline from stored database rows, as for ASK 611 (Wall 11684). If they can, C6 is shown that way and the population named. If they cannot, ONE question goes to the operator for a read limited to the named nodes of one named execution; without his yes C6 is reported NOT SHOWN on the write card, with C1 (byte-equal code) as what stands in its place.
C7. Offline: the engine's Library Sha output fed to the child's Library Check gives same: true; Library Check passes in the engine. On the instance after the write: the run-start check prints GO.
C8. The build post lists every reused library line number and every other MAP entry that serves any of them (today 37 lines, 54 entries; both lists are in the output), and the pack tool's map_touched output.
C9. ASK 612's compile-all passes on both targets; the standing set passes; the grade states the ASK 599 standard's result.
DONE: built on a fresh fetch, graded, written by W4 on its own card, read back by a seat other than W4, C1 to C5 and C7 to C9 shown on the written fetch-backs, the manual entry written, and TWO LIVE RUNS in which the nine nodes execute with no pkgX579 error and store their rounds.

## 5. WRONG-IF, and what is measured
This plan aims at the wrong thing if, on the base it is finally cut on, the net stored saving is too small to pay for nine new throw paths. I propose the line at 20,000 characters net in the state the team expects to keep.
MEASURED today on the live pair (t579_on94b682a0.out): the nine nodes go from 226,060 to 41,693 characters (saved 184,367); each Shared Library grows by 70,069. NET stored saving with the child copy 44,229; for the engine alone, the state once ASK 578 removes the child copy, 114,298. Known-good: the pair check passes on the live pair and on the packed pair (lib 4e6fe0dc430361bb, map f6a2b73705b0c9ec). Known-bad: 18 loader controls and the engine-only append, all throw or fail as they must.
NOT RUN: C6 and the instance half of C7 (I hold no node inputs and do not read executions).
STALE AND NOT TO BE USED: W4's 11-23 build (ask579/w4/build targets 630c2b73 and d75d4760) was cut on an older engine; it is re-cut, not written.

## 6. RUN EVIDENCE
A live run with the Oracle defending in which the nine nodes execute and the stored rounds are present; no "pkgX579" text in debate_errors. Two such runs (TWO LIVE RUNS); between them at least one execution in which a re-call ran. Case and mark: named by W4 in the build notes, or NO PROBE stated.

## 7. INPUTS IN GIT
fairjudge/w3/a579/: ASK579_plan_rev2.md (this file); ASK579_plan.md (draft 1); t579.js be789169 (prototype); t579_on94b682a0.out 0d4894c6 (today). Bases: ask608/w4/write/fetchback_eng_608.json, fetchback_child_608.json. For the builder: ask579/w4/build (11-23 build, stale), ask612 standing set (standing/inv/s4_compile.cjs).

## 8. STEPS, each naming its card
1. W1 grades this plan (no card).
2. W4 reports the C6 check (no card; if a limited read is needed, ONE question to the operator in W4's thread).
3. W4 re-cuts the build on a fresh fetch, after the run that proves ASK 611, and BEFORE ASK 578. Runs C1 to C5, C7 offline, C8, C9; posts the build. W1 grades it.
4. CARD 1, W4's thread, the write card: the change in plain words, the two net figures, the six costs, C6's state.
5. WRITE by W4: engine and child libraries and the nine nodes in one script; the pair check before and after.
6. Readback by W1.
7. CARD 2, my thread: the engine manual entry.
8. Two live runs with the nine nodes executed.
REVERT: restore the nine nodes and both Shared Libraries from the pre-write exports; compare md5 per node; the pair check passes.
