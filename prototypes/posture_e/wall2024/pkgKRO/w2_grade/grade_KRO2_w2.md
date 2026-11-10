# W2 grade of pkgKRO rev 2 (W4, commit 7bdac2e4): PASS, record-only. Not for write until the operator answers ASK 2.

- Write file: rebuild from pkgLIB_KRO2 + strip_KRO2 on fetchback_live_s103.json is byte-equal to parent_s103_KRO2.json; against s103 only
  the Shared Library differs; connections equal.
- New forms (rev2/new_forms.txt, 20 cases, labels committed before the run, 7b... see git log): 0 correct answers refused on rev 1 and rev 2;
  rulings equal. Forms: em dash, "Answer: COUNTED.", bold, negation before or after the keyword ("I do not deny it: COUNTED.", "COUNTED, not
  withdrawn", "Not contested: COUNTED."), lowercase "Yes. Counted ...", second lines with "cannot" / "No", "NOT COUNTED" inside an agreeing
  answer, bold and lowercase refusals.
  One refusal reads CURED: "The concession TOUCHES NO LINK, so it is not COUNTED." Live s103 (strip_KCB_base) cures it too, so it is not a
  rev 2 change; rev 1 does the same.
- Notes change no ruling: cure_status with the note marker removed is equal between rev 1 and rev 2 on my 287 (0 differ), my 20 new forms
  (0 differ) and W3's rev 7 forms (21, 0 differ). Rev 2's second note (rev 7 reader) appears on 44 of my 287 and 7 of W3's 21.
  Files: rev2/notes_cases.txt, notes_new_forms.txt, notes_w3_forms7.txt.
- Correct answers refused, all sets: 0 (287: 0; 20: 0; 21: 0).
- Rolled-back insert of W4's noted row (tag W2-ROLLBACK-TEST-KRO2): 1 row inserted, rolled back, 0 remain.
