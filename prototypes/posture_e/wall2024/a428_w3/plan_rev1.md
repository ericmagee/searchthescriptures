# ASK 428 plan rev 1 (W3; replaces rev 0, W2 9045 F1-F3): remove code comments from Code nodes and pkgLIB stubs (the stub-form package; carries ASK 422(b))

1. OBJECTIVE. The live engine and child carry no code comments in their Code nodes or library stubs, with the code that runs unchanged token for token. Expected effect: the comment characters of the 87 nodes W1 found in ASK 422(b) (49,936 on 36fcf36b/365d2828) and of the in-scope stubs (counted live at step 1) leave the two workflows; no verdict, count or record changes, because no token and no $() name changes.

2. ROLES. Planner W3. Builder W1. Graders W2 and W4 (neither builds). Write: W4, on the operator's card in W4's thread (one card for both workflows; ASK 412 stacking).

3. SCOPE. (a) The 87 non-stub Code nodes of ASK 422(b), rerun with W1's strip.cjs (commit 4d37db75) on a fresh fetch-back of live engine b780b2ae and child 7b043bab. (b) The form 3 stubs with the standard run line "\nreturn await new Function(" (live: 33 engine and 13 child nodes hold "pkgLIB stub, form 3", W2 9045; minus the two below, 31 and 13; the builder restates the count at step 1 from a live query, text match "pkgLIB stub, form 3" and the run line): the text pack.cjs writes for them, STUBHEAD3 (two comment lines) and the REFLINE comment "/* pkgLIB v2: never runs ... Run 33094. */", as a new stub form (STUBV 4) that keeps the `if(false){$(...)}` line and STUBRUN3 unchanged. (c) Out of scope by name: "Alternate Build" and "Early Alternate Build" (form 3 headers but a different run line, "const __R0=await new Function(" and "let __R0=[];try{__R0=await new Function("; unpack rebuild() refuses both; their tail comments stay, W2 9045 F2); every other node that reads $('Shared Library').params.jsCode but is not a form 3 stub (W1's 422(b) excluded 64 engine and 13 child such readers on 36fcf36b; the builder lists them at step 1); and the Shared Library node: out of scope (its /*LIB*/ /*MAP*/ /*END*/ markers are read by every stub and by ASK 422(a)'s lib_sha; the comments inside library lines are JSON string data that rebuild the node source, and changing them changes MAP n and lib_sha).
SEARCH (the planner's, and what the builder adds before building):
- Done by W1 (ASK 422(b), Wall 8872; README a422b_w1): every Code node searched for .params.jsCode, jsCode, Function(, .toString(), arguments.callee, stack; only the stubs match.
- Done by W3 now: gate/pack.cjs (writes the stub form; refuses a stub that does not rebuild); pkgLIB/unpack.cjs rebuild() runs the stub text up to "\nreturn await new Function(", so comments before it do not change the rebuilt source.
- Owed by the builder at step 1, every hit posted: every reader of stub text in git and live: pkgLIB/pack.cjs, pkgLIB/e4_rebase.cjs ("stubs ok", "rebuild=strip"), gate/replay.cjs, tools/lib.cjs rb(), rbx.cjs, libw.py, libsha.py, a385_w4/reg385.cjs, a422a check nodes, and any regexp on "pkgLIB stub" or "form 3" text, in the engine and the child workflow.

4. CRITERIA and DONE.
- C1. strip.cjs on the fresh fetch-back: STRIP PASS; node counts posted; onlyjs.cjs shows jsCode changed only in the listed nodes.
- C2. Every changed stub and node: token stream equal (with the line-break flag), compiles in an async wrapper, no comment left, line count equal or the difference stated.
- C2b. Every changed stub and node: the set of literal $() names in the whole text (comments included) before equals the set after, or each dropped name is shown to occur in code elsewhere in that node (W2 9045 F3: the task runner sends a node only the nodes its text names in literal $() calls).
- C3. gate/pack.cjs with STUBV 4 packs the live library; every stub rebuilds byte for byte to the same full source as today (rebuild() output sha equal, old stub against new stub, every in-scope stub, count stated).
- C4. ASK 385 check PASS and ASK 422(a) lib_sha unchanged (c91b9f1489e9c132) on the targets.
- C5. The REPLAY GATE (gate/replay.cjs) on stored runs: every stub-rebuilt node EQUAL. A node with no stored run rests on C2 alone and is named.
- C6. Live after the write: rbx fetch-back 0 diffs against the graded targets; W1 and W2 read back.
"Found nothing" is not a pass for C3 or C5: each must show a count above zero.
DONE when C1 to C6 pass and the engine manual carries the entry.

5. WRONG-IF. If any reader found at step 1 parses stub comment text (for example the sha or byte count in the form 2 header, or the "pkgLIB stub" words), the plan aims at the wrong thing and the stub part stops for a re-plan. Checked by the planner on pack.cjs and unpack.cjs: STUBRUN3 reads only $('Shared Library') and __M; no header text is read. Known-good case: a form 3 stub rebuilt with its two header lines removed gives the same rebuild() output. Known-bad case: a stub with its "\nreturn await new Function(" line removed is refused by rebuild ("not a pkgLIB stub"). The builder runs both at step 1.

6. RUN EVIDENCE. ASK 417 registry entry to be added by W1: case = any run after the write; mark = no debate_errors row holding "pkgLIB:" or "pkgLIB1", and the child execution's lib422 names c91b9f1489e9c132 on both sides. A comment strip changes no token, so this is the only run probe.

7. INPUTS IN GIT. This plan at a428_w3/plan_rev1.md (rev 0 kept). The build goes in a428_w1/ (fetch-backs, targets, strip and pack outputs, node lists with every original text).

8. STEPS.
1. W1: the step 1 search, posted with every hit; the two WRONG-IF cases run. (No card.)
2. W1: build on fresh fetch-backs; post C1 to C5 with files. (No card.)
3. W2 and W4 grade. (No card.)
4. W4 posts the write card in W4's thread naming: the node and stub counts from C1 and C3, form 4, no token change. Not undoable except by the revert files W4 keeps. (Waits on the operator's card.)
5. W4 writes; W1 and W2 read back; W3 writes the engine manual entry on the operator's card in W3's thread.
