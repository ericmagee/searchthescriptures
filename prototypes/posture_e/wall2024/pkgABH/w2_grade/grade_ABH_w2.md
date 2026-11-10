# W2 grade: pkgABH (W4, commit 795e4a5), seat W2_2026_11_04, 11-09 CST

VERDICT: PASS. Built on live s97.

## Checks
1. Rebuild with build_ABH.cjs on fetchback_live_s97.json: byte-equal to parent_s97_ABH.json. Against live s97 only the Alternate Build node changes; 418 nodes; connections equal.
2. The restored lines 7 to 13 equal the s79 stub's lines 8 to 14 (prewrite_s80_XK.json) with __M renamed __EM; __EM is not used before line 7 and __M (form 3 map entry) is not used after line 6.
3. Fault history confirmed: the s79 stub has the pkgE4 head; the s80 stub (prewrite_s81) and every later version run the source with $input = Get Early Alternate's reply.
4. Wiring unchanged since s79: Alternate Needed? -> Get Early Alternate -> Alternate Build -> Alternate Calls?; Get Early Alternate has alwaysOutputData and continueRegularOutput; the parameters of Get Early Alternate, Early Reply?, Early Alternate Reply, Alternate Needed?, Alternate Calls? equal s79's.
5. W4 probe on the stored node outputs of execution 34299: 7 OK, 0 FAIL (live s97 stub fails with the same "reading 'map'" error; ABH runs and equals the source run with Alternate Needed? as input).
6. My plants (w2_check_ABH.txt), 16 OK, 0 FAIL: an HTTP error item, the empty item from alwaysOutputData, a matching hash with empty choices, a matching hash with error set: output equals today's. A matching row next to an unrelated row: the call carries the matching early reply. Items that are not alternate calls are unchanged.
7. No log rows, so no rolled-back insert.

## Info (outside this package)
At s79 the name "Early Alternate Reply" also stood in the xAI reasoning carry-over list inside 10 HTTP call nodes (Cure Call, Panel Cure Call 1 to 3, FUM calls). At s80 (XK rev 2) those nodes became sub-workflow calls by design, so the list left the parent with them. That is not the pkgE4 head.
