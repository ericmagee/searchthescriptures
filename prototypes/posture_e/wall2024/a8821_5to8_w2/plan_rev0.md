# Lab items 5 to 8 of Wall 8821: plan rev 0 (W2; Wall 9194 assignment; ASK number to be assigned by the coordinator)

Artifacts read 05:46Z 11-19: live engine 7cd61791 (425 nodes, 183 Code nodes), child e9a13846 (162 nodes, 63 Code nodes),
acorn comment count per Code node (scratchpad cmt5.cjs, copied here as cmt5.cjs); pkgLIB/pack.cjs, pkgLIB/e4_rebase.cjs;
operational_doc v127, the_wall_manual v18, engine_manual v199 (id 203) searched for the tools and rules; git tools/.

## 1. OBJECTIVE
Each of items 5 to 8 is in force at its artifact, not only in a Wall post: no code comment in any engine or child Code node
and none written back by the stub packer; the stacked-write rule, the run-start check and the shared check tools are in the
operating documents every seat reads, and the tools sit in one folder with one index.
Expected effect: a repack cannot restore comments; no run starts without runstart.py printing GO; no seat has to find a tool
through Wall history.

GAPS FOUND (why the items are not done):
- Item 5: Alternate Build (7 comments) and Early Alternate Build (6) still carry comments (ASK 428 left them out of scope).
  pkgLIB/pack.cjs still writes STUBHEAD3, the REFLINE comment and the run-line comment into every form 3 stub, so the next
  repack writes the comments back into 44 stubs (ASK 428 plan rev 4, 3(b), says so).
- Item 6: "one card and one write per workflow for a stacked package, one revert file per package" is in no operating
  document: operational_doc v127 and the_wall_manual v18 have 0 hits for it. It exists only as ASK 412 on the Wall.
- Item 7: runstart.py (ASK 419) is in a419_w4/ only. No operating document requires it before a run (op doc 0 hits,
  Wall manual 0 hits; engine manual v199 names it only for the map_sha check). It has never been run before a live run.
- Item 8: rbx.cjs is in tools/; mrb.cjs is in a420b_w1/; runstart.py in a419_w4/; the ASK 417 exercise tool in a417_w2/.
  No index. engine_manual_apply is live and named in the engine manual only; op doc and Wall manual name none of these tools.

## 2. ROLES
Planner: W2. Builders: W2 (A1 pack.cjs, D tools folder, git only); W4 (A2 live write of the two Alternate Builds);
W3 (B, C, D op doc text, as manual writer). Graders: W1 and W4 for W2's and W3's parts; W1 and W3 for W4's part.
Cards: A2 in W4's thread; the op doc text in W3's thread. Parts A1 and D write only git.

## 3. SCOPE with SEARCH
A1. pkgLIB/pack.cjs: STUBHEAD3 emits nothing; REFLINE keeps `if(false){$(...);}` and drops its trailing comment;
    STUBRUN3 drops the comment after the run line. Form 2 (STUBHEAD) is not in use live (search: 0 live stubs hold
    "pkgLIB stub:" without ", form 3") and is left as it is.
A2. Alternate Build and Early Alternate Build: their 7 and 6 comments removed, code tokens unchanged; pkgLIB/e4_rebase.cjs
    head writer checked for comment emission and changed the same way if it emits any.
B.  Op doc s29, one sentence: packages graded as a stack go live on one card and one write per workflow; the builder keeps
    one revert file per package.
C.  Op doc s30, one sentence: a run starts only after tools/runstart.py prints GO for the released versions and body; the
    run-start post quotes the GO output and the body sha.
D.  tools/ gets mrb.cjs, runstart.py, exercise.cjs with registry.json, and README.md listing every tool, its use and its
    ASK; op doc s29 gets one pointer sentence to tools/README.md and engine_manual_apply.
SEARCH: acorn over every Code node of 7cd61791 and e9a13846: 181 of 183 engine and 63 of 63 child Code nodes hold 0 comments;
the Shared Library holds its 4-line // header and /*LIB*/ /*MAP*/ /*END*/ markers read by every stub and lib_sha, out of scope
(as ASK 428 3(d)). Op doc v127 and Wall manual v18: 0 hits for stack|one card|run-start|runstart|rbx|mrb.cjs|engine_manual_apply.

## 4. CRITERIA and DONE
C1 (A1). pack.cjs on the live library sources rebuilds each of the 44 form 3 stubs byte-equal to the live stub text
     (comments already removed by ASK 428); the old pack.cjs differs on all 44. FAIL on any other difference.
C2 (A2). Each of the two nodes: acorn token stream equal, 0 comments after, literal $() name set equal, unpack/e4 rebuild of
     its head unchanged.
C3 (B, C, D). The op doc preview (operator's write function) shows exactly the added sentences; counts and size stated.
C4 (D). tools/README.md lists every file in tools/ and each runs from tools/ (mrb.cjs on v199, runstart.py --help,
     exercise.cjs on run 39266 equal to its a417_w2 output).
DONE: C1 to C4 pass, A2 written and read back, op doc version written and read back. "Found nothing" is not a pass for C1.

## 5. WRONG-IF
If any reader parses the stub header or run-line comment text, removing it in pack.cjs breaks that reader. Checked by
ASK 428 plan rev 4 item 5 for the live stubs; for pack.cjs I rerun the known-good case (a form 3 stub without the header
rebuilds the same) and the known-bad case (a stub with the run line removed is refused) at step 1, before the build is posted.

## 6. RUN EVIDENCE
A: the ASK 428 registry entry already covers it (no pkgLIB stop). B, C, D: NO PROBE (rules and tools); C is shown by the
next run-start post quoting GO.

## 7. INPUTS IN GIT
This folder (a8821_5to8_w2): plan, cmt5.cjs and its output. Builds add here.

## 8. STEPS
1. W2: WRONG-IF check and A1 build with C1 output; D tools folder with C4 output. (No card.)
2. W4: A2 build with C2 output. (No card.)
3. W3: op doc preview for B, C, D. (No card.)
4. Graders as in ROLES. (No card.)
5. W4 writes A2. Undoable only by W4's revert file. (Waits on the operator's card in W4's thread.)
6. W3 writes the op doc version. (Waits on the operator's card in W3's thread.)
