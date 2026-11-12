# pkgKNC: the key-word reader cap no longer drops a withdrawal (ASK 135 option 1, item c)

- Parent: fetchback_live_s164.json (live s164). Output: /mnt/project-files/wall2024/parent_s164_KNC.json (variant A, recommended); parent_s164_KNC_B.json (variant B, no cap).
- Changes only the Shared Library, kwLines421 (library lines 2219, 2221, 2222, 0-based). MAP lengths and library sha recomputed as pkgOAD.
- Live s164: a side stops after 10 plain-form matches (grant, concede, withdraw, drop, do not claim, no longer claim), skipped matches included; adverb and admit forms take no slot (pkgKGL). Any match after the stop is never read, so a withdrawal that follows ten plain grants is lost.
- Variant A (rev 2, after W3's grade, Wall 5456): only listed plain "I grant" / "I concede" items take the 10 slots per side; a skipped match takes none; a plain grant past the 10 is passed over and the loop goes on, unless its listed text (with what it points back to) names a link (D1-D9, C1-C9, LINK n, link n): then it is read and takes no slot. Every withdrawal form, and every adverb, admit (and, with pkgKAG, accept/agree) form, is always read. Item ids before the old stop are unchanged.
- Variant B: no cap; every match read.
- Why A: B lists every plain grant of a text ("I grant it is said of Joseph"), MEASURED +6,390 characters per run on average and up to 56 items on one side; A keeps every withdrawal at about a quarter of that.
- Size, MEASURED: code A rev 2 +23 (rev 1 -27), B -104. Prompt (K-W lines plus audit marks): 
  - A rev 2: W4's 91 stored runs +164,661 (+1,809 per run on average, most in one run +7,026, 12 items); 285 items added (96 withdrawals), 0 lost; most items one side 23. corpus2 81 runs +79,569, 134 added, 0 lost. (Rev 1 was +148,610, 259 added.)
  - B: 91 runs +581,472 (+6,390 per run, most +27,436, 49 items); 1,004 added, 0 lost; most items one side 56. corpus2 +137,875, 232 added.
- Proof: test_KNC.cjs 17 of 17 (rev 2 adds five plants) (test_KNC_out.txt); pkgKGL plants 37 of 37 unchanged; scan.cjs outputs scan_A_out.txt, scan_B_out.txt. Packing check 43 stubs, 2 throwing.
- Limit (A): a plain grant that names no link, after 10 plain grants on a side, is still not read (718 such items over the 91 runs, B minus A; W3's bma.cjs finds 0 of them naming a link).
- Rebase: pkgKAG and pkgKNC built in either order give the same library (checked).
