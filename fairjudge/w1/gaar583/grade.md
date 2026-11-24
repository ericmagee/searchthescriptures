# W1 grade: ASK 583 snapshot row draft 1 (aar/w3/aar_row_583_draft1.sql 324ca139, W3 commit c632fdf6)

GRADE: PASS.
RULES READ: op doc v143 s29 (ASK AAR SNAPSHOTS ASK 493; SNAPSHOT CHECK ASK 497; GRADE COUNT ASK 498); ruling 506; verify before assert.
OBJECTIVE MET: yes. The row states what was planned, graded, written and read back for ASK 583, each fact with a source, and 'in part' is right because C6 d is open.

Checks (each run by W1 at 21:3x CST 2026-11-23):
1. Form: both INSERT column lists equal those of aar_row_584_draft2.sql (passed Wall 11250).
2. Wall heads: 11210 FAIL f0f33bd7; 11213 PASS 1b250ac7; 11222 PASS 1229d74a; 11224 PASS d0c99b47; 11229 PASS (migration583.sql 4e7becd4); 11230 PASS WITH S1 (target_sync_6_4.json 66d76070); 11231 PASS K1 K2 (8d54dbb1); 11233 PASS (3361abc0); 11240 PASS (35c6fc5f). Each verdict and md5 in grades matches its head.
3. File md5s on /mnt/project-files: migration583 4e7becd4, test583 130ad0cc, put_sync 66d76070 = target_sync_6_4 66d76070, fetchback_sync 78d7a7f5, revert_sync b530a888, revert_defs583 32a9c2b8, cut583 35c6fc5f, section0_pairs cc2de440, section0_new_text 5b96de34 (the version graded at 11240), split583.py a4b8f522, ASK583_plan d0c99b47. All match the row.
4. Audit rows 40857 (6.3, W4), 40924 (6.4, W4), 40983 (cut) exist with those subjects.
5. Live objects: function def md5s apply cf92de39, toc 223c8229, part_apply 4a6d407d, part_split 6e55f42e, part ee848fe7, full 72ce328d, parts_guard b5970aee; engine_manual v241 d0e9efda 707,670; row 249 is version 242 (301 chars, the pointer); parts at v242: 31, largest 39,934; part 00.1 v243 8717b03f 3,068; 32 part rows through v243; engine_manual_log.part text, nullable. All match the row.
6. md5_written [4e7becd4, 66d76070, 35c6fc5f]: each is a PASS md5_graded in grades, so md5_match is expected true.

Notes (not conditions):
N1. The grades sources for 11224 and 11233 cite relays; both Wall heads exist and state the verdict, so "Wall 11224 head" and "Wall 11233 head" would be the direct source. Either form is true.
N2. revert583.sql (1182c9da) is named by path, not md5; the revert field names revert_defs583.sql 32a9c2b8. Acceptable as is.
