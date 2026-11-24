GRADE: ASK 595 follow-on, W3 drafts 1 (Wall 11522, commit a621df3d): (A) manual pairs em_pairs_595c_draft1.json d78a0876 PASS with F1; (B) AAR row aar_row_595c_draft1.sql 7e1e381d PASS. COMMIT: the W1 commit that adds this file.
RULES READ: engine manual s0 (body law); parts 14.0 v280 and 09.0 v285 at the pair sites; op doc s29 (ASK AAR SNAPSHOTS, ASK AAR SNAPSHOT CHECK); the_wall_manual s7.4.
OBJECTIVE MET: yes for both. The manual will say what the live code stores and reads, and the row states the write with its sources.

A. MANUAL PAIRS
1. Bases are the latest: 14.0 v280 d0314fbe and 09.0 v285 45fa7a37. Each OLD occurs once. The previews built in SQL equal W3's: 14.0 7,885 cbb62f4a; 09.0 39,071 368050fa. PASS.
2. 14.0 against live QR Final and QR Follow Final (1afd3099): a refused item gets status DROPPED, with ...(ok?{}:{first_reply:String(...), second_reply: second==null?null:String(second)}) and, for a continuation, {reply:String(...)}, with no slice; a passing item adds no reply field. The sentence matches. PASS.
3. 09.0 against live mlsBlock (Shared Library): key = the first six words of the folded MEANS quotation; the block is the first line holding it plus up to 7 following lines (j < i+8); it stops at a blank line or at /^\s*(?:\d+[.)]\s|MEANS\b|LINK\s+\d|(?:[1-3] )?[A-Z][a-z]+ \d{1,3}:\d{1,3}\s*["“])/; it is returned whole. The sentence matches, with one exception:
   F1 (fix before the card): "a line that begins with a number" is wider than the code. The code stops only at a number followed by a full stop or a closing parenthesis and a space ("1. ", "2) "). A line that opens "3 times ..." does not stop the block. Write "a numbered item (a number, then a full stop or a closing parenthesis)".
   Optional: "the line" -> "the first line" (the code returns the first line that holds the six words).
4. No sentence in any live part states the removed 2,000 or 1,500 cuts. My search for 1,500 and 2,000 near MEANS, block, DROPPED or reply finds 11.1, 17.1, 09.1 and 09.2, and each is a different cut. PASS.
5. Section 0: no provenance beyond the ASK tag. PASS.

B. AAR ROW
1. prior_row resolves to row 162 (ask 595 rev '1'). Status 'read back' and objective_met 'in part' are allowed by the table's CHECKs. PASS.
2. Audit 41371: W4's write row, 13:58:09Z, card "Write it" 13:57:05Z (07:57 CST), engine 04273989 to 1afd3099, child c9acb53a to 18570075, and the five engine nodes plus the child's Shared Library. It matches the row. PASS.
3. md5_written: I confirm bbf4b8d5 (target_engine_cuts.json) and 9aff19ee (target_child_cuts.json); those are the files I graded at 11490 and read back at 11514. Every other md5 in build_files and revert matches my md5sum (15 files). PASS.
4. The readback entry matches Wall 11514. The run line matches the record: no run on 1afd3099, last row run 42071. PASS.

R1 (W3 item 5), W1's word:
- My R1 at Wall 11490 asked for two things: how many MEANS blocks run past 1,500 on 37203, 41822 and 42071, and whether any pkgMLS result differs. It also asked the card to say so in plain words.
- I reran W4's r1_mls.cjs now. The output is byte-equal to the stored out_r1_mls.txt (b4ada2de): over 1,500, 17, 39 and 72 blocks; with an [L2] or [L3] after the cut, 0, 9 and 11.
- Verdict: R1 is met IN PART. The counts are measured. Whether a result differs is given as a bound, not a replay: 37203 cannot change, and 41822 and 42071 can. The card (48aa5a92) says exactly that in plain words, including that the replay was not run, and the operator pressed on that text.
- MY MISTAKE: I did not post a check of W4's R1 answer (Wall 11493) before the press at 07:57 CST. I should have checked it in the same session it was posted. The row's sentence saying so is correct and should stand. Nothing was written on a wrong figure, since my rerun matches.
STANDARD (ASK 599): no code; rule 3 (no one's words cut) is what this write serves.
