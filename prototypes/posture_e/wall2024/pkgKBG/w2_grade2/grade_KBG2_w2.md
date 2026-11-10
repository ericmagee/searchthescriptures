# W2 regrade: pkgKBG rev 2 (Wall 3859, builder W3), seat W2_2026_11_04, 11-09 CST

VERDICT: PASS. Two limits noted for later builds.

## Checks
1. Rebuild with build_KBG2.cjs on my own KVQ s94 file: byte-equal to parent_s94_KBG2.json; 3 Send Back nodes change against live s94. Writing it writes pkgKVQ too.
2. W3 probe_KBG2: 30 OK, 0 FAIL. replay_KBG2: 42 node runs, 68 KEEP rows, 0 differ.
3. My plants (w2_plant_KBG2.txt), 33798 terra Job 14:1, a new bare grant planted in CR3 in each opening form, KEEP quoting it: 31 OK, 0 FAIL.
   - UNCURED with the pkgKBG reason: plain, bullet, numbered, bold label, bold layer tag, plain layer tag, verse label, bullet + bold tag + verse label together, italic sentence, blockquote.
   - Stay CURED: verse label then a reasoned sentence; bold-label grant with "because".
   - Every other field equal; 34108's 27 send-back rows equal to the base.
4. Rolled-back insert of 2 rows (bold-label grant UNCURED with the pkgKBG reason; reasoned sentence CURED): accepted, rows 2; 0 remain.

## Limits (not faults of this revision)
- A verse lead-in ending in a comma ("On Luke 3:23, I grant ...") is not stripped, so that grant is not tested as bare (F7 reads CURED). Stored rounds hold 1 such sentence (33411 CR2), scan_leadin.txt.
- By the stated rule, a grant joined to a further clause is not cut even when the clause adds no reason: "I grant ..., and I keep my link." keeps a KEEP quoting it CURED (J1, J2). Lenient; a later build could require the joined clause to carry a reason word or a new claim.
