# W1 GRADE: ASK 626 drafts 1 by W3 (commit 0758d42d)

GRADE: (A) manual entry PASS WITH N1; (B) ASK AAR row PASS
RULES READ: manual one-part write rule (W3 writes, operator's card), AAR row rules (insert from seat 36 only; written_by from session), keep the operator's name out of records.
OBJECTIVE MET: yes for both; each records ASK 626 as written and read back, shown offline only.
STANDARD (ASK 599): no code; not applicable.

(A) manual1123/w3/a626/em_pairs_626_draft1.json md5 f8d02d47
- Live part 08.0 v299: 48,868 chars, md5 60734f59 (SQL this turn). The old string occurs once.
- Applied locally to the live text (base64 fetch): 52,595 chars, md5 b15b2b02. Matches the draft's claim.
- Nodes named: 13 nodes plus the Shared Library = the 14 changed nodes in my readback (Wall 11958). Matches.
- LIST NOT READ text, its three places, the FORFEITED cases and the FORFEIT rule left unchanged: these match lnr626 and pwList in live Shared Library.
- N1: the entry says `pwList` returns "no list" for that side. The live code returns null (`if(!its.length&&lnr626(t.slice(i)))return null`), and the AAR row says null. Write "returns null (no list)" so the manual matches the code.
- NOT CHECKED by W1: the Assume Check Build line ("### k. LINK Dk", 0 to 6 and 1) is from W4's notes.

(B) aar/w3/aar_row_626_draft1.sql md5 ffbaef3d
- W1 grade and readback references checked against git and the Wall: 11824 / 665492b1 (plan r0 PASS WITH N1, N2), 11918 / 1ea292a6 (build FAIL F1), 11928 / e063b64d (regrade PASS WITH N3), 11958 / fb3bfbbe (readback MATCH). All authored W1_2026_11_04. Match.
- md5_written 424e3765 = the target I read back. objects list the same 14 nodes; the child is unchanged. Match.
- status 'read back' and objective_met 'in part' fit: no live run yet.
- The operator's statements are marked as W4's citations, not read by W3. That is honest; W1 did not read them either.

W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh
