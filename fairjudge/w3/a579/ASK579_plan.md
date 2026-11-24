# ASK 579: the nine B-Extract and G-Extract layer blocks are served from the Shared Library (W3, PLAN DRAFT 1)

DRAFT ONLY. Nothing is written. Assigned by the coordinator at 18:25 CST 11-23: the __A423 and __O423 groups of W1's ASK 572 survey (group 2), measured net of the child, reuse-first, on the live base after ASK 571. The plan needs a grade (W1), the builder's check (W4) and the operator's approval. It takes over the three __O423 texts of ASK 574 (withdrawn) and applies W1's defect D1 of that grade from the start.

## 1. OBJECTIVE
Nine engine nodes each hold one large block that reads a debater's re-call reply: the `__O423` statement in C2B, D3B and C3B Extract, and the call inside `try{__X2=(()=>{...})()[0].json;}` in C4G, C3G, C1B, D2B, D4B and C4B Extract. The nine texts share most of their lines with one another. Store each line once in the Shared Library and let each node rebuild its own text, byte for byte.
Expected effect: less stored code and one place to edit a line the nine nodes share. No behaviour changes: no prompt text, no reasoning setting, no check and no output changes. It is not a command from the operator; it answers his standing request for efficiency findings, and it goes to him for approval.

## 2. ROLES
Planner: W3. Builder and writer: W4 (alone writes n8n; W4's own write card). Grader: W1. Nothing is written by this plan.

## 3. SCOPE, with the SEARCH that set it
Scope in one line: one statement in each of nine engine nodes; the Shared Library of the engine AND of the child (the same lines appended to both, the same nine MAP entries in both, the sha header of both). No other child node. __MAPEXTRA422, Library Sha and both Library Check nodes are not touched.
SEARCH (live engine ee70cf05 and child 5406c38f, W4's fetch-backs ask570/w4/write/fetchback_engine.json e813c638 and fetchback_child.json f86b2c88, readback MATCH by W1 at Wall 11092):
1. Engine nodes with a top-level `const __O423=` statement (parser): 3, the three named. Engine nodes with a top-level `try{__X2=(()=>{` block: 6, the six named. The three __O423 texts hold the same try shape nested inside them; it is served inside them. The child holds neither shape outside its library.
2. MEASURED sizes of the nine served texts: O423 C2B 24,112; D3B 25,369; C3B 28,228; X2 C4G 24,428; C3G 16,396; C1B 12,610; D2B 12,859; D4B 22,457; C4B 24,428. Total 190,887 characters, 9 different texts (C4G and C4B have the same length but differ). 307 different lines in all.
3. The survey's 295k was measured before ASK 571 took the L2C sheet out of these blocks. The nine nodes hold 246,912 characters today.
4. Each of the six try blocks has exactly the shape `try{__X2=<call>[0].json;}catch(x){return __keep('the re-call reply was not read: ...');}`; the served text is `<call>`, the text `(()=>{...})()`.
5. Free names of each served text (acorn and eslint-scope): `$` and `$input` only. No this, await, yield or arguments (parser). No `$()` call with anything but a literal node name.
6. NOT TAKEN: the four statements __LB423, __CC423, __LC423 and __A423 (2,851 characters, one text in three nodes). Serving them would save 709 characters with the child copy (3,716 without) and add a loader to three nodes. Not worth a throw path.
Not searched: workflows other than the engine and the child; the builder repeats search 1 on a fresh fetch.

## 4. The change
1. Shared Library, engine and child, the same text in both: a line that already stands in the library is served from where it stands (37 lines today, 4,623 characters); the lines the library lacks are appended after the last existing line (270 lines, 64,933 characters). No existing line is moved or changed.
2. Nine MAP entries in both MAPs, "O423 <node>" (3) and "X2 <node>" (6), each `{n: <length>, p: [...]}`. The child has no node that asks for them; they stand there so that the two libraries stay identical (the method of ASK 571, 573, 575). The sha header is reset in both.
3. In C2B, D3B and C3B Extract the `__O423` statement is replaced by a loader of the pkgREFP shape: it throws "pkgX579: ..." if the entry is missing or the rebuilt length differs from n, and passes `$` and `$input`: `const __O423=(T=>{...return new Function('$','$input',S+'\nreturn __O423;')($,$input);})($('Shared Library').params.jsCode);`
4. In the six try nodes, a loader statement is placed directly BEFORE the try, and the call inside the try becomes `__F579($,$input)`:
`const __F579=(T=>{...return new Function('$','$input','return '+S+';');})($('Shared Library').params.jsCode);`
`try{__X2=__F579($,$input)[0].json;}catch(x){return __keep(...unchanged...);}`
WHY BEFORE THE TRY: the catch of these nodes turns any error into "the re-call reply was not read" and keeps the first reply. A loader placed inside the try would hide a library fault as a kept first reply. Placed before it, a library fault throws and stops the node; an error in reading the reply is caught exactly as today.
5. Each loader is preceded by one `if(false){$('<node>');...}` line naming every node the served text reads through `$()` (6 to 11 names per node, listed in t579.out), as the library stubs and ASK 571 do, so the node text still names them. The builder confirms the form against the pack tool.
6. Nine stored texts served as nine texts. No text is merged with another; that would change code paths and is outside this ASK.
The full loader text is in t579.js (functions `core`, `stub`, `stubX`, `pre`).

## 5. Order and dependencies
1. After ASK 559 (it rewrites BAR, which stands nested in the three __O423 texts), or 559 is cut onto 579. One or the other.
2. ASK 576 (top-level IMP in C1B, D2B, D4B, C4B Extract) and ASK 561 (C1B Extract, outside its try block) change other statements of the same nodes. They do not conflict in text; whichever is written later is re-cut on the earlier fetch-back.
3. The library lines changed by the writes in the queue (547+548+552: 1286, 2674, 3035, 3088, 3090, 3096, 3119; 561: 3552; 570: 3406, live) are none of the 37 lines reused here.
4. ASK 578 (last in the queue) decides the final figure, not the order: if 579 is written first, its lines stand in the child copy until 578 removes that copy.
5. Any later ASK that edits a line inside these blocks edits the library line and the n values of every entry it serves, not the node.

## 6. CRITERIA and DONE (each can pass or fail)
C1. For each of the nine nodes, the text rebuilt from the packed library (engine and child) equals the node's pre-write text byte for byte, and its length equals n.
C2. In each node every character before the changed statement and after the served text is unchanged; every other engine node keeps its md5; in the child only the Shared Library changes.
C3. Existing library lines unchanged, in place, in both; LIB equal in engine and child; every existing MAP entry rebuilds the same text.
C4. Free names of each served text: `$` and `$input` only (parser).
C5. Negative controls, per node: one served line changed, the loader throws on the length check; the MAP key removed, the loader throws on the missing entry. For the pair: lines appended to the engine only fail the pair check.
C6. Output test, the method of ASK 571: each of the nine nodes is run offline on the stored inputs of run 41822 with a real `$` and `$input`, once with the pre-write code and once with the loader and the packed library; outputs equal as JSON. For the six try nodes the population must include an execution in which the re-call ran (resend true) and one in which it did not. If run 41822 holds no resend for a node, W4 names another stored run or says the record holds none.
C7. The engine's Library Sha output fed to the child's Library Check gives same: true; Library Check passes in the engine; the run-start check prints GO.
C8. The build post lists every reused library line number and every other MAP entry that serves any of them (today: 37 lines, 47 entries; both lists are in t579.out), and the pack tool's map_touched output.
DONE: written by W4 on its own card, read back by a seat other than W4, C1 to C8 shown on the written fetch-backs, and one live run in which the nine nodes execute with no pkgX579 error and store their rounds.

## 7. WRONG-IF, and what is measured
This plan aims at the wrong thing if, on the base it is finally cut on, the net stored saving is too small to pay for nine new throw paths. I propose the line at 20,000 characters net in the state the team expects to keep (with or without the child copy).
MEASURED on the live base, prototype t579.js, 99 checks, ALL PASS (t579.out):
1. The nine nodes go from 246,912 to 63,109 characters (saved 183,803). Each Shared Library grows by 69,878.
2. NET stored saving with the child copy: 44,047. NET for the engine alone, which is the state once ASK 578 removes the child copy: 113,925.
3. For comparison, the three __O423 texts alone (ASK 574) gave 4,055 with the child copy. The nine together give more because the try blocks and the __O423 texts share lines: each appended line is paid for once and serves several texts.
4. Known-good: the pair check on the live pair gives lib de221df74811d115, map 0994aa5fe546d9fc, the values W4 and W1 report for the live pair. On the packed pair it passes (lib e9d1bdab7afbc487, map 0ffa525b5f120814). Known-bad cases run: 18 loader controls and the engine-only append.
NOT RUN: C6 (I hold no stored node inputs and do not read executions), C7 on the instance. Both are the builder's.

## 8. What it costs and what it risks (stated, not argued)
1. A new failure mode in nine round-keeping nodes: if the library and a MAP entry disagree, the node throws and the run stops at that round. Guards: Library Check at run start, the sha header, the length check, the pair check.
2. One more parse of the library text (about 1.15 MB; 2.4 to 2.5 ms in my container) per execution of each of the nine nodes. Not measured on the instance.
3. Reading the code: the nine nodes show a loader instead of their logic.
4. Reuse couples these texts to 47 other library entries through 37 shared lines. An edit of equal length to a shared line passes the length check silently. Guard: C8 and the pack tool rebuilding every n at each library write.
5. With the child copy still in place, each appended character is stored twice (the reason the net is 44,047 and not 113,925).

## 9. RUN EVIDENCE
A live run with the Oracle defending in which the nine nodes execute and the stored rounds are present; no "pkgX579" text in debate_errors. Registry case: named by W4 at the build (ASK 417 registry).

## 10. INPUTS IN GIT
fairjudge/w3/a579/: ASK579_plan.md (this file), t579.js (prototype), t579.out. Commit named in the Wall post.

## 11. STEPS
1. W1 grades this plan. 2. The writes ahead of it are made (their own cards). 3. W4 builds 579 on a fresh fetch, runs C1 to C8, posts the build. 4. A non-builder grades the build. 5. The operator's approval card carries section 4 in plain words and the two figures of section 7. 6. W4 writes on its own card. 7. Readback; engine manual entry (mine, on the operator's card).

## 12. Revert
Restore the nine nodes and both Shared Libraries from the pre-write exports; compare md5 per node; the pair check passes.
