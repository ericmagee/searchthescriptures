# W1 checks, 09:37 CST 2026-11-25. Seat 34, session_01H1X3ANxr57MZvsu7fHB9kh

## A. W3 corpus faults (fairjudge/w3/oracle_loss/corpus_faults_0932.md, Wall 12153), checked live
Served set checked: guard_served_sets guard 8 = 1578, 1822, 519, 10, 8, 9, 32, 23, 25, 50, 55, 266. No guard_served_sets row serves 24 or 1763.
1. CONFIRMED. kb_sights 32 holds "parthenos, the Septuagint's Greek rendering of almah, and the KJV's "virgin" in Isaiah 7:14 follows that Greek word" (pos 2544). 1578 strikes "Matthew quotes the Septuagint verbatim" (pos 816) per DG-49/52. DG-49: "neither L1 nor L2", "no conclusion rests on it". DG-49 is not compaction_read.
2. CONFIRMED, WITH ONE ADDITION. 1763 holds "the verse gives a sign and does not narrate the absence of a man" (pos 4315) and is not served; 1822 points to Sight 24 (pos 23168), not served. ADDITION: DG-57 (compaction_read) does carry an answer at this verse: "The verse never bears on absence of the Davidic seed (Rom 1:3; Sight 2; DG-8)". So the Oracle had a guard line, not a sight. NEW SMALL FAULT: 1763 credits its sign line to "DG-8", but DG-8 contains neither "sign" nor "1:23" (strpos 0).
3. CONFIRMED IN SUBSTANCE, ONE QUOTE MISATTRIBUTED. Sight 10 says "spiritual/covenant origin, never biological paternity"; it does not say "not the begetter". Sight 32 says "the covenant-origin marker, not the begetter" (pos 1863); 519 says "not the biological begetter". The anointing half is in 1822 ("covenant-origin and anointing marker") and DG-8 ("covenant-origin / anointing marker"), with Luke 3:22, Acts 10:37, Luke 4:18 in 1822. 1822 sets John 3 aside as "not womb rows" (pos 29217).
4. CONFIRMED. Sight 8: "Eperchomai = anointing and covenant presence language throughout." KJV pulled: Luke 11:22 (a stronger man), Acts 13:40 (judgment), James 5:1 (miseries), Acts 8:24, Luke 21:26, 21:35: none is anointing. 1578: "Neither denotes begetting at any row" (pos 4503).
5. CONFIRMED. DG-8 holds "Answer a 1:25 press with this order" (pos 5372) and "answer it from the seed chain above" (pos 3397).
6. CONFIRMED. Sight 32 "no row states the ground of the intent" (2015) and "the stigma" (2126); 266 "Matthew names no tradition" (5491); 1822 quotes Leviticus 19:19 whole (cattle, field, garment).
SMALL: CONFIRMED. 519 opens "RESOLVED 2026-06-22" and carries "[CORRECTED 2026-06-22, session 2c93fbde ...]" in served text.
NOT CHECKED: sights 9, 23, 25, 50, 55; the notes column; what the 42528 prompt actually held.

## B. Rows 235 to 238 confirmed (W3 drafts 2): 27 of 27 keys each, 0 changed, 1 builder row each, grades check ok.
235 (641) row_md5 a500f645e8f245f59eb47525b534d98c; 236 (638A) dded7e7476b20a4cb6644eb08f63546d; 237 (646) 48b11487be906b4a9b91713fa6d95528; 238 (634) a9d2ccdbfd249505f5208d0e0d266645 (ask_aar_snapshots_check).

## C. Row drafts 651 (788f1ef7) and 652 (dc374391): PASS
Plan md5s a6d624d4 and c82c1d69 match files; 12 build-file md5s match by md5sum -c; revert 60a8ddf0 matches. Grade elements match Wall 12101 (651 PASS WITH N1, 652 rev 0 FAIL F1, both on a6d624d4/bce5be7f), 12103 (c82c1d69 PASS), 12108 (1aa15175 PASS), 12152 item 3 (full md5). Readback 12129. Manual v334 matches my readback.
