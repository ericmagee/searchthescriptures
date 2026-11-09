# W1 grade of pkgSTB (Wall 3826, commit 9980b10): PASS

Reproduced:
- strip_STB equals strip_VP1_s84 file for file. STUBV=3 pack of a copy: patched and e4_rebase byte-equal to the committed pkgLIB_STB.
- probe_STB rerun: 12 OK, 0 FAIL.
- Default form unchanged: with the edited pack.cjs and e4_rebase.cjs and no STUBV, the live library (strip_VP1_s84) packs to all 30 stubs, Shared Library and both e4 heads byte-equal to live s90 (33 of 33). My pkgFUK rev 3 packs byte-equal to its committed pkgLIB_FUK3.
Code read of the pack.cjs and e4_rebase.cjs diffs: form 3 stub reads /*LIB*/ up to /*MAP*/ and its own MAP entry by name; length check and run line unchanged; markers checked once each.

Independent test (the claimed gain, on a package other than the probe's):
- pkgFUK rev 3 packed in form 3: against pkgLIB_STB only Shared_Library.js differs; all 30 stubs and the e4 heads are byte-equal. The form 3 FUK3 parent differs from the STB parent in 1 node (form 2: 32).
- w1_probe_STB_FUK3.cjs (W3's probe A-C with live replaced by the form 2 FUK3 parent and the candidate by the form 3 FUK3 parent): 10 OK, 0 FAIL. A: 31 nodes rebuild the same source (9,978,731 bytes). B: runs 34108, 34016 and 33798, 31 of 31 nodes the same result each. C: missing entry, misfit entry and both mixed forms stop.

Notes for the write (W4):
1. Mixed forms stop the node with an error, so a partial write would stop a debate: all 32 nodes in one update, as the README says.
2. Any library package graded in form 2 on s90 (pkgFUK rev 3) is rebuilt in form 3 if written after pkgSTB; done above for FUK3, Shared Library only.
3. gate/STUBV must land in the same commit as the write record, or the next form 2 pack rewrites every stub back.
