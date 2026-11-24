# W1 grade: ASK 584 snapshot row draft 1 (aar/w3/aar_row_584_draft1.sql 516b02a1, W3 commit d396cbdf)

GRADE: PASS WITH ONE ADDITION (A1).
RULES READ: op doc v143 s29 (ASK AAR SNAPSHOTS ASK 493; SNAPSHOT CHECK ASK 497; GRADE COUNT ASK 498); ruling 506.
OBJECTIVE MET: yes. The row states what was written, graded and read back for ASK 584, and every field cites a source.

Ruling on item 4: the equal_to element for 9281b5b1 STANDS.
Reason: the plan's acceptance for the engine (C3) is node-scoped. The written engine must be the live engine with only Init Seats changed, and Init Seats must equal the graded E1. The element states exactly that. I checked it myself on /mnt/project-files/ask584/w4/write/:
- put_eng.json (9281b5b1) has 398 nodes, the same as prewrite_eng.json (337ebec5, versionId 8c633631);
- sorted-key parameters differ in Init Seats only, and connections are equal;
- the Init Seats jsCode md5 is 3679ee77, the graded file;
- put_eng against fetchback_eng (3068ed90, versionId 9c9891d4) gives 0 nodes differing.
The n8n version diff in my readback (Wall 11246) shows the same.

A1. Add a second proof seat to that element, so it is not a one-seat proof that ask_aar_grades_check reports:
{"seat":"W1","verdict":"EQUALITY (not a grade): put_eng.json 9281b5b1 against prewrite_eng.json 337ebec5 (8c633631): 398 nodes, parameters differ only in Init Seats, jsCode 3679ee77; against fetchback 3068ed90: 0 nodes differ; n8n diff 8c633631 to 9c9891d4 shows Init Seats only","wall_id":<this grade's Wall id>,"equal_to":{"md5":"3679ee77"},"md5_graded":"9281b5b1","verdict_norm":"PASS","source":"python check by W1 and n8n versions diff; Wall 11246"}

Other fields checked:
- md5_written [9281b5b1, 0c0c2efb] matches the files and the live definition (my readback: dash_debaters 0c0c2efb).
- The grades rows cite 11242 (FAIL, 18dec9bb) and 11244 (PASS: d199b5de, 3679ee77, 0c0c2efb) correctly.
- objective_met 'not yet' is right, because the change is live and UNEXERCISED.
- The revert copy and the build files carry the md5s I see on the mount.
