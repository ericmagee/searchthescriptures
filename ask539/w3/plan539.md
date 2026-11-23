# ASK 539 PLAN rev 1 (W3, seat 33): stop the false "library drift" in the child's Library Check

Authority: the coordinator's task at 16:24 Z, 11-23, from W4's live defect report at Wall 10687 (a mistake in the ASK 526 write). This is a repair of a live defect. It must be live before the proof run. This plan authorizes nothing.

## 1. OBJECTIVE
The next run that seats an alternate must not stop with "pkgLIB1: library drift" when the engine's and the child's Libraries agree. Expected effect: the engine's map sha leaves out its two engine-only MAP keys, "REFP" and "Alternate Merge CPD", and so equals the child's map sha again.

## 2. ROLES
- Plan: W3.
- Grade (one grader): W2.
- Build: W4, after ASK 530.
- Write: W4, on the operator's card in W4's thread.
- Readback: one non-builder seat, named by the coordinator.

## 3. SCOPE
SEARCH:
- Engine moMxiV4Irg1uRBZN, version 04450043 (n8n fetch, 11-23, after the 537 write), every node, for "MAPEXTRA422" and "library drift". 1 node matched: Library Sha (ASK 422a).
- Child MqQHRl7mQQ0z8QdT, version 334f0518 (n8n fetch, 11-23), every node, for the same strings. 1 node matched: Library Check (ASK 422a).
- Both nodes read in full. Both Shared Library MAP blocks (between "/*MAP*/" and "/*END*/") parsed and compared key by key.
- Wall 10686 and 10687.
NOT SEARCHED: other workflows (SX4Z and the rest), which W4 checks at build for a Library Check copy.
WHAT RAN:
1. Engine, Library Sha: `const __MAPEXTRA422=["REFP"];`. `__MAPSHA422(__lc,'engine')` returns null unless every listed key is present, drops those keys, and hashes the rest. The result goes to the child as `map_sha`.
2. Child, Library Check: it computes its own `__MAPSHA422(__lc,'child')`. The child side filters nothing, so the child's own `__MAPEXTRA422` is never used. It throws "pkgLIB1: library drift ..." when the lib shas or the map shas differ.
3. MAP keys measured: the engine has 49 and the child 47. Engine-only keys: "Alternate Merge CPD" and "REFP". Child-only keys: none. No shared key differs in value. With both engine-only keys dropped, the engine's sorted [key, value] list equals the child's exactly. So the engine-side fix gives equal map shas, and the child node needs no change.
4. W4 10687 measured the live pair 04450043 with 334f0518 with the child's own hash code: lib cf88f4765f035f23 on both; map 582a5bbc40b085c4 (engine) against 93f6ae03d05181d8 (child): THROWS. The last child execution, 41440 at 03:16 CST, was before the 526 write, so no run is affected yet.
IN SCOPE (node): engine Library Sha (ASK 422a) only.
FOUND, NOT IN SCOPE:
- W4 10687 item 5 proposes the same edit in the child's Library Check too. The child's copy of `__MAPEXTRA422` is read only on the engine side, so changing it has no effect. Under the scope rule it is left as it is.
- Any future engine-only MAP key causes the same throw. W2 10672 already notes this for ASK 530. A standing check that lists the engine-only keys is a possible later ASK; it is not built here.

## 4. CHANGES
1. Engine Library Sha (ASK 422a): `const __MAPEXTRA422=["REFP"];` becomes `const __MAPEXTRA422=["REFP","Alternate Merge CPD"];`. That adds 22 characters. Nothing else changes.

## 5. CRITERIA and DONE
1. Only the engine's Library Sha node changes, and only by the change in section 4. Every other node of the engine, and every node of the child, is byte-equal to live.
2. With the child's own hash code (W4's mapcheck530.js) on the target engine and the live child: lib shas equal, map shas equal, no throw.
3. The control on the live pair (04450043 with 334f0518) still throws, which shows the check is the one that fires today.
4. A second control: a target engine whose MAP lacks "Alternate Merge CPD" gives map sha null on the engine side (the every-key guard), so the check throws. This is the existing guard, unchanged.
5. Label: ASK 539.
DONE: criteria 1 to 5 on the build; the write's fetch-back matches the target; the readback seat confirms.

## 6. WRONG-IF
1. The plan is wrong if, after the fix, the map shas still differ. That would mean some value differs, against WHAT RAN item 3.
2. The plan is wrong if the fix hides real drift: a change to a shared MAP key, or to any Library line, must still throw. The build tests one synthetic shared-key change and one Library line change, and both must throw.
3. The plan is wrong if ASK 530's write (both Libraries) and this fix interact. 530 adds no MAP key (W4 10687 item 6). The build after 530 re-runs criterion 2 on the post-530 pair.

## 7. RUN EVIDENCE
- No run has failed yet. The defect is shown by W4's measurement (10687 item 3) and by the code in section 3.
- Mark in the next run that seats an alternate: the child's output carries `lib422` with `same:true`, and no "pkgLIB1: library drift" error.

## 8. INPUTS IN GIT
- ask539/w3/live/engine_Library_Sha_ASK_422a.js (69d09056) and child_Library_Check_ASK_422a.js (a7a41edb): the two nodes as read from 04450043 and 334f0518.
- ask530/w4/build/mapcheck530.js: W4's check (W4 commits it with the build).

## 9. STEPS
1. W2 grades rev 1.
2. W4 builds after ASK 530, against a fresh live readback, and posts criteria 1 to 4 and WRONG-IF 2 and 3.
3. W2 grades the build.
4. The coordinator sends the operator one card, before the proof run.
5. W4 writes; a non-builder seat reads it back.
