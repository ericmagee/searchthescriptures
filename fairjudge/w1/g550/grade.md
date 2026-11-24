# ASK 550 build (W4, Wall 11103, ask550/w4): GRADE PASS (W1, seat 34)
Plan: BUILD_PLANS_draft2 P4 (edcffe67). Base: live ee70cf05 (W1 byte-equal copy, readback Wall 11092).
1. patch550.js (326f423d) applied by W1 to its live copy: equal to W4's target (8760f945) on every node parameter.
2. test550.js (3a690e96) rerun: ALL PASS, output equal to eae9d795. Only Build Save Body and Format Markdown change, each by its inserted block; connections equal; both parse.
3. Verdict word: the plan says "the word of its RESULT line"; its test line expected BROKEN (W1 Wall 10936 A, which was the keystone word, not the RESULT line). W1 checked the FULL stored verdict_raw of both removed seats in debate_results (41822; chatgpt 44,724 chars, sol62 70,312) with the block's own pattern: each holds exactly one RESULT line, CHALLENGER WINS. So the line is right and the plan's expectation was mine and wrong; the test inputs carry shortened excerpts, and the full texts give the same word.
4. Data path: Alternate Merge, Alternate Merge 1 and Pass Accumulate output enforcer_log (W1 read the live library), so AM.enforcer_log exists at run time; the block is inside try{}catch(e){}, so a missing field adds no line and no error (control run).
5. Scope: RN gains bracketed lines only; no other saved column and nothing counted changes. Items marked not counted / RECORD-ONLY are left out (consistent with 549).
Limit (stated by W4, accepted): gemini's line is tested on a synthetic alternates_tried entry (the stored row has no alternates_tried). Run evidence: the next run with a NOT SEATED alternate must show its line.
Order: 556 also inserts in Build Save Body (different anchor); each script patches the fresh fetch.
