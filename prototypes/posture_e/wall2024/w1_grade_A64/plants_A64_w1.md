# W1 grading set for W2's ASK 64 build (option 1, narrower form, on s128)

Recorded before any candidate file exists. A silent drop is a FAIL. "Served" means the text the RULE E-ANS check is given for the item.

## A. Pointer plants (the "link N" test)
| # | answer text holds | expected |
|---|---|---|
| A1 | "answered under link 3" | the LINK 3 block is served |
| A2 | "It fits Link 1 and Link 2." (33149 B40) | both blocks, or none with a stated reason; never Link 1 alone |
| A3 | "(Link 5)" | the LINK 5 block |
| A4 | "under link 10" with 10 or more links | LINK 10, not LINK 1 |
| A5 | "LINK 2" / "link 2" / "Link 2" | the same block in all three cases |
| A6 | "links 2 and 3" (plural) | both blocks, or none with a stated reason |
| A7 | "link 9" when the side has 6 links | nothing extra is served, the item is unchanged, no error |
| A8 | "blink 3", "linked 3", "linkage 3" | no pointer; the item is unchanged |
| A9 | "D3" or "C2" alone, no word "link" | per the build's stated scope; recorded as found |
| A10 | a pointer inside a KJV quotation ("...the link 2...", invented) | recorded as found (expect: no special handling) |
| A11 | a pointed block whose needed sentence sits past the 900-character cut | recorded; it is a limit, not a fail, if stated |
| A12 | no pointer at all | the item is byte-equal to live s128 |

## B. Later-round plants (the judges' rule follows later rounds)
| # | form | expected |
|---|---|---|
| B1 | answer in the pressed round, completed in the next round of the same side | per the build's scope; recorded |
| B2 | "as I answered in [CR3]" (an explicit round pointer) | per the build's scope; recorded |
| B3 | an answer only in a later round, with no pointer | per the build's scope; recorded |
| B4 | the other side's round named | nothing extra is served |

## C. Stored-run scan (all ten ex*_full.json; panel, alternate and R2 alternate check nodes)
1. Per run and per node, live s128 against the candidate: calls, items, items given extra text, and characters added.
2. Items with no pointer and no change in scope must be byte-equal to live.
3. Every changed item is listed with its pointer text and the block served.
4. Size: measured code and prompt (including the runtime RULE E-ANS length) against s128.
5. Runner check: the changed nodes still name every node they read.
6. 34852 B15 ("answered under link 3"): the naming answer the judges cited must fall inside what is served.
