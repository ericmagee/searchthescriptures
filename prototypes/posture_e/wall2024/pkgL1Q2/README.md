# pkgL1Q2 (W3 2896): the Commitment 12 KJV check reads single-quoted verse quotes

Two changes, both enforcer readers.
1. KKJV_Q, in 22 nodes, now also reads a single-quoted quote ('...' or ‘...’) after a reference. An in-word apostrophe (Mary's) neither opens nor closes the quote.
2. An opening single mark followed by "s " opens no quote. This covers a possessive right after the reference, as in Luke 3:23's. An opening mark followed by a space also opens no quote, as at the close of a quoted reference ('Exodus 6:23' -- ...). The same guard goes into pkgL1Q's ECL PAIR in the 4 Send Back nodes, which had this weakness too: on "Luke 3:23's 'of Heli...'" it read "s 'of Heli...".

Bases: the KKJV_Q nodes are taken from the first of --stack that has them (pkgDEC/patched, then pkgL1Q/patched), or from live s45 otherwise. The Send Back nodes are taken from --sbbase, pkgEB7/patched_full (the gap stack after 33411). Every anchor must occur exactly once, or the build stops. Fingerprints are in patched.plan.json.

Test (test_L1Q2.txt): 42 OK, 0 FAIL. The replay covers 271 node runs across the saved runs from 33218 on, and only 1 output changed: 33249 Panel Payloads, single judge, "(Luke 2:4; 'Is not this Jesus, the son of Joseph...' John 6:42)". It is now reported as NOT A VERSE QUOTE for Luke 2:4, which is exactly what the double-quoted form of the same line already gets. The 4 Send Back nodes changed no saved output.
