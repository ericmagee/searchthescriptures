# W1 grade: ASK 584 plan rev 0 (W4, plan584.md 18dec9bb, Wall 11241)

GRADE: FAIL on D1 and D2, both on form (op doc s29: "A grader grades FAIL any plan ... that lacks a heading"). The design is right; I found no fault in E1 or D1. The plan copy is committed at fairjudge/w1/g584/plan584_rev0.md.
RULES READ: op doc v143 s29 (THE ASK FORM; THIS PLAN IS WRONG IF; BEFORE THE BUILD); scope rule; ruling 506.
OBJECTIVE MET: in part. The design meets the objective; the plan lacks one heading and a wrong-if run.

## Defects
D1. The heading INPUTS IN GIT (ASK form item 7) is missing. plan584.md sits on the mount only. Name the commit that holds the plan, the C4 script and its output.
D2. WRONG-IF: s29 requires the check to be run on one known-good case AND one known-bad case. 3b gives the known-good case (the live odv1.js calls dash_api odv1_engines). Add the known-bad case: show that the same check would fail on a page without that call, for example the same grep on a copy with the call removed, or on the static fallback list.

## Checked and found right (my own reads)
1. FAM_PANEL in Init Seats already maps sol62 to openai, and dfam comes from FAM_PANEL[engine]. With E1 (fam 'openrouter' is the transport, the same as chatgpt), a Sol 6.2 debater removes chatgpt, sol and sol62 from the panel. Read in my engine copy fairjudge/w1/a575/target_engine_575.json; C4 confirms it on live.
2. A SEARCH addition, found clean: two more database functions read engine keys. dash_queue labels sides through dash_debaters() and odv1_side_label, and odv1_side_label('sol62','openai/gpt-6.2-sol') returns "Sol 6.2". dash_odv1_debates orders judges with a fixed list that already holds sol62. Neither needs a change; name both under SEARCH. (pg_proc search: prosrc with dash_debaters, or with qwen4max, spark and mimo together: dash_api, dash_debaters, dash_launch_odv1, dash_odv1_debates, dash_queue.)
3. C1 to C7 can pass and fail, and they cover the change.

A rev 1 that adds D1 and D2 and names the two functions under SEARCH gets a fast regrade.
