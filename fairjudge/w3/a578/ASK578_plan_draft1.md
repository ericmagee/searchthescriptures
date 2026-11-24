# ASK 578: the engine passes the library text to the child in the one call; the child's stored copy is removed (W3, PLAN DRAFT 1)

DRAFT ONLY. Nothing is written. Assigned by the coordinator at 18:21 CST 11-23, from option C of my ASK 577 survey (Wall 11081). The plan needs W4's check of 577, a grade (W1), the builder's check (W4) and the operator's approval. Order of grading fixed by the coordinator: W1 grades after W4 has checked 577.

## 1. OBJECTIVE
The child workflow (the second alternate pass) stores its own copy of the Shared Library, byte for byte the engine's LIB. Every library change is therefore written twice, and a run stops with pkgLIB1 if the two copies differ. Make the engine's copy the only one: the engine sends its library text in the one call it makes to the child, and the child's 13 library nodes read it from the call.
Expected effect: about 1.19 MB less stored in each child version; one library write instead of two; the class of fault "engine and child libraries differ" can no longer occur. It does not make a run faster. No prompt, reasoning setting, model setting, check rule or output changes. It is not a command from the operator; it answers his standing request for efficiency findings, and it goes to him for approval.

## 2. ROLES
Planner: W3. Builder and writer: W4 (alone writes n8n; W4's own write card). Grader: W1. Nothing is written by this plan.

## 3. SCOPE, with the SEARCH that set it
Scope in one line: engine node Alternate Pass Call (one field added to one expression); child: the node Shared Library removed, 13 stubs changed in one expression each, Library Check (ASK 422a) changed in its last statements and in its __MAPEXTRA422 line.
SEARCH (W4's ASK 571 targets, ask571/w4/build/target_engine_571.json and target_child_571.json; repeated on the live fetch-backs d8292f62 and de9efc4e with the same results):
1. Child nodes whose code reads `$('Shared Library').params.jsCode`: 14, once each. 13 stubs (R2 Alternate Build, R2 Alternate Merge Seat, R2 Alt Judge Enforcer Build, R2 Alt Judge Enforcer Record, R2 Alt Send Back Build, R2 Alt Send Back Record, R2 Alt Gate Build, R2 Alt Gate Record, R2 Alt Late Gate Build, R2 Alternate Payloads, R2 Alternate Cure Build, R2 Alternate Cure Normalize, R2 Alternate Merge) and Library Check (ASK 422a).
2. Each stub asks for one MAP key; 13 different keys. For all 13 the engine library rebuilds the same text, of the same n, as the child library.
3. None of the 13 served texts holds the words "Shared Library", so no code inside them reads the child node.
4. The child Shared Library node has no connection in or out.
5. The child is called by one engine node, Alternate Pass Call (Execute Workflow, mode once, waits for the child), with one input object `pass`. Library Sha (ASK 422a) feeds it and nothing else.
6. 38 child nodes already read `$('Alternate Pass In').first().json.pass.h[...]`; the form the stubs will use is the form the child uses today.
7. After Library Check, the next node (Alternate Pass Check) returns named fields only and does not copy `pass`; Alternate Pass Entry returns `pass.sa` only.
Not searched: whether any workflow other than the engine calls the child; the builder repeats the search of ASK 571 on the two other workflows and on a fresh fetch.
CORRECTION to my ASK 577 survey (Wall 11081, item 3): the child asks for 13 keys, not 22. My count matched node names that stand in the stubs' `if(false){$("...")}` lines. The 13 keys serve 3,494 of the library's lines (963,305 characters), so the figure for option B hardly changes.

## 4. The change (exact text; the full code is in t578.js)
A. Engine, Alternate Pass Call, the `pass` expression. Anchor (one occurrence): `lib_sha: $json.__lib422,`. Insert before it: `lib: $('Shared Library').params.jsCode, `. The expression grows from 5,950 to 5,990 characters. No other engine node changes; the engine Shared Library, Library Sha and Library Check are not touched.
B. Child, each of the 13 stubs: `$('Shared Library').params.jsCode` becomes `$('Alternate Pass In').first().json.pass.lib`. Nothing else in the stub changes; its two length and missing-entry throws stay.
C. Child, Library Check (ASK 422a):
 1. Its `const __MAPEXTRA422=["REFP"];` line becomes the engine's line, `const __MAPEXTRA422=["REFP","Alternate Merge CPD"];` (read at the build), because the text it now hashes is the engine's.
 2. Its last statements (704 characters, md5 293429b9, from `const __it=$input.all();`) are replaced. In plain words: it takes the library text from the call; if there is none it throws "pkgLIB1: the call carries no library text (ASK 578)"; it computes the LIB sha and the MAP sha of the text received, as the engine's Library Sha node does; if either differs from the sha the engine sent it throws "pkgLIB1: the library text received differs from the engine library, ..."; it returns the item with `pass` as before but WITHOUT the library text, and with the same lib422 record as today.
D. Child, node Shared Library: removed (1,198,400 characters as JSON on the 571 target).
What replaces the two-copy check: today the child compares its own copy with the engine's sha. After the change there is one copy, and the same node proves that the text which arrived is the text the engine hashed: whole, unchanged in LIB and in MAP. Each stub still checks the rebuilt length against n.

## 5. Order and dependencies
1. Written in two steps, engine first, then child, in one script. After the engine step alone, a run still passes (the old child ignores the extra field, but it then carries the text through Library Check's output; safe, heavier). After the child step alone, with the old engine, the child throws pkgLIB1 at its first node. If the child write fails, the engine is reverted at once (the rule of ASK 571 condition C1).
2. Every build already cut that writes the child's Shared Library (571+570, 547+548+552, 573, 575, 576) is either written before 578, or re-cut after it without the child library step. 573 also changes one child stub (R2 Alt Judge Enforcer Retry Build); that part stays. The coordinator sets the order; my proposal: 578 last of the present queue, so no approved build is re-cut.
3. After 578 the pack tool (pkgLIB/pack.cjs) and every write script write the engine library only, and the child's __MAPEXTRA422 line is kept equal to the engine's by the same tool. If the two lists differ, the child throws pkgLIB1 (control run, section 7).
4. The engine manual and the comment at the head of the library ("the 22 library nodes") are mine to update on the operator's card once live.

## 6. CRITERIA and DONE (each can pass or fail)
C1. For each of the 13 stubs, the source it rebuilds from the passed engine text equals, byte for byte, the source it rebuilds today from the child node.
C2. Engine: only Alternate Pass Call differs, by the 40 inserted characters; every other node keeps its md5. Child: 13 stubs differ by the one expression; Library Check differs as in 4.C; Shared Library is absent; every other node and every connection is unchanged.
C3. No child node reads `$('Shared Library')`.
C4. Library Check, offline, on the text and shas the engine sends: passes, and its output holds no library text.
C5. Negative controls on Library Check: no text; text cut short; one character changed in LIB; one character changed in MAP; no engine sha; the child's old __MAPEXTRA422 list. Each throws pkgLIB1.
C6. Output test, the method of ASK 571: the 13 stubs are run offline on stored inputs of a run in which the second alternate pass ran, with a real `$`, once as today and once as changed; outputs equal as JSON. Population: named by W4 (which stored run reached the child).
C7. n8n behaviour, on the instance, before the write card: (a) the expression `$('Shared Library').params.jsCode` resolves in the Execute Workflow node although the Shared Library node never runs; (b) the child receives a string of the same length; (c) the child execution's saved size and duration, before and after.
DONE: written by W4 on its own card, read back by a seat other than W4, C1 to C7 shown on the written workflows' fetch-backs, and one live run in which the second alternate pass runs with no pkgLIB or pkgLIB1 error and stores its rows.

## 7. WRONG-IF, and what is measured now
This plan aims at the wrong thing if the call cannot carry the text safely on this instance (C7 fails), or if the child pass becomes measurably slower or its saved executions become a storage problem.
Measured, prototype t578.js, 21 checks, ALL PASS on both bases (t578_after571.out, t578_live.out):
1. Size saved: child nodes as JSON 1,311,727 to 113,697, saved 1,198,030 (571 target); 1,302,659 to 113,697, saved 1,188,962 (live). The API holds the workflow twice (nodes and activeVersion), and each new child version stored repeats it. Engine grows by 40 characters.
2. Payload: the text passed is 1,154,736 characters (1,157,592 bytes UTF-8) on the 571 target. One call per run in which the second alternate pass is needed; none otherwise.
3. C1 to C5 as stated: run, all pass. Known-good and six known-bad cases run.
NOT measured (I have no way to measure them offline; they are C7):
4. Run-time cost. Today each of the 13 stubs parses the text from the child node; after, it parses the same text from the call. One parse of the library took 2.4 to 2.5 ms in my container. I expect no difference; this is a guess until C7(c).
5. Saved data. The trigger's output in each saved child execution grows by about 1.15 MB. Library Check strips the text from its own output, and the two nodes after it do not copy `pass`, so I expect the text to be saved once per child execution. A guess until C7(c).
6. Whether n8n hands a code node the trigger's data more slowly than a node's parameters. Unknown.

## 8. What it costs and what it risks (stated, not argued)
1. The child can no longer be run by itself: without the engine's call it has no library and throws at Library Check.
2. A new dependency on n8n behaviour (C7 a and b). FALLBACK if C7(a) fails: the engine's Library Sha node, which already reads the text, adds it to its item as `__libtext422`; Alternate Pass Call sends `lib: $json.__libtext422` and leaves it out of `sa`. Cost of the fallback: about 1.15 MB more saved in each engine execution that reaches the second alternate pass, and a second engine node changed.
3. The child's __MAPEXTRA422 line must equal the engine's. A difference stops the run at the child's first node (fails closed, with the pkgLIB1 text).
4. 15 child nodes and 1 engine node change in one ASK, in the path of the second alternate pass only.

## 9. RUN EVIDENCE
A live run that reaches the second alternate pass: child Library Check output shows same: true; the 13 nodes execute; no "pkgLIB" text in debate_errors. Registry case: named by W4 at the build (ASK 417 registry). A run that does not reach the second alternate pass does not validate this ASK.

## 10. INPUTS IN GIT
fairjudge/w3/a578/: ASK578_plan.md (this file), t578.js (prototype: targets, checks, controls), t578_after571.out, t578_live.out. Commit named in the Wall post.

## 11. STEPS
1. W4 checks the ASK 577 survey. 2. W1 grades this plan. 3. W4 runs C7 on the instance and names the C6 population. 4. W4 builds on a fresh fetch after the queue ahead of it is written, runs C1 to C7, posts the build. 5. A non-builder grades the build. 6. The operator's approval card carries section 4 in plain words, the size saved and the costs of section 8. 7. W4 writes on its own card. 8. Readback; engine manual entry (mine, on the operator's card).

## 12. Rollback
Restore the child (all nodes, the Shared Library node included) and the engine's Alternate Pass Call from the pre-write exports; compare md5 per node; the engine Library Sha output fed to the child Library Check gives same: true. The child's pre-write library must equal the engine's library at the time of the rollback; if a library write has been made in between, the child's Shared Library is taken from the engine's current text (LIB and the child's MAP keys) before it is restored, or the rollback itself would produce the drift it guards against.
