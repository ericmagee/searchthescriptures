# GRADE, ASK 578 plan draft 1 (W3; fairjudge/w3/a578/ASK578_plan.md md5 e67a9eac), with W4's C7 (Wall 11110, 11113, 11115). Grader: W1. VERDICT: FAIL on one defect (D1).

## Reproduced
1. On live (engine c188b3cf, child b4f662d4), t578 passes all 21 checks. Each of the 13 stubs rebuilds, from the engine library text, the same source of the same n as it does from the child copy.
2. Child readers of `$('Shared Library').params.jsCode` on W4's stack file (base_child_559_549_561.json): 15 nodes. These are the 13 stubs, Library Check (ASK 422a), and the Shared Library node itself, whose own comment contains the string. The plan says 14 readers. The 15th is text in a comment and is harmless.
3. C7, from W4's measurements:
   a. One child call already carried 7,957,565 bytes and succeeded (execution 41835).
   b. 578 adds about 1.15 MB, for about 9.1 MB in total.
   c. The instance's payload limit is not readable from any seat. It goes to the operator on the card, as the coordinator directed.

## D1 (defect): after ASK 573, a 14th stub reads the child Shared Library, and the plan leaves it pointing at a node that 578 removes
1. ASK 573 (approved for build, ahead of 578 in the order) changes the child node R2 Alt Judge Enforcer Retry Build. That node now loads __RL through a loader that ends `})($('Shared Library').params.jsCode);`.
2. Readers measured on each child file (string count by node):
   - stack base: 15;
   - 573 target: 16 (R2 Alt Judge Enforcer Retry Build added);
   - 576 target (573, 575 and 576 stacked): 16.
3. Plan 5.2 says that 573's child stub change "stays". Plan 4.B and C1 to C2 name 13 stubs. Once 578 removes the child Shared Library node, the Retry Build expression has no node to read, and the retry pass throws.
4. t578 run on the 573 stack fails its stub count (14 found against 13 expected) and then crashes.
5. To pass:
   a. Add R2 Alt Judge Enforcer Retry Build as the 14th stub, repointed to `$('Alternate Pass In').first().json.pass.lib`. Check that its __RL key rebuilds the same text and the same n from the engine library.
   b. Correct the counts in 4.B, 5.2 and C1 to C2.
   c. Re-cut t578 on the stack that 578 will actually be built on (after 573, 575, 576 and 579), and show it passing.

## Notes, to state on the card (not defects)
1. C7(a) asks whether the engine expression resolves in Alternate Pass Call when the Shared Library node never runs. It is not yet shown on the instance. The plan's fallback (`__libtext422` from Library Sha) stands, and it must be shown at build, as DONE requires.
2. The saved size of each child execution grows by about 1.15 MB (plan 8.5). This is a guess until the build measures it.

Files: fairjudge/w1/g578/grade.md, t.cjs, stubs.cjs, list.cjs.

## Run record (t578.js unchanged, run as .cjs because the repo package is an ES module)
- On W4's stack base (559, 549, 561 and 569): ALL PASS, 21 checks.
- On the 573 target, three checks FAIL and then the test throws:
  - "child stubs that read the library: 14 (expected 13)";
  - "each stub asks for one key, 13 different keys";
  - "for all 13 keys the engine library rebuilds the same text".
