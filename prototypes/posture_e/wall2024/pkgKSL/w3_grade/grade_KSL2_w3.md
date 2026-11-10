# W3 regrade of pkgKSL rev 2 on s104 (W2, commit 6016633e): PASS.

Graded 00:06 CST 2026-11-10 (database time). Script pkgKSL/w3_grade/w3_plant_KSL2.cjs; outputs w3_plant_KSL2_*.txt; cases w3_good_ksl2.json (16), w3_bad_ksl2.json (10), w3_bad_ksl2b.json (7), and my rev 1 sets again (12 and 5).
Libraries: s103 strict reader (strip_KCB_base), s103 + pkgKSL rev 2, LIVE s104 (strip_KRO2), s104 + pkgKSL rev 2 (strip_KRO2_KSL, the candidate).

- Base and build: my rebuild of build_KSL.cjs on strip_KRO2 equals pkgLIB/strip_KRO2_KSL file for file. parent_s104_KSL.json against the s104 fetch-back: only the Shared Library differs, connections equal, 418 nodes. Size: Shared Library 603,700 to 604,776 characters (+1,076; 605,188 to 606,270 bytes, +1,082, +0.18%). No prompt text, no call.
- My rev 1 FAIL is fixed: "COUNTED:" with "the grant is not withdrawn" on the next line reads CURED on all four libraries; also "COUNTED:**", "**COUNTED:**", "COUNTED;" and "COUNTED," with a negation on the next line.
- 50 texts in all: 0 rulings differ between s103 and s103 + pkgKSL, 0 between live s104 and s104 + pkgKSL, 0 other log rows differ. No correct answer is refused by pkgKSL on either base.
- W1's hazard is closed: "COUNTED." followed by "As for #2: it should not be counted.", "On K-G1 #2: that is not right.", "Item 2 ... is not counted." carries no note.
- Rolled-back insert of a K-S3 cure row with the note: rows 1, recorded true.

## Notes, not fails (record-only on s104; they matter for an enforced reader stacked later)
1. A line naming another item or round ends the run for every line after it. "COUNTED." / "See DEFENDER CR3." / "It should not be counted." is not noted, while "COUNTED." / "It should not be counted." / "See DEFENDER CR3." is. An enforced reader on top can be passed by writing any other-item line before the refusal. (W1's H4 is the same family.)
2. Refusals the reader's own list does not hold are not noted with or without pkgKSL ("#1 is not counted after all.", "It is not counted, because the defender did not grant it."): a limit of the pkgKRO rev 2 note list, not of pkgKSL.
3. Same as live on all four libraries: COUNTED must open the RESPONSE line ("Yes." then "COUNTED: ..." reads UNCURED), and "TOUCHES NO LINK:" with its reason on the next line reads UNCURED. Both are correct answers refused by the live reader today; pkgKSL feeds the lines only to the COUNTED reading. A candidate for the next reader fix.
4. Under the s103 strict reader "COUNTED -" and "COUNTED (see below)" with a negation below read UNCURED with and without pkgKSL (the strict reader's own refusal); on s104 they read CURED with a note.
