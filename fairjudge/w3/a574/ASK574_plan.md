# ASK 574: the three B-Extract layer blocks are stored once in the Shared Library (W3, PLAN DRAFT 1)

DRAFT ONLY. Nothing is written. The plan needs grading (W1), the builder's check (W4) and the operator's approval. Assigned by the coordinator at 18:07 CST 11-23, from W1's survey (ASK 572, Wall 11064, group 2).

## 1. OBJECTIVE
The block `const __O423=(()=>{...})();` stands in three engine nodes (C2B Extract, D3B Extract, C3B Extract) as three texts that share most of their lines. Store each shared line once in the Shared Library and let each node rebuild its own text from it, byte for byte.
Expected effect: less stored code, and one place to edit a line the three nodes share. No behaviour changes: no prompt text, no reasoning setting, no check and no output changes. It is not a command from the operator; it answers his standing request for efficiency findings, and it goes to him for approval.

## 2. ROLES
Planner: W3. Builder and writer: W4 (alone writes n8n; W4's own write card). Grader: W1. Nothing is written by this plan.

## 3. SCOPE, with the SEARCH that set it
Scope in one line: the `__O423` statement of C2B Extract, D3B Extract and C3B Extract, and the Shared Library of the engine (new lines appended at the end; three new MAP entries; the sha header; the engine's __MAPEXTRA422 list for the three engine-only keys).
SEARCH (live engine after ASK 563, version d8292f62, W4's fetch-back ask563/w4/write/fetchback_engine_563.json; child de9efc4e, fetch-back ask566/w4/write/fetchback_child_566.json):
1. "O423" in every node of the engine: 3 nodes, the three named. In the child: 0 nodes. The child is not touched.
2. Each node holds exactly one top-level `__O423` statement and one use, in its last line: `return __A423(__O423,{side:...,stop:...});`. The four statements before it (__LB423, __CC423, __LC423, __A423) and the return line are not touched.
3. The three texts, MEASURED: C2B Extract 47,031 characters (md5 e4ba58a5); D3B Extract 48,288 (e663cf6e); C3B Extract 51,147 (00253b54). Total 146,466. Lines: 288, 299, 319; 272 lines (41,343 characters) stand in all three; 332 different lines in all (61,024 characters).
4. Free names of each text (acorn and eslint-scope): `$` and `$input` only, besides built-ins. No await, this, arguments or yield outside strings (rough scan; the builder confirms with the parser).
5. Inside each text, by statement: IMP (6,208, identical in the three), BAR (1,906, identical), the LAY loader (546, identical), __RD (3 texts), the round's own reads (__X1, __G, __rec, 3 texts each), one large try block (35,728; 36,868; 39,431) and the keep-or-replace tail.
6. FINDING that changes the survey figure: the large try block holds the whole L2C sheet statement (23,652 characters, md5 b299e365, identical in the three). That statement belongs to ASK 571 (W4), which replaces it with a loader in each node. The survey's saving of 95,319 counts two copies of L2C (47,304).
Not searched: no workflow other than the engine and the child holds debate nodes that I know of; the builder repeats search 1 on a fresh fetch.

## 4. The change
1. Shared Library (engine): every different line of the three texts is appended after the last existing line. No existing line is moved, changed or reused (gate entries address existing lines by index; and a line shared with another package could be edited by that package later).
2. Three MAP entries, "O423 C2B Extract", "O423 D3B Extract", "O423 C3B Extract", each `{n: <length>, p: [...]}` over the appended lines. The three keys are added to the engine's __MAPEXTRA422 (the ASK 539 lesson). The library sha header is reset.
3. In each of the three nodes the `__O423` statement is replaced by one loader line in the pkgREFP shape. It throws if the entry is missing or the rebuilt length differs from n, and it passes `$` and `$input`:
`const __O423=(T=>{...const M=...["O423 <node>"];if(!M)throw new Error('pkgO423: the Shared Library holds no O423 <node> entry');const S=...;if(S.length!==M.n)throw new Error('pkgO423: rebuilt O423 <node> is '+S.length+', expected '+M.n);return new Function('$','$input',S+'\nreturn __O423;')($,$input);})($('Shared Library').params.jsCode);`
The full line is in t574.js (function `stub`).
4. One stored copy served as three texts. The three texts are not merged into one function with options; that would change code paths and is outside this ASK.

## 5. Order and dependencies
1. After ASK 571 (L2C). 571 changes the same three nodes inside the `__O423` statement. 574 is cut on 571's written engine, so the served texts then hold 571's L2C loader line instead of the sheet.
2. After ASK 559 (approved; by W1's survey it rewrites BAR in 14 nodes; each of these three holds a BAR statement inside `__O423`, search item 5; whether 559 names these three is the builder's to confirm), or 559 is cut onto 574. One or the other; never both on the same base.
3. Any later ASK that edits a line inside `__O423` (IMP, BAR, the LAY loader, the extract body) then edits the library line and the three n values, not the node.

## 6. CRITERIA and DONE (each can pass or fail; "found nothing" is not a result here)
C1. For each of the three nodes, the text rebuilt from the packed library equals the node's pre-write `__O423` statement byte for byte, and its length equals n.
C2. In each node every character outside the `__O423` statement is unchanged; every other node of the engine keeps its md5; the child is unchanged.
C3. The first existing library lines (count read at the build) are unchanged, in place; the new lines are only appended.
C4. The free names of each served text are `$` and `$input` only (parser, not the rough scan).
C5. Negative controls: with one served line changed, the loader throws on the length check; with the MAP key removed, the loader throws on the missing entry; with `$input` not passed, the output test of C6 fails.
C6. Output test, the method of ASK 571: each node is run offline on the stored inputs of run 41822 with a real `$` and `$input`, once with the pre-write code and once with the loader and the packed library; the two outputs are equal as JSON, for all three nodes. Population: the three node executions of run 41822 (and of run 41736 if its inputs are held).
C7. Library Check passes in the engine with the three keys in __MAPEXTRA422; the run-start check prints GO.
DONE: written by W4 on its own card, read back by a seat other than W4, C1 to C7 shown on the written engine's fetch-back, and one live run in which the three nodes execute with no pkgO423 error and store their rounds.

## 7. WRONG-IF
This plan aims at the wrong thing if, after ASK 571 is written, the net stored saving is too small to be worth a new throw path in three round-keeping nodes. Measurement, taken now as far as it can be:
1. On the live engine today (before 571), prototype t574.js: the three nodes go from 155,221 to 10,585 characters; the Shared Library grows by 63,914; net stored saving 80,722. ALL PASS (22 checks).
2. With the L2C statement taken out of each text (the state after 571, estimated by cutting the statement; 571's loader line is not yet written): the three texts are 23,386, 24,643 and 27,502 (75,531); their different lines hold 37,756; the saving is about 37,775 before JSON escaping and the three loader lines. Estimate, not a measurement of the final state.
3. Known-good case run: the three live texts rebuild equal. Known-bad case run: a changed line fails the length check (C5, first control).
The team and the operator should weigh figure 2, not the survey's 95,319. For scale: the engine's code nodes other than the library hold 2,291,899 characters (W4, Wall 11056 item 6).

## 8. What it costs and what it risks (stated, not argued)
1. A new failure mode: if the library and a MAP entry ever disagree, the node throws and the run stops at that round. Today the code is inline and cannot disagree with itself. Guards: Library Check at run start, the sha header, the length check, criterion C7.
2. Each of these nodes already parses the whole library text once per loader it holds (LAY and REFP today; L2C after 571). This adds one more parse of about 1.15 MB per node execution, three per run. Not measured; the builder times it in C6.
3. Reading the code: the three nodes will show a loader line instead of their logic; the logic is read in the library lines. Same trade as pkgLIB.

## 9. RUN EVIDENCE
A live run with the Oracle defending: C2B Extract, D3B Extract and C3B Extract execute and the stored rounds are present; no "pkgO423" text in debate_errors. Registry case: to be named by W4 at the build (ASK 417 registry).

## 10. INPUTS IN GIT
fairjudge/w3/a574/: ASK574_plan.md (this file), t574.js (prototype: pack, loader, rebuild, controls), t574.out (its output on the live engine). Commit named in the Wall post.

## 11. STEPS
1. W1 grades this plan. 2. ASK 571 and ASK 559 are written first (their own cards). 3. W4 builds 574 on that engine with a fresh fetch, runs C1 to C7, posts the build. 4. A non-builder grades the build. 5. The operator's approval card carries the plain-words text of section 4 and the two saving figures. 6. W4 writes on its own card (cannot be undone except by the revert). 7. Readback; engine manual entry (mine, on the operator's card).

## 12. Revert
Restore the three nodes and the engine's Shared Library from the pre-write export; compare md5 per node; Library Check passes.
