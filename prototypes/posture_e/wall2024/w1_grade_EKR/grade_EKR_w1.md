# W1 grade of pkgEKR (W2, Wall 4995): PASS WITH LIMITS

All of this is MEASURED, offline, by W1. Nothing was written.

**Parent:** /mnt/project-files/wall2024/parent_s141_JOINT_EKR.json, sha256 90ed187ca3defa13 (checked).
**Base:** live s142 (fetchback_live_s142.json), which equals the joint parent 3aa73d1c in all 418 nodes.

1. **Diff** (ekr_diff.cjs)
   - Only the Shared Library node differs, by +1,864. Connections are equal.
   - Library lines 3100, 3108, 3131 and 3159 change.
   - The 3 enforcer builder stubs rebuild: Judge +1,357, Alt +1,361, R2 Alt +1,361.
   - The role comes from each stub's own literal: panel in Judge Enforcer Build, alternate in Alt and R2 Alt.
   - Prompt: 0.
2. **Map check:** 42 stubs, 0 length or compile faults, and the header sha equals the computed sha.
3. **Replay** (ekr_replay.cjs, the 3 builders, s142 vs the parent, 12 exports)
   - 11 items are set aside, each with exactly 1 pkgEKR code row.
   - 0 other items are added or lost. Every other code row is equal.
   - The number of outputs is unchanged in every run.
   - Stored verdicts of the 11 items: 2 DISAGREE, both false (35173 grok E-KEY and luna E-RES, which was send-back S8), and 9 AGREE.
   - DeepSeek input, measured as the length of the call bodies:
     - 34626: -3,065
     - 34703: -5,835
     - 34726: -205
     - 35173: -5,552 (Judge -4,011, Alt -1,541)
   - W2's figures differ by 0.1 to 2 percent: they were measured on the same code by another method.
4. **Plants** (ekr_plants.cjs, the two tests taken from line 3100): 14 of 14 as expected. They cover:
   - BROKEN on a confirmed link
   - another link confirmed
   - STANDS
   - WITHDRAWN
   - only a challenger link confirmed
   - nothing confirmed
   - "contradictory"
   - DEFENDER WINS
   - UNDERDETERMINED
   - no contradiction word
5. **Limits**
   - (a) W2's limit (a) confirmed: the E-RES test reads the word "contradict", not the link. A RESULT that names D3 while D5 is confirmed is set aside.
   - (b) NEW: a negated form ("no contradiction is found; D3 fails on an unanswered press") is set aside too. It does not occur in stored text: all 11 set-aside lines are affirmative.
   - (c) NEW: a set-aside E-KEY line's ground is no longer checked against the debate's words. Example: luna's 35173 keystone ground "the conclusion that Christ had no biological father among men". All 9 stored AGREE, so nothing measured is lost.
   - (d) W2's limit (b) confirmed: a keystone graded STANDS or WITHDRAWN on a confirmed link is still asked.
