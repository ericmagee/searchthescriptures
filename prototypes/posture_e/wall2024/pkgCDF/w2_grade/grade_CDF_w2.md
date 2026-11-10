# W2 grade of pkgCDF rev 1 (W1, commit 8b8d6313): FAIL (change 2, link read from marks)

- Rebuild from pkgCDR rev 11's write file is byte-equal to parent_s103_CDR11_CDF.json. W1's record_CDF reproduces 10 OK.
- Changes 1 (cap fills from round 3), 3 (LINK unknown read by id) and 4 (RECORD-ONLY FOR REVIEW note) behave as described in W1's checks.

Change 2 fails. The link read from a D/C mark is often another link, and a wrong link now reaches Record as a declared link.
- Planted (link_cases.json, labels committed before the run; link_run.cjs -> link_run.txt). The hint link is compared with the true link,
  then Record is given a CONFIRMED answer that copies the hint link:
  - K1: "### Press on D2" / "The challenger presses D1 to D6 in turn." / drop. CDF hint LINK 6 (true 2); copied answer BREAKS LINK 6.
    Rev 11: LINK ?, breaks nothing.
  - K2: drop sentence "..., which D5 never needed." under "Press on D2". CDF LINK 5; BREAKS LINK 5. Rev 11: LINK ?, breaks nothing.
  - K5: stored form from 33490, "The weight of D6 rests on D1 to D3." CDF LINK 3; BREAKS LINK 3. Rev 11: LINK ?, breaks nothing.
  - K3 control (header mark only): CDF LINK 3, right.
  - K4 (challenger, appended after the round's last LINK block): both rev 11 and CDF give LINK 6 from the "LINK n before" rule; my label
    (section "## 2.") is open to question, and the rule is not new in CDF.
- Stored debates (w2_spot.cjs -> w2_spot.txt): 52 hints resolved from ? to a number. None from a mark in the sentence; all 52 from the last
  mark before it, from 11 to 11,563 characters back. The marks are mostly references, not headers: "D1 to D6" in an opening line (33605,
  LINK 6 for a sentence about Matthew 1:16), "rests on D1 to D3" (33490, LINK 3), "The challenger says D3 assumes" (33575, LINK 3 for
  "That removes C5's third footing."), "(C1)" in a numbered list 9,090 characters back (33430), "the seed rows of C1" (33411, LINK 1 for a
  sentence headed "**LINK D3:**").
- Effect: on rev 11 a contradiction the enforcer cannot tie to a link is refused (and with CDF change 4, marked for review). With change 2
  the hint shows a number, and an enforcer that copies it breaks that link, even when it is the wrong one. That is a ruling change, against
  the README's "No ruling changes".
- Fix options for W1: drop change 2 and keep 1, 3 and 4; or print the guess as text ("LINK ? (near D6)") and keep the link field ?, so that
  Record's form check still applies; or read only a header line (a line that starts with ### / ## / ** and names one mark).

## rev 2 (commit b490f0a4): PASS, with one gap left open (predates pkgCDF)

- Rebuild byte-equal to parent_s103_CDR11_CDF.json; against rev 11 only Close Enforcer Build and Record differ; the mark code is gone.
  W1's record_CDF 10 OK.
- My wrong-link plants (link_run_rev2.txt): K1, K2, K5 now print LINK ? as on rev 11; the copied CONFIRMED answer breaks nothing and is
  marked RECORD-ONLY FOR REVIEW. K4 is unchanged from rev 11 (the "LINK n before" rule of rev 11, not pkgCDF).
- New checks cdf2_w2.cjs (labels committed before the run; cdf2_w2.txt): 11 OK, 2 FAIL.
  - Change 1: with 40 padding drops in rounds 1 and 2, a round 3 drop stays hinted (rev 11: pushed out); same hint set as rev 11 on 34108.
  - Change 3: "LINK unknown", "LINK none", "LINK not known" read by id. FAIL: "LINK N/A" and "LINK D6" are still unreadable lines, so the
    hint is left NO ANSWER (as on rev 11). "LINK D6" is a likely form, since the rounds name links D1 to D6: a true CONFIRMED written that
    way breaks nothing and is not marked for review.
  - Change 4: CONFIRMED with LINK unknown and both quotes found is marked for review and breaks nothing; LINK 9 (undeclared) and LINK ? with
    a forged closing quote are not marked; D6 with LINK 6 still breaks D6; log row shape kept.
- Verdict: PASS for what rev 2 claims; no ruling change. The "LINK D6" / "LINK N/A" gap predates pkgCDF; suggested follow-on: read
  "LINK D<n>" for the defender and "LINK C<n>" for the challenger as <n> (the enforcer's own answer, not a guess), and any other text as ?.
