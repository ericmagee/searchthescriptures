# W1 grade of pkgUOW rev 2 (W2, Wall 4960): PASS WITH LIMITS
File parent_s140_UOW2.json sha256 42512b47731b9cf4 (checked). Scripts: diff_UOW2.cjs, grade_UOW2.cjs; output grade_UOW2_out.txt.
- Diff against the s140 Shared Library (35173 export, versionId 5062d21e): only Shared Library differs in code, body or url; connections equal; 418 nodes. One change, "\w+\s+){0,3" to "(?!--)[^\s.;:,!?()—–]+\s+){0,8", +19 characters (measured), prompt 0.
- P1 4/4 as expected. P3 (12 exports, 1,754 distinct UNDERDETERMINED strings): live 584, rev 2 595; PASS to FAIL 0; FAIL to PASS the same 11 strings (4 lines) as rev 1, each a correct pass.
- New plants P5: "leaves (as was supposed) open" and "leaves Joseph’s house — open" fail; "leaves the so-called question open" and "leaves the record silent and open" pass. As expected.
- LIMIT 1 (carried from rev 1): narrative forms with no punctuation still pass wrongly ("leaves Joseph’s house and goes up to the open court", "leaves him and the door was open"). 0 of 36,807 KJV verses and 0 stored lines are of this form (measured on rev 1's window, which is wider than rev 2's).
- LIMIT 2: "leaves the matter -- for now -- open" fails (my plant expected pass). By design of the "--" stop; it errs toward a send-back, not toward a wrong pass.
