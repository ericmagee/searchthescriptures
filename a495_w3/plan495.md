# ASK 495 plan rev 2 (W3, seat 33, 11-19; replaces rev 0 and rev 1; form per op doc v133 §29 THE ASK FORM, W1 9772): anyone with the Oracle Hardening Test webhook URL can start paid model calls

## 1. OBJECTIVE
The workflow "TRUTH — Oracle Hardening Test (Live Ask)" (zwfk72lxBBf6ccJa) is published, and its webhook takes no credential (W1 Wall 9755). One request to that URL runs a live ask call and then a Claude drift-audit call, both paid. Expected effect: that URL no longer starts any call. Nothing the engine or the dashboard uses changes.

## 2. ROLES
Planner W3. Builder W4. Graders W1 and W2 (neither is the builder). The write is authorized by a card pressed in W4's thread. Readback by two non-writers.

## 3. SCOPE (with SEARCH, read 11:5x CST 11-19)
Scope: one workflow, zwfk72lxBBf6ccJa, unpublished. No node, function, grant or engine change.
SEARCH and hits:
 a. n8n search_workflows "Oracle Hardening Test": one hit, active true, triggerCount 1, updated 10-27 18:28Z. Its description: "Live Oracle test: live ask answers (debug), Claude drift-audits; saves to debate_results (variant oracle_test)."
 b. n8n executions of zwfk72lxBBf6ccJa: 13 retained, all mode webhook, all on 10-27 (13:54Z to 19:02Z; 11 success, 2 error). None since.
 c. debate_results variant oracle_test: 209 rows, 06-10 to 10-27 19:04Z. None since.
 d. Callers of its webhook: public DB functions name only the webhook paths db-update-notify (md_notes_notify, notify_n8n_row_update) and oracle-debate-v1 (dash_launch_odv1), so none of them is this workflow. The dashboard (a482_w1/base and deploy/src) and the whole repo at the branch head have no hit for "oracle-test", "oracle_test" or "hardening".
 e. The REST scan (a466_w4/n8n_rest_targets.json) lists two of its nodes: Save to DB (POST debate_results) and Fetch Guards (GET drift_guards).
 f. The engine (moMxiV4Irg1uRBZN), the Alternate Pass child (MqQHRl7mQQ0z8QdT) and Cure Call (c7366RPLb8vdMQg6) are not in scope, since this ASK changes none of them. No hit for zwfk72lxBBf6ccJa in the engine copy at versionId dd636c25.
 NOT SEARCHED: the node text of zwfk72lxBBf6ccJa itself (its webhook path, node credentials and header values). It was not read, per the team call at 11:45 CST that no key value enters a transcript. W1 9755 read its webhook (no credential) and its Save to DB header role (anon). Nothing is reported gone.

## 4. CRITERIA and DONE
 (i) search_workflows shows zwfk72lxBBf6ccJa active false.
 (ii) get_workflow_history shows no new version from the step, since unpublishing changes no node.
 (iii) No execution of zwfk72lxBBf6ccJa starts after the step (search_workflow_executions, read at the readback and again at the next AAR).
 DONE: (i) to (iii) read back by two non-writers.
 Options: A (recommended) unpublish, as ASK 480 did for 12 DeepSeek workflows. Nothing is deleted, and this also settles ASK 492 C-1 choice (ii). B: keep it published and add Header Auth to the webhook; that needs a new credential and a caller that sends it, and none is known. C: no build.
 Revert: mcp__n8n__publish_workflow zwfk72lxBBf6ccJa, on the operator's word.

## 5. WRONG-IF
 1. Someone still uses the harness on purpose. Evidence against: no execution and no row since 10-27, and no caller in the DB, dashboard or repo. If the operator still uses it, option B is the fix instead.
 2. Another published workflow has an open webhook that starts paid calls. This ASK does not search for that. It needs a follow-up search across all active webhook workflows, by node type and authentication field only, and would be its own ASK.

## 6. RUN EVIDENCE
NO PROBE. The engine never calls this workflow, so no ASK 417 registry entry applies and no debate run can show it. The evidence is CRITERIA (i) to (iii).

## 7. INPUTS IN GIT
This plan, at a495_w3/plan495.md on branch claude/untitled-9jle0o; the commit is named on the Wall. The step and the revert are single n8n calls, so there is no script or SQL file. There is no offline test, because calling the URL would start paid calls.

## 8. STEPS
 S1 W1 and W2 grade this plan. No card.
 S2 W4 unpublishes zwfk72lxBBf6ccJa; waits on the card in W4's thread.
 S3 Two non-writer readbacks of CRITERIA (i) to (iii). No card.
 S4 W3 writes the manual entry; waits on the manual card in W3's thread. If 495 is written before 492, the 492 card drops its choice (i).
