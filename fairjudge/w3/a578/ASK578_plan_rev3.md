# ASK 578: the engine passes the library text to the child in the one call; the child's stored copy is removed (W3, PLAN REV 3, in the ASK FORM)

W3 (session_01H1X3ANsGiMnhnbkfphocmo), 15:5x CST 2026-11-24. Rev 3 replaces draft 2 (ASK578_plan.md, f19c711a, kept). It changes: the form (the eight headings of the operational document's ASK FORM, in order; the old sections 4, 5, 8 and 12 now stand inside SCOPE and STEPS); the base (today's live engine 94b682a0 and child b9cd4e5c, on which I re-ran the prototype); how C6 and C7 are shown (Wall 11682 to 11684); the gates added since 11-23 (ASK 612 compile-all, TWO LIVE RUNS, the ASK 599 standard). The change itself is the change of draft 2. PLAN ONLY: nothing is built on today's base, written or carded.

RULES READ: ASK FORM, TWO LIVE RUNS and section 7 (no item-level read of a long execution) of the operational document v145; the build rule; ruling 512 (features go live); the scope rule; ASK 599. The operator, 14:04 CST 11-24: "Let's take care of the library consolidation with the rest of these updates we're going to do for the lab improvements." That joins this ASK to the lab batch; it approves no write.

## 1. OBJECTIVE
The child workflow (the second alternate pass) stores its own copy of the Shared Library, equal to the engine's. Every library change is written twice, and a run stops with pkgLIB1 if the two copies differ. Make the engine's copy the only one: the engine sends its library text in the one call it makes to the child, and the child's library readers read it from the call.
Expected effect: 1,248,437 characters less stored in each child version (measured today, section 5); one library write instead of two; the fault "engine and child libraries differ" can no longer occur. It does not make a run faster. No prompt, reasoning setting, model setting, check rule or output changes.

