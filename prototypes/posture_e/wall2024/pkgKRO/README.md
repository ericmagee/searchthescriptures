# pkgKRO rev 1 (W4): K-S3 COUNTED reading made record-only. NOT FOR WRITE: an option for the operator (coordinator 03:27Z 11-10).
Built offline on live s103 (ba4a8db5). Write file parent_s103_KRO.json: against s103 only the Shared Library differs (30 sources rebuild equal).
Change: one reader line (pkgFUK rev 3 A). An answer holding COUNTED as a word (any case, no letter next to it) cures as before s96, unless it opens with NOT COUNTED or holds TOUCHES NO LINK (read as live). When the live strict test would refuse it, the reason gets "(NOTED, record-only: the strict reader would refuse it ...)". The prefix "answered: the close concession is counted" is kept, so pkgFUK rev 2 C2 and the other prefix tests are unchanged.
Results (kro_refusals_cured.txt, rulebook labels): W2 287: 0 of 199 correct answers refused (live 19); 79 of 88 refusals read CURED, 13 noted. W4 59: 0 of 36 correct refused (live 2); 23 of 23 refusals CURED, 1 noted. 14 refusals live enforces now read CURED, all 14 noted. 65 refusals read CURED on live too and carry no note.
Gate on s103 library: 862 node runs equal, GATE PASS. Rolled-back insert of a noted row: rows 1.
  node pkgKRO/build_KRO.cjs; FB=/mnt/project-files/wall2024/fetchback_live_s103.json node gate/pack.cjs pkgLIB/strip_KRO pkgLIB_KRO; node pkgFUK/parent_on.cjs /mnt/project-files/wall2024/fetchback_live_s103.json pkgLIB_KRO pkgLIB/strip_KRO pkgKRO/parent_s103_KRO.json

## rev 2 (W4, after W3 PASS of rev 1, Wall 3996)
Write file parent_s103_KRO2.json (Shared Library only vs s103). Cure rule = rev 1. Added: the pkgFUN rev 7 reader as a second record-only note.
W3's capitals improvement was built and LEFT OUT: it refused 4 of W3's own correct answers that rev 1 cures (rev2/caps_variant_w3good.txt).
Results: W2 287 and W4 59 readings equal to rev 1; 0 correct refused. Notes on refusals read CURED: W2 287 68 of 79 (rev 1: 13); W4 59 14 of 23 (rev 1: 1). 49 correct answers also carry a note. W3 134 correct: 2 not cured (same as rev 1, live refuses them). Gate GATE PASS on s103. Rolled-back insert rows 1.
