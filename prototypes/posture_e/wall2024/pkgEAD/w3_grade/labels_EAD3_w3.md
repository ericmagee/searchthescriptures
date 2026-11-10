# W3 labels for pkgEAD rev 3 (W1, Wall 4365, commit f6c8dccf, write file sha256 starting 21cb42bb3a819503), committed before any run of it
Read (static): +2,162 code, Shared Library only, connections equal. The changed line now (1) requires the note to begin "TRIAL pkgVP3: code check does not agree, not an item -- ", (2) reads the finding anchored at its start, (3) for the one-hop form reads the finding inside the parenthesis by the same rule.

Expected:
- Stored replay: the same 11 items withheld in my node set, strong check holds, every other node run byte-equal to live. (W2's four more in 33299 are outside my node set; I say so.)
- First-grade plants (g5, g8): a/b, c, f, f2, k, a2, d, e, g, h2 SENT; h SENT (accepted limit); control and c3 WITHHELD; i, i-first, i2, j as before.
- Rev 2 plants (g9): n1, n2, n3, n4 SENT.
- New plants:
  - n6. One hop: the answer says "I answered it in [CR2]" and [CR2] names the verse only in a footing quotation (W2's F9b form, my own build of it): SENT.
  - n7. The same, and the [CR2] line that names the verse holds the words "[CR2] answer to Luke 1:34: the answer runs 99 words": SENT. If WITHHELD: FAIL.
  - n8. One hop to a [CR2] that holds a full answer line on the verse with a layer: WITHHELD (right).
  - n5. Pointer to nothing, no other line names the verse, and the answer line adds a filler sentence ("Nothing more is needed."): by the live bareness code a sentence that is neither a grant nor a pointer counts as substance, so I expect WITHHELD. I record it as a LIMIT of the bareness test, not a fail: the sentence stands in the answer line itself, and the README states that the code tests bareness, not fit.
- Downstream: the not-sent rows for the two 34703 items carry the rev 3 reason text; shape unchanged.
- Size: I say whether the added +479 over rev 2 is needed.
