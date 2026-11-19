# ASK 495 plan rev 1 (form: W1 9772) (W3, seat 33, 11-19): anyone with the Oracle Hardening Test webhook URL can start paid model calls

## Objective
The workflow "TRUTH — Oracle Hardening Test (Live Ask)" (zwfk72lxBBf6ccJa) is published, and its webhook takes no credential (W1 Wall 9755). One request to that URL runs a live ask call and then a Claude drift-audit call, both paid. Close that path. Nothing the engine or the dashboard uses changes.

## Roles
Planner W3. Graders W1 and W2. Write by W4 on a card pressed in W4's thread. Readback by two non-writers.

## SEARCH (read 11:5x CST 11-19)
1. n8n search_workflows: active true, triggerCount 1, last updated 10-27 18:28Z. Its description says it is a test harness: "Live Oracle test: live ask answers (debug), Claude drift-audits; saves to debate_results (variant oracle_test)."
2. n8n executions: 13 retained, all mode webhook, all on 10-27 (13:54Z to 19:02Z; 11 success, 2 error). None since.
3. debate_results variant oracle_test: 209 rows, 06-10 to 10-27 19:04Z. None since.
4. Callers of its webhook:
   - DB functions: the only webhook paths named in public functions are db-update-notify (md_notes_notify, notify_n8n_row_update) and oracle-debate-v1 (dash_launch_odv1). None is this workflow.
   - Dashboard (a482_w1/base and deploy/src) and the whole repo at the branch head: no "oracle-test", "oracle_test" or "hardening".
   - Its node credentials and header values were NOT read (team call at 11:45 CST: no key value enters a transcript). W1 9755 read its Save to DB header role: anon.
5. Related: ASK 492 option A breaks this workflow's Save to DB (W1 9755 C-1). Its card offers (i) repoint the save or (ii) unpublish.

## Options
A (recommended). Unpublish the workflow (n8n unpublish, as ASK 480 did for 12 DeepSeek workflows). Its webhook stops answering. Nothing is deleted, and it can be republished on the operator's word. This also settles ASK 492 C-1 choice (ii).
B. Keep it published, and add Header Auth to its webhook node. That needs a new credential made by the operator in the n8n UI and a caller that sends it; no caller is known today. More work for a harness that has not run in 23 days.
C. No build. The URL stays open.

## Step (option A)
W4: mcp__n8n__unpublish_workflow zwfk72lxBBf6ccJa. No node edit, no wording, model or reasoning setting.

## Readback (two non-writers)
search_workflows shows active false for zwfk72lxBBf6ccJa. get_workflow_history shows no new version (unpublish only).

## Revert
mcp__n8n__publish_workflow zwfk72lxBBf6ccJa, on the operator's word.

## Test
None offline: the webhook URL is not reachable from the seats' containers, and calling it would start paid calls. The readback in the section above is the proof.

## WRONG-IF
1. Someone still uses the harness on purpose. Evidence against: no execution and no row since 10-27, and no caller in the DB, dashboard or repo. If the operator still uses it, option B is the fix instead.
2. Another published workflow has an open webhook that starts paid calls. This ASK does not search for that. It is a follow-up search across all active webhook workflows (by node type and authentication field only), and it would be its own ASK.

## CRITERIA and DONE
 (i) search_workflows shows zwfk72lxBBf6ccJa active false;
 (ii) get_workflow_history shows no new version from the step (unpublish changes no node);
 (iii) no execution of zwfk72lxBBf6ccJa starts after the step (search_workflow_executions, read at the readback and again at the next AAR).
 DONE: (i) to (iii) read back by two non-writers.

## RUN EVIDENCE
None in a debate run: the engine never calls this workflow. Evidence is the readback and the empty execution list after the step.

## INPUTS IN GIT
This plan, at a495_w3/plan495.md on branch claude/untitled-9jle0o (commit named on the Wall). The step and revert are single n8n calls named above; there is no SQL file.

## STEPS
 S1 W1 and W2 grade this plan.
 S2 W4 card in W4's thread: unpublish zwfk72lxBBf6ccJa.
 S3 Two non-writer readbacks of CRITERIA (i) to (iii).
 S4 W3 writes the manual entry; the 492 card drops its choice (i) if 495 is written first.

## Order
Independent of 492 and 494. If 495 is written before 492, the 492 card can drop choice (i).

## Not changed
No engine node, no function, no grant, no model, no wording, no reasoning setting.
