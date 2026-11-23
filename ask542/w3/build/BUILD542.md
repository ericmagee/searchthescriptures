# ASK 542 BUILD (W3, seat 33; builder by the coordinator's assignment at 11:06 CST 11-23). NOT WRITTEN. W4 alone writes to n8n.
Plan: ask542/w1/plan542.md rev 0 (4bb44786), PASS by W2 at Wall 10763. Grader of this build: W1 (coordinator).

## BASE (live, read 11:1x CST 11-23)
- n8n search_workflows (read): the engine was last updated 2026-11-23T16:41:56.995Z, and the child 16:42:03.017Z. These are the ASK 530 write. No write since.
- The fetch-backs of that write carry the same updatedAt: engine daf5da98 (file md5 3a001d95), child 10624dd2 (cf85b641). Both are copied here as live542_engine.json and live542_child.json. Library sha 5aedc2f2ac70ba66.
- I did not do a direct REST GET of the workflows. My attempt was denied, and I did not retry it.

## CHANGE (patch542.js, md5 8d8262df)
- Shared Library array index 479 (the plan's "line 480"), in both copies. Old md5 9b0d81f8, new 0e1691be.
  - Call: `.some(p=>unxAcFail(text,p.ref,rk))` becomes `.some(p=>unxAcFail(text,p.ref,rk)||unxAcFail(text,p.ref,rk.slice(0,2)+'[2-4]'))`.
  - Comment: `... no K-UNX item */` becomes `... no K-UNX item. ASK 542: or any of the side's round 2 to 4 tags */`.
- The patch refuses to run unless each anchor occurs once, and unless the call occurs once in the whole Library.
- MAP n is re-measured in the 15 entries that cover index 479 (+94 characters each). The header library sha changes from 5aedc2f2ac70ba66 to 1ab5d9d38feb7aa4.
- Targets: target_engine_542.json (59655f97) and target_child_542.json (ed355a3d).

## CHECKS
1. Only Shared Library differs in each workflow. Node set, connections and settings are equal. Only LIB index 479 differs, and the line count is unchanged (3,566).
2. runcheck: both targets OK, 1ab5d9d38feb7aa4 (out_runcheck542.txt).
3. ASK 539 pair check: engine and child lib 1ab5d9d38feb7aa4, map 11813a151ba0e052, Library Check PASSES (out_pair542.txt). The map sha is unchanged from live.
4. With ASK 536: patch536 then patch542 gives the same Library as patch542 then patch536 (byte-equal). Either write order works.
5. Unit and known-bad test (kb542.js, out_kb542.txt). It uses the real UNX_MW, unxPresses and unxAcFail and the condition cut verbatim from index 479, on live and target.
   - Inputs: the 41418 rounds (rounds516_41418.txt, md5 3509d6d3, the run's own rounds) and sol's ANSWER CHECK lines for defender premises 1 to 3. These lines are cut verbatim from debate_enforcer_log 51422 full_reply, 'reasoning' field; ac542_51422.txt, md5 d99ea2c3, 7,014 characters.
   - KNOWN BAD: premise 2 (row 51202) gives OLD exempt false, NEW exempt true. Premise 3 (row 51203) gives OLD false, NEW true. So NEW raises no item for either.
   - Also premise 1: OLD false, NEW true. Its Matthew 1:18 [CR4], 1:19 [CR4] and 1:25 [CR4] are MISSES with no MEETS. This is inside the plan's rule: the presses graded MEETS (1:20, 1:24) do not pass, and the others do.
   - LIMIT: this is sol's later full reply, not the text the raise read. That text is not stored (the plan's NOT SEARCHED).
   - Unit cases (W1's t542 cases, plus two):
     - [CR4] MISSES: OLD false, NEW true.
     - [CR2] MISSES: OLD false, NEW true.
     - [CR4] MISSES with [CR4] MEETS: false both.
     - [CR3] MISSES with [CR4] MEETS (the 12 groups): true both.
     - [CR40]: false both.
     - [CR1] MISSES: false both.
     - [DR4] MISSES on a DEFENDER premise: false both.

## NOT RUN: plan criteria 4(a) to 4(d), the full raise replay
- 4(a) to 4(d) need, for each stored judgment, the text the raise read and the run's rounds, put through kunxLines (index 462 onward) with its whole chain.
- I have neither in bulk. W4 reads execution data, and my direct n8n read was denied. The stored verdict_raw is post-cure, and the SQL result comes back into context, not to a file.
- An SQL approximation, using the final verdict_raw and the ANSWER CHECK lines that name the item's premise, covers only 4 of the 87 general-raise rows. 83 rows have no premise-tagged ANSWER CHECK line in the stored text. 41418 sol has no debate_judgments row because it was removed.
  - On those 4 rows: 3 are exempt OLD already. 1 more drops NEW: row 46060, run 40958, sol, defender premise 6, CURED.
- This is too thin to stand as 4(a). The replay belongs with the seat that holds the execution data (W4), or a ruling on what stands in for it is needed. Until it is run, criteria 4 and 6 (the card's 4(b) count) are open.
