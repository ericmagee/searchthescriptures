# pkgKAG: the key-word reader reads "I accept that" and "I agree that" (ASK 135 option 1, item d)

- Parent: fetchback_live_s164.json (live s164). Output: /mnt/project-files/wall2024/parent_s164_KAG.json.
- Changes only the Shared Library, kwLines421 (library lines 2218, 2221, 2222, 0-based). MAP lengths and library sha recomputed as pkgOAD.
- Read: "I accept that" / "I agree that", with up to two adverbs before the verb, as the other forms. Like the other new forms (pkgKGL) they take no cap slot.
- Skipped: "that" as a pointing word before a noun (W3 class B, Wall 5446): one lowercase word, not a pronoun, with at most an "in/of/on the" phrase of one or two words, then a stop, dash, "and" or "against".
- Pointing back (class C): "I accept that." / "that, and ..." / "that -- but ..." / "that as ..." take the clause before "I", or when none the sentence before (the live rule for "I grant it."). A bare "I agree that." with nothing before is dropped, as live drops a bare "I grant it.".
- Unread by the live rules: negated ("I do not accept that", "I cannot agree that", "I never accept that"), "I would accept that", "If/Unless I accept that ..." (pkgGAV skip), a question, the other side's quoted words (class D, live quote rule).
- Not in scope: "I accept the ...", "I agree with the challenger that ...".
- Size, MEASURED: code +462. Prompt (K-W lines plus marks): W4's 91 stored runs +17,524 (29 items added, 0 lost; most in one run +2,386, 4 items); corpus2 81 runs +2,918 (5 added).
- Proof: test_KAG.cjs 38 of 38 (test_KAG_out.txt; live reads none of them); pkgKGL plants 37 of 37 unchanged; scan_out.txt (every added line read by me: all grants of a statement or pointing back). Packing check 43 stubs, 2 throwing.
- Limits: "I agree that knowing in the flesh begets." style (lowercase word plus a two-word phrase then a stop) would be skipped; the grants list does not read these forms (the two readers now differ on them).
