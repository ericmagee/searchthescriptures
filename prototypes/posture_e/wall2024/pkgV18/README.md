# pkgV18 (W1): single judge collision entries graded "DEFENDER LINK STANDS" (rulings item 12, HIGH)

Extract Independent Verdict (library node). Base live s45 ac8c201f4dac -> 8517637eafc3 (full source, pkgV18/patched).
- The v18 entry reader now takes "DEFENDER LINK STANDS" as STANDS and names it: "[AUDIT v18: Dn GRADED WITH THE OFF-LIST WORDING "DEFENDER LINK STANDS"; READ AS STANDS. REVIEW THIS ROW.]".
- test_V18 13 OK on 12 recent runs: 11 unchanged; 33345 loses the 4 "CARRIES NO ENTRY" + 4 "ENTRY NOT READ" flags, gains 4 off-list lines,
  map D1..D6 all STANDS, AUDIT FLAGS 29 -> 25. Nothing outside the v18 lines and the flag count changes.
- Deploy form: pkgLIB_v31 (pkgLIB v3 + this node's stub; library unchanged, json_sha 2bcad7830caf42c0). test_v31 4 OK.
