# W1 grade: pkgRLF (W2, commit 3f0386cb): PASS
- Code read: Close Enforcer Record only (+186); the line regex accepts [CRn]/[CR n]/round n; cecRL maps "round N" to the line's own side; every
  later check (side's rounds 1-3 / 4, both quotations word for word, declared link) is unchanged and runs on the mapped label.
- W2's test rerun here (node pkgRLF/test_RLF.cjs): output identical to the committed test_RLF_out.txt.
- My line reads (labels 6aaddc86 first; w1_lines_RLF.txt): 6 of 6 as labeled ([ round 4 ], ROUND 4, [Round 2] on a challenger line read;
  (round 4) and [round 04] recorded UNREADABLE, not dropped).
- The point to weigh (new breaks): 33442 send 2 newly breaks DEFENDER links 2 and 6, 33705 send 2 link 4. Each break is carried by the first
  confirmed line on its link, and each of those lines is one W3 read as TRUE (setBC_reading_w3.md):
  link 2: "I rest nothing on what the text does not name." against "neither verse puts a man in the sentence that gives the source";
  link 6: the same earlier sentence against "the verse names only the mother and the Holy Ghost"; 33705 link 4: "I do not press it as a
  correction of Mary's 'thy father.'" against "Mary's 'thy father' is answered in the next verse by ... (Luke 2:49)".
  The one FALSE line (33442 link 2, John 3:6) is the third line on link 2 and changes no outcome. W3's two doubtful lines (link 3) are in send 1,
  which already reads on live; pkgRLF does not touch them.
- Limit (as README): the fix stops discarding well-formed replies; it does not make the enforcer's reading right. A false CONFIRMED line that is
  the only line on its link breaks that link with or without pkgRLF (the live wrongful-break risk W3 named).
- Stacking: pkgRAC (FAILED, W1 4118) edits the same node; whichever is written second is rebuilt on the other.
