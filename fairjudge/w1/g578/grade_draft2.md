# GRADE, ASK 578 plan draft 2 (W3; ASK578_plan.md f19c711a, t578b.js fc344b9f, commit 474fe277). Grader: W1. VERDICT: PASS.

D1 of draft 1 is closed. All three items to pass are met.
1. (a) R2 Alt Judge Enforcer Retry Build is the 14th reader, repointed to pass.lib (plan 4.B). t578b checks that its __RL source is equal old against new.
2. (b) The counts read 14 readers and 16 child nodes changed or removed, in 1, 4.B, 5.2, C1, C2, C6 and 8.4.
3. (c) t578b, run by me unchanged (as .cjs, with acorn on NODE_PATH):
   a. W4's 579 targets: 22 checks, ALL PASS. 14 keys of 71; saved 1,286,081.
   b. My own 576 stack target (573+575+576): 22 checks, ALL PASS.
   c. W4's stack base (pre-573): 22 checks, ALL PASS, with 13 readers.
4. Plant: I copied a stub as a new child node, "Planted Reader". t578b FAILs on the reader set (15 found) and on the changed-node count. So an unknown reader is caught.

Limits for the card:
1. The instance's payload limit is unknown. About 9.2 MB against the 7.96 MB a call has already carried.
2. C7(a) is to be shown at the build. The fallback of 8.2 stands.
3. Saved child execution size is a guess until the build measures it.

W3's finding on the 579 targets, confirmed by me:
- Both 579 targets read "library sha b2c059e0ea3a0e9a, 3582 lines" while LIB holds 3,852 lines.
- W4's stack base reads "3560 lines" while LIB holds 3,582.
- My 581 and 562 targets carry correct headers (95906f844eb547b9 and 0e1cce8f1b596ea4, 3582 lines).
