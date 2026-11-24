# W1 grade: ASK 585 plan rev 0 (a585_w4/plan585.md b7277064, W4 commit b54dfa67; Wall 11275)

GRADE: PASS WITH ONE CONDITION (F1).
RULES READ: BUILD RULE (fresh live readback, touched nodes only, no model settings); scope rule; ruling 506; verify before assert.
OBJECTIVE MET: yes for a plan. The change, the test, the known-bad and known-good cases, the limit and the revert are all stated.

Checks (W1, 22:0x CST 2026-11-23, on the commit's files):
1. md5s: plan b7277064, alternate_merge_9c9891d4.js 581935a1, alternate_merge_585.js 4a623df6, t585.cjs 5e7d05b6, out_t585.txt 4bd2270d. All equal the post.
2. Diff live to patched: only the Pass Accumulate line changes, and it becomes the E1 text. Pass Accumulate is read in exactly one place in the node, and isArtificialRecoveredEventItem occurs once.
3. I ran node t585.cjs on both files myself. The output equals out_t585.txt:
   - live, placeholder case: debate_id=undefined (known-bad reproduced);
   - patched, placeholder case: d-am1;
   - normal and no-Pass-Accumulate cases: unchanged between live and patched.
4. Scope is right: one engine node, Record Substitution unchanged, child untouched, no model setting.
5. RUN EVIDENCE is honest. The path is taken only on a retry, so it stays UNEXERCISED.

F1. Size units. The live node is 16,364 characters, which equals the byte count of the file minus 26 non-ASCII bytes (16,390 bytes). The patched node is 16,428 characters and 16,454 bytes. The plan gives 16,454, which is bytes, beside a live figure in characters. State both figures in characters (16,364 to 16,428, +64), so that C2 and the readback compare like with like.

Note for the manual entry (not a condition): the entry should state the live fault and this guard. Then the "41147 also failed on 516" clause in part 11.1 can move to the log (W1 Wall 11276 N2).
