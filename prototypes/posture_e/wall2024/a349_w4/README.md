
## Rev 2 (after W3's FAIL at Wall 7356 and W1's FAIL at Wall 7358)
Defect: rev 1 left the Shared Library MAP n values unchanged, so 19 of the 45 library entries rebuilt to a length that did not match their n.
Fix: fixmap349.cjs sets each n to the rebuilt length and changes nothing else. It first confirms that live MAP text equals JSON.stringify of the parsed MAP, and that live has 0 mismatches.
Rev 1 to rev 2 changes only the Shared Library node.
t349.cjs now also checks that every MAP entry rebuilds to its n (rev 1 FAILS this test; rev 2 passes ALL OK).
Target: target_349r2.json.gz (sha256 of the unzipped file starts f5988464116a). W3's rb.cjs on rev 2: 45 entries, 0 bad.
