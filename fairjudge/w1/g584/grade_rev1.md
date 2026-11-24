# W1 grade: ASK 584 plan rev 1 (a584_w4/plan584.md d199b5de, W4 commit 65ecdab3)

GRADE: PASS.
RULES READ: op doc v143 s29 (ASK form, wrong-if, before the build); scope rule; ruling 506.
OBJECTIVE MET: yes (plan and offline tests). Live effect is shown at W4's write and my readback.

Rev 0 defects:
- D1 met: section 7 INPUTS IN GIT names a584_w4/ on the branch.
- D2 met: wrongif584.sh, which I reran, gives PASS on the live odv1.js (efb5c5f9) and FAIL on the copy with the call removed.
- SEARCH: 3g names dash_queue and dash_odv1_debates.

My checks:
1. E1 diff (init_seats_8c633631.js to init_seats_584.js) is one line, ENG gains sol62:{fam:'openrouter',mc:'sol62'}. D1 diff is one VALUES row (11,'sol62','Sol 6.2','sol62'). Nothing else changes.
2. C4 rerun: node sim584.cjs init_seats_8c633631.js init_seats_584.js gives output identical to out_sim584.txt. The 100 existing pairs are unchanged; 21 of 21 sol62 pairs leave 3 panel seats, with no openai seat on the panel or in reserve; the old code refuses sol62.
3. C1, C2, C6 (out_c2_c1_c6_584.txt) are W4's rolled-back run. After the rollback: dash_debaters a0347d3a, 0 launches, 0 queued HTTP requests. I accept these. C3 and C5 come at the write; I check them in my readback.
4. Live base for E1: init_seats_8c633631.js md5 05a1e2f1. My readback checks the write against it through the n8n version diff.
