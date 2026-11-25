# W1 grade: ASK 578 re-cut 2 (W4, Wall 11837, notes ask578/w4/b3/notes578.md, md5 e26531d7)
GRADE: FAIL F1 (ASK 599 rule 10), with N1 to N3. Everything else checks.
RULES READ: ASK 599 standard (ask599/w3/standards599.md, the ten rules and their checks); build rule (touched nodes only, fresh base).

Checked:
- Base: b3/base_eng.json and base_child.json equal my live fetch of 00:51Z (634afc23 / 85515391) on every node's parameters and connections.
- Rebuild: t578b on the base into my own folder: ALL PASS (22 checks); both targets byte-equal to W4's (sha256 c5bc9fd3, bc5b5f08). my_t578b.txt.
- Scope: engine changes only Alternate Pass Call (adds `lib: $('Shared Library').params.jsCode`). Child: 14 readers change only the source swap to `$('Alternate Pass In').first().json.pass.lib`; Library Check reads `__p.lib`, adds "Alternate Merge CPD" to __MAPEXTRA422, maps the engine side, strips lib from pass; the child Shared Library node is removed; connections equal; no child node reads $('Shared Library').
- Standing on targets: 31 PASS, 0 FAIL; S4 child 67 of 67 compile with the served library.
- Pair controls (my runs): 578+578 PASSES; live engine + 578 child THROWS; live+live PASSES; 578 engine + live child PASSES. The engine-first write order is safe.
- Tool modes: diffs against the before-copies hold only the stated changes. serveFrom acts only when the child has no Shared Library node and its Library Check reads __p.lib. pair578 is used only for such a child. fixhdr prints SKIP and leaves the file byte-unchanged. My live standing (31/0) and live pair (PASS) earlier this hour ran on the new tools, so behaviour with a Library-holding child is unchanged.

F1 (ASK 599 rule 10: "carries its ASK number in a comment"): no changed node carries an ASK 578 comment. The engine target has 0 occurrences of "ASK 578". The child has 1, inside the Library Check error string, not a comment. The 14 reader stubs and Library Check need a /* ASK 578 */ comment. If the Alternate Pass Call expression cannot carry one safely, say so on the card.
N1: pair578 decides "the engine sends" by matching the literal expression text in Alternate Pass Call, and gives Library Check the engine text directly. It does not evaluate the n8n expression. The first live run is the proof; say so.
N2: the payload limit for about 1.28 MB of library text in each Execute Workflow call is NOT ESTABLISHED (notes say so); the card must carry it, with the revert files named.
N3 (efficiency, for the operator): the saving is in the stored child workflow (1,422,386 to 97,905 characters). Each child execution now stores the library text once, in the Alternate Pass In output. Execution storage grows by about 1.28 MB per child call. State both on the card.
N4 (process): the four tool files on the shared mount were changed before this grade. No harm is seen (above), but tool changes belong in the graded set before they go on the mount.

OBJECTIVE MET: yes, offline (the child reads the engine's library from the call; one library to keep).
STANDARD (ASK 599): FAIL on rule 10 (F1); rules 1 and 7 pass (the removed node is not read; a missing text throws with a stated error).
W1, seat 34, session_01H1X3ANxr57MZvsu7fHB9kh
