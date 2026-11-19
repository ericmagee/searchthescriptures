# ASK 496 plan rev 0 (W2, seat 32, 11-19; form per op doc v134 §29 THE ASK FORM): pause the Debate Findings Pipeline

## 1. OBJECTIVE
The operator, card in W2's thread, 18:25:54Z 11-19: chose "B. Pause it" on "Decide what happens to the hourly Findings Pipeline workflow".
The workflow "TRUTH — Debate Findings Pipeline" (i3bLxvLj6EL4yfak) runs hourly. Since 09-09 every run has re-read the same debate (c97b684c), got "[]" back from Sonnet, and written nothing (W2 9839, W1 9850). Since 11-15 every run has errored on the Anthropic usage limit.
Expected effect: the workflow starts no more runs. Nothing is deleted, and the 182 queued debates stay queued.

## 2. ROLES
Planner W2. Builder and writer W4. Graders W1 and W3 (neither is the builder). The write is authorized by a card pressed in W4's thread. Readback by two non-writers (W2 and one of W1 or W3).

## 3. SCOPE (with SEARCH, read 18:26Z 11-19)
Scope: one workflow, i3bLxvLj6EL4yfak, unpublished. No node, function, grant or engine change.
SEARCH and hits:
 a. n8n search_workflows "Findings": i3bLxvLj6EL4yfak is active true, triggerCount 1, updatedAt 2026-07-11T23:56:40Z.
 b. get_workflow_history: one version, 66f18454 (07-11 23:51Z).
 c. search_workflow_executions since 15:00Z: 4 runs, all mode trigger (the hourly schedule), all error (15:00Z, 16:00Z, 17:00Z and 18:00Z).
 d. Callers: no public DB function names i3bLxvLj6EL4yfak (prosrc search, 0 hits). In the repo at the branch head, the only hit is a466_w4/n8n_rest_targets.json, a REST scan list, not a caller.
 e. W1 9834 read the workflow live: version 66f18454, 13 nodes, a schedule trigger.
NOT SEARCHED: the other workflows' Execute Workflow nodes (they cannot be listed by target without reading each one). Its only trigger is the hourly schedule (W1 9834), and every execution reads mode "trigger".

## 4. CRITERIA and DONE
 (i) search_workflows shows i3bLxvLj6EL4yfak active false.
 (ii) get_workflow_history shows no new version from the step (newest still 66f18454).
 (iii) No execution of i3bLxvLj6EL4yfak starts after the step. This is read at the readback (the first hourly mark after the step, :00:40) and again at the next AAR.
 DONE: (i) to (iii) are read back by two non-writers.
 Revert: mcp__n8n__publish_workflow i3bLxvLj6EL4yfak, on the operator's word.

## 5. WRONG-IF
 1. Another workflow calls this one on purpose. Evidence against: the only trigger is the schedule, and every execution is mode trigger. If one exists, it errors visibly at the call, and the revert is one call.
 2. The operator wants findings staged soon. Then ASK E (fix the loop) comes first anyway (W2 9839, option E), and this pause does not block it.

## 6. RUN EVIDENCE
NO PROBE. The engine never calls this workflow, so no debate run can show this change. The evidence is CRITERIA (i) to (iii).

## 7. INPUTS IN GIT
This plan, at a496_w2/plan496.md on branch claude/untitled-9jle0o; the commit is named on the Wall. The step and the revert are single n8n calls, so there is no script or SQL file and no offline test.

## 8. STEPS
 S1 W1 and W3 grade this plan. No card.
 S2 W4 unpublishes i3bLxvLj6EL4yfak, on the card pressed in W4's thread.
 S3 Two non-writer readbacks of CRITERIA (i) to (iii), including the first hourly mark after the step. No card.
 S4 W3 writes the manual entry, with the next manual card.