## 2. ROLES
Planner: W3. Builder and writer: W4 (alone reads and writes n8n; W4's own cards). Grader: W1. Manual entry and AAR row: W3, drafted with the build. Nothing is written by this plan.

## 3. SCOPE, with the SEARCH that set it
SCOPE in one line: engine node Alternate Pass Call (one field added to one expression); child: the node Shared Library removed, 14 readers changed in one expression each, Library Check (ASK 422a) changed in its last statements and in its __MAPEXTRA422 line.

SEARCH, repeated today by prototype t578b.js on W4's fetch-backs of the live pair (ask608/w4/write/fetchback_eng_608.json 89618718, version 94b682a0, 423 nodes; fetchback_child_608.json acbd7433, version b9cd4e5c, 156 nodes). Output a578/t578b_on94b682a0.out, 22 checks, ALL PASS:
1. Child nodes that read `$('Shared Library').params.jsCode`, the library node itself and Library Check left out: 14, once each: the 13 stubs (R2 Alternate Build, R2 Alternate Merge Seat, R2 Alt Judge Enforcer Build, R2 Alt Judge Enforcer Record, R2 Alt Send Back Build, R2 Alt Send Back Record, R2 Alt Gate Build, R2 Alt Gate Record, R2 Alt Late Gate Build, R2 Alternate Payloads, R2 Alternate Cure Build, R2 Alternate Cure Normalize, R2 Alternate Merge) and R2 Alt Judge Enforcer Retry Build (ASK 573, live). No other child node names the Shared Library node anywhere in its parameters.
2. Each reader asks for one MAP key, 14 different keys (the 13 stub keys and __RL). For all 14 the engine library rebuilds the same text, of the same n, as the child library. None of the 14 served texts holds the words "Shared Library".
3. The child Shared Library node has no connection in or out. Engine LIB equals child LIB (lib 802077b0878612c9, map 86cbe4d352598877; engine MAP 64 keys, child 62).
4. The engine's Alternate Pass Call holds the anchor `lib_sha: $json.__lib422,` once.
5. From draft 2, NOT repeated today: the child is called by one engine node (Alternate Pass Call, mode once, waits for the child); 38 child nodes already read `$('Alternate Pass In').first().json.pass...`; the two nodes after Library Check do not copy `pass`.
NOT SEARCHED: whether any workflow other than the engine calls the child; whether a later ASK than 608 has changed either workflow (W4 builds on a fresh fetch and the build finds the readers itself, never from this list).

THE CHANGE (exact text in t578b.js):
A. Engine, Alternate Pass Call, the `pass` expression: before `lib_sha: $json.__lib422,` insert `lib: $('Shared Library').params.jsCode, `. The expression grows from 7,191 to 7,231 characters. No other engine node changes.
B. Child, each of the 14 readers: `$('Shared Library').params.jsCode` becomes `$('Alternate Pass In').first().json.pass.lib`. Nothing else in the node changes. RULE FOR THE BUILDER: every child node that reads the Shared Library node is repointed, and the build stops on a reader of a shape the test does not know.
C. Child, Library Check: (1) its `const __MAPEXTRA422=["REFP"];` line becomes the engine's line `const __MAPEXTRA422=["REFP","Alternate Merge CPD"];` (read at the build), because the text it now hashes is the engine's; (2) its last statements (704 characters, md5 293429b9, from `const __it=$input.all();`) are replaced: it takes the library text from the call; with none it throws "pkgLIB1: the call carries no library text (ASK 578)"; it computes the LIB sha and MAP sha of the text received as the engine's Library Sha node does; if either differs from the sha the engine sent it throws pkgLIB1; it returns the item with `pass` as before but WITHOUT the library text.
D. Child, node Shared Library: removed.
What replaces the two-copy check: the same node proves that the text which arrived is the text the engine hashed, whole and unchanged in LIB and in MAP. Each stub still checks the rebuilt length against n.

COSTS AND RISKS (stated, not argued):
1. The child can no longer be run by itself: without the engine's call it throws at Library Check.
2. A new dependence on n8n behaviour (C7 a, b). FALLBACK if C7 (a) fails: the engine's Library Sha node, which already reads the text, adds it to its item, and Alternate Pass Call sends that; cost about 1.2 MB more saved in each engine execution that reaches the second alternate pass, and a second engine node changed. The fallback is a plan change and returns for a grade.
3. The call grows by 1,203,237 characters (1,206,177 bytes). W4 measured on 11-23 (Wall 11115) that the one item the child received in run 41822 was 7,922,094 JSON characters and that execution succeeded. NOT ESTABLISHED: the instance's configured payload limit; no seat can read it; it is stated on the operator's card.
4. The child's __MAPEXTRA422 line must equal the engine's; a difference stops the run at the child's first node with the pkgLIB1 text (fails closed).
5. 16 child nodes and 1 engine node change in one ASK, in the path of the second alternate pass only.

## 4. CRITERIA and DONE (each can pass or fail)
C1. For each reader found on the build base, the source it rebuilds from the passed engine text equals, byte for byte, the source it rebuilds today from the child node.
C2. Engine: only Alternate Pass Call differs, by the 40 inserted characters; every other node keeps its md5. Child: the readers differ by the one expression; Library Check differs as in C above; Shared Library is absent; every other node and every connection is unchanged.
C3. No child node names the Shared Library node anywhere in its parameters.
C4. Library Check, offline, on the text and shas the engine sends: passes, and its output holds no library text.
C5. Negative controls on Library Check: no text; text cut short; one character changed in LIB; one in MAP; no engine sha; the child's old __MAPEXTRA422 list. Each throws pkgLIB1.
C6. Output test: the readers are run offline on the inputs of a run in which the second alternate pass ran, once as today and once as changed; outputs equal as JSON. HOW: W4 checks first whether those inputs can be rebuilt offline from stored database rows, as was done for ASK 611 (Wall 11684). If they can, C6 is shown that way and the population is named. If they cannot, ONE question goes to the operator for a read limited to the named nodes of one named execution; without his yes C6 is reported NOT SHOWN on the write card, with C1 (byte-equal sources) as what stands in its place.
C7. n8n behaviour: (a) the expression `$('Shared Library').params.jsCode` resolves in the Execute Workflow node although the Shared Library node never runs; (b) the child receives a string of the same length. HOW: a small test workflow (an inactive copy of the real Shared Library node, an Execute Workflow node with the same pass expression, a two-node test child that returns the length it received). W1's conditions (Wall 11683), accepted: the test workflow is itself a change to the live system, so it goes on the operator's card FIRST, in W4's thread; its full JSON is in git; no credential, webhook or schedule; never active; run once by hand with no run live; deleted afterwards and the deletion read back. (c) the real child execution's saved size and duration before and after: measured on the first live run that reaches the second alternate pass, NOT before the write; the write card says so.
C8. ASK 612's compile-all passes on both targets; the standing set passes; the grade states the ASK 599 standard's result.
DONE: built on a fresh fetch, graded, written by W4 on its own card, read back by a seat other than W4, C1 to C5 and C8 shown on the written workflows' fetch-backs, the manual entry written, and TWO LIVE RUNS in which the second alternate pass runs with no pkgLIB or pkgLIB1 error and stores its rows.

## 5. WRONG-IF, and what is measured
This plan aims at the wrong thing if the call cannot carry the text on this instance (C7 a or b fails and the fallback is refused), or if the child pass becomes measurably slower, or its saved executions become a storage problem (C7 c).
MEASURED today on the live pair (t578b_on94b682a0.out): child nodes as JSON 1,346,144 to 97,707, saved 1,248,437; the child's Shared Library node is 1,248,818 as JSON; engine grows by 40 characters; text passed in the call 1,203,237 characters. C1 to C5: run, all pass, known-good and six known-bad cases.
NOT MEASURED (they are C7): the run-time cost of reading the text from the call instead of from a node; the growth of each saved child execution (I expect about 1.2 MB once per child execution, because Library Check strips the text from its output; a guess until C7 c).
STALE AND NOT TO BE USED: W4's 11-23 build (ask578/w4/build targets abe5b469 and b24d9f83; write578.sh 84e29766) was cut on an older stack; it is re-cut, not written.

## 6. RUN EVIDENCE
A live run that reaches the second alternate pass: the child's Library Check output shows same: true; the 13 stubs execute, and R2 Alt Judge Enforcer Retry Build when a retry is needed; the pass's rows are stored; no "pkgLIB" text in debate_errors. Two such runs (TWO LIVE RUNS). A run that does not reach the second alternate pass does not prove this ASK. Case and mark: named by W4 in the build notes, or NO PROBE stated.

## 7. INPUTS IN GIT
fairjudge/w3/a578/: ASK578_plan_rev3.md (this file); ASK578_plan.md (draft 2); t578b.js fc344b9f (prototype: finds the readers, makes the targets, runs the checks and controls); t578b_on94b682a0.out 0ccae4a4 (today). Bases: ask608/w4/write/fetchback_eng_608.json, fetchback_child_608.json. For the builder: ask578/w4/build (11-23 build, stale), ask612 standing set (standing/inv/s4_compile.cjs).

## 8. STEPS, each naming its card
1. W1 grades this plan (no card).
2. W4 reports the C6 check and puts the C7 test workflow's JSON in git; W1 grades the test workflow against its conditions. CARD 1, W4's thread: "Run the one-time test workflow for ASK 578?"
3. W4 runs the test once, deletes it, reads the deletion back; posts C7 a, b.
4. W4 re-cuts the build on a fresh fetch, AFTER ASK 579 is written (579 first, as planned on 11-23; if the coordinator reverses the order, the ASK 579 plan loses its child library step and returns for a grade) and after the run that proves ASK 611. Runs C1 to C5, C8; posts the build. W1 grades it.
5. CARD 2, W4's thread, the write card: the change in plain words, the 1,248,437 saved, the five costs, the payload limit not established, C6's state, C7 c owed on the first run.
6. WRITE in one script, engine first, then child. After the engine step alone a run still passes (the old child ignores the extra field). After the child step alone the child throws pkgLIB1 at its first node; therefore if the child write fails the engine is reverted at once.
7. Readback by W1. After 578 the pack tool and every write script write the engine library only, and keep the child's __MAPEXTRA422 line equal to the engine's.
8. CARD 3, my thread: the engine manual entry (the body states what the engine now does, and the library's head comment "the 22 library nodes" is corrected).
9. Two live runs that reach the second alternate pass; C7 c reported from the first.
REVERT: restore the child (all nodes, Shared Library included) and the engine's Alternate Pass Call from the pre-write exports; compare md5 per node. If a library write was made in between, the child's Shared Library is taken from the engine's current text before it is restored, or the revert would itself produce the drift this ASK removes.
