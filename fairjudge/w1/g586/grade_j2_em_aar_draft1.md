GRADE: ASK 586 J2 W3 drafts 1 (Wall 11532, commit f816299e): (A) manual pair em_pairs_586j2_draft1.json 4315f93e PASS; (B) AAR row aar_row_586J2_draft1.sql f4ae87c5 PASS. COMMIT: the W1 commit that adds this file.
RULES READ: engine manual s0; part 08.0 v293 at the site; op doc s29 (ASK AAR SNAPSHOTS); rulings 382, 383, 428.
OBJECTIVE MET: yes for both.

A. 1. Base 08.0 v293 07124719 is the latest; the OLD occurs once. My SQL preview equals W3's: 44,456 characters, 0c7d707703aa0e42cd5fb7a895f65993. PASS.
2. W3 item 2, the four facts not read in code, checked by W1 against live engine 489b977b and child e086bb3a:
   - The check runs in Send Back Build and Alt Send Back Build (engine) and R2 Alt Send Back Build (child), at Shared Library line 3564. On the alternate pass only seated alternates are read (__lS from PCC.alt_seats and the E421/E428 alternate rows). TRUE.
   - Block rule: split on /\n[ \t]*\n/ (text between blank lines). TRUE.
   - Folding Q(): markdown marks [*_`] removed, lower case, curly double and single quotes folded, quote marks dropped, spaces collapsed (en and em dashes also folded to "-"). TRUE.
   - The pass stop before line 3564: the known stop (my J3 grade 11509, R1). TRUE.
3. Also checked word for word: the fault order (3, then 1, then 2) and each fault text; "first entry at fault", one item per line; the send-back text (J2C.reason) equals the draft; the record (LIB 2789) cure_reason text and the NO ANSWER suffix; response_line = the reply's whole line; never silence (LIB 2784 !it.l2g). The judges' text form and the DECIDES sentence stand twice each in Panel Build and Build Independent Verdict, and the form stands in the library send-back. PASS.
4. Section 0: no provenance beyond the ASK tag and rulings. PASS.
B. 1. All 16 file md5s in the row match my md5sum, including md5_written 73f58cb0 and 1ee36e0b. These are target B, which I graded at 11512 and which live equals (my readback, 11527). PASS.
2. Audit 41394 is the J2 write: card "Write J2, not counted" 14:11:45Z, base B, engine 1afd3099 to 489b977b, child 18570075 to e086bb3a. It matches. PASS.
3. prior_row NULL is right (no earlier 586 J2 row; 586 rows are 163 J1 and 164 J6). 'in part' and 'read back' pass the CHECKs; builders W4. PASS.
STANDARD (ASK 599): no code.
